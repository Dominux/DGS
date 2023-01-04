use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};

use super::{schemas::CreateRoomSchema, services::RoomService};
use crate::common::routing::app_state::AppState;

pub struct RoomsRouter;

impl RoomsRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        Router::new()
            .route("/", get(Self::list_rooms).post(Self::create_room))
            .route("/:room_id", get(Self::get_room))
            .with_state(state)
    }

    pub async fn create_room(
        State(state): State<Arc<AppState>>,
        Json(room_creation_schema): Json<CreateRoomSchema>,
    ) -> impl IntoResponse {
        let room = RoomService::new(&state.db)
            .create(&room_creation_schema)
            .await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(room)))
    }

    pub async fn list_rooms(State(state): State<Arc<AppState>>) -> impl IntoResponse {
        let rooms = RoomService::new(&state.db).list().await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(rooms)))
    }

    pub async fn get_room(
        State(state): State<Arc<AppState>>,
        Path(room_id): Path<uuid::Uuid>,
    ) -> impl IntoResponse {
        let room = RoomService::new(&state.db).get(room_id).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(room)))
    }
}
