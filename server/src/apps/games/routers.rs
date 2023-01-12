use std::sync::Arc;

use axum::{
    extract::{
        ws::{WebSocket, WebSocketUpgrade},
        State,
    },
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};

use super::{schemas::CreateGameSchema, services::GameService};
use crate::common::routing::{app_state::AppState, auth::AuthenticatedUser};

pub struct GamesRouter;

impl GamesRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        Router::new()
            .route("/", post(Self::start_game))
            .route("/ws", get(Self::ws_handler))
            .with_state(state)
    }

    async fn start_game(
        State(state): State<Arc<AppState>>,
        user: AuthenticatedUser,
        Json(schema): Json<CreateGameSchema>,
    ) -> impl IntoResponse {
        let game_with_link = GameService::new(&state.db).start_game(schema, user).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(game_with_link)))
    }

    async fn ws_handler(ws: WebSocketUpgrade, State(state): State<Arc<AppState>>) -> Response {
        ws.on_upgrade(|socket| Self::websocket(socket, state))
    }

    async fn websocket(stream: WebSocket, state: Arc<AppState>) {}
}
