use std::{collections::HashMap, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use futures::{stream::StreamExt, SinkExt};
use tokio::sync::Mutex;

use super::{
    schemas::{CreateGameSchema, RoomState},
    services::GameService,
};
use crate::{
    apps::{
        games::schemas::{InternalMsg, MoveSchema, MoveWithResult, WSError},
        users::services::UserService,
    },
    common::routing::{app_state::AppState, auth::AuthenticatedUser},
};

struct GameState {
    app_state: Arc<AppState>,
    rooms: Mutex<HashMap<uuid::Uuid, RoomState>>,
}

pub struct GamesRouter;

impl GamesRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        let game_state = Arc::new(GameState {
            app_state: state,
            rooms: Mutex::new(HashMap::new()),
        });

        Router::new()
            .route("/", post(Self::start_game))
            .route("/:game_id", get(Self::get_game_with_history))
            .route("/ws/:room_id", get(Self::ws_handler))
            .with_state(game_state)
    }

    async fn start_game(
        State(state): State<Arc<GameState>>,
        user: AuthenticatedUser,
        Json(schema): Json<CreateGameSchema>,
    ) -> impl IntoResponse {
        let game_with_link = GameService::new(&state.app_state.db)
            .start_game(schema, user)
            .await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(game_with_link)))
    }

    async fn get_game_with_history(
        State(state): State<Arc<GameState>>,
        Path(game_id): Path<uuid::Uuid>,
    ) -> impl IntoResponse {
        let game_with_history = GameService::new(&state.app_state.db)
            .get_game_with_history(game_id)
            .await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(game_with_history)))
    }

    async fn ws_handler(
        ws: WebSocketUpgrade,
        State(state): State<Arc<GameState>>,
        Path(room_id): Path<uuid::Uuid>,
    ) -> impl IntoResponse {
        ws.on_upgrade(move |socket| Self::websocket(socket, state, room_id))
    }

    async fn websocket(stream: WebSocket, state: Arc<GameState>, room_id: uuid::Uuid) {
        // By splitting, we can send and receive at the same time.
        let (mut sender, mut receiver) = stream.split();

        // User set in the receive loop, if it's valid.
        let mut user = None;
        // Loop until a text message is found.
        while let Some(Ok(message)) = receiver.next().await {
            if let Message::Text(token) = message {
                // Authorization
                let auth_result = UserService::new(&state.app_state.db)
                    .authenticate(token)
                    .await;

                // If not empty we want to quit the loop else we want to quit function.
                match auth_result {
                    Ok(auth_user) => {
                        user = Some(auth_user);
                        break;
                    }
                    Err(e) => {
                        // Only send our client error
                        let _ = sender
                            .send(Message::Text(serde_json::to_string(&e).unwrap()))
                            .await;

                        return;
                    }
                }
            }
        }

        // Now we know user is some
        let user = user.unwrap();

        // Checking if game is already loaded
        let room = {
            let mut rooms = state.rooms.lock().await;

            match rooms.get_mut(&room_id) {
                Some(room) => {
                    room.white_player.is_connected = true;
                    room.clone()
                }
                None => {
                    // Trying to load a game
                    let room_result = GameService::new(&state.app_state.db)
                        .get_room_state(room_id)
                        .await;
                    let room = match room_result {
                        Ok(room) => room,
                        Err(e) => {
                            let e = WSError::new(e.to_string());
                            let _ = sender
                                .send(Message::Text(serde_json::to_string(&e).unwrap()))
                                .await;
                            return;
                        }
                    };

                    // Inserting game into games
                    rooms.insert(room_id, room.clone());
                    room
                }
            }
        };

        // Subsribing
        let mut rx = room.tx.subscribe();

        // This task will receive broadcast messages and send text message to our client.
        let mut send_task = tokio::spawn(async move {
            while let Ok(msg) = rx.recv().await {
                // We don't send message if it's for another player
                match msg.receiver_id {
                    Some(receiver_id) if receiver_id != user.user_id => continue,
                    _ => (),
                }

                // In any websocket error, break loop.
                if sender.send(Message::Text(msg.get_msg())).await.is_err() {
                    break;
                }
            }
        });

        // We need to access the `tx` variable directly again, so we can't shadow it here.
        let mut recv_task = {
            // Clone things we want to pass to the receiving task.
            let tx = room.tx.clone();
            let db_clone = state.app_state.db.clone();
            let user_clone = user.clone();

            // This task will receive messages from client and send them to broadcast subscribers.
            tokio::spawn(async move {
                while let Some(Ok(Message::Text(move_schema))) = receiver.next().await {
                    let move_schema = match serde_json::from_str::<MoveSchema>(&move_schema) {
                        Ok(ms) => ms.clone(),
                        Err(e) => {
                            let e = WSError::new(e.to_string());
                            let e = serde_json::to_string(&e).unwrap();
                            let _ = tx.send(InternalMsg::new(Some(user_clone.user_id), e));
                            continue;
                        }
                    };

                    // Making move
                    let result = GameService::new(&db_clone)
                        .make_move(&move_schema, user_clone.clone())
                        .await;
                    let msg = match result {
                        Ok(move_result) => serde_json::to_string(&MoveWithResult::new(
                            move_schema.point_id,
                            move_result.died_stones_ids,
                        ))
                        .unwrap(),
                        Err(e) => {
                            let e = serde_json::to_string(&WSError::new(e.to_string())).unwrap();
                            let _ = tx.send(InternalMsg::new(Some(user_clone.user_id), e));
                            continue;
                        }
                    };

                    let _ = tx.send(InternalMsg::new(None, msg));
                }
            })
        };

        // If any one of the tasks exit, abort the other.
        tokio::select! {
            _ = (&mut send_task) => recv_task.abort(),
            _ = (&mut recv_task) => send_task.abort(),
        };

        // Deleting room states if all its players disconnected
        {
            let mut rooms = state.rooms.lock().await;

            // Poping room
            if let Some(mut room) = rooms.remove(&room_id) {
                // Setting current user as disconnected
                if room.black_player.player.id == user.user_id {
                    room.black_player.is_connected = false
                } else {
                    room.white_player.is_connected = false
                }

                // Inserting it back if there's still some connected player
                if room.black_player.is_connected || room.white_player.is_connected {
                    rooms.insert(room_id, room);
                }
            }
        }
    }
}
