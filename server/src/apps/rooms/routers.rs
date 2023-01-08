use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, patch, post},
    Json, Router,
};

use super::services::RoomService;
use crate::common::routing::{app_state::AppState, auth::AuthenticatedUser};

pub struct RoomsRouter;

impl RoomsRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        Router::new()
            .route("/", post(Self::create_room))
            .route("/:room_id", get(Self::get_room))
            .route("/:room_id/invite", patch(Self::accept_invitation))
            .with_state(state)
    }

    pub async fn create_room(
        State(state): State<Arc<AppState>>,
        user: AuthenticatedUser,
    ) -> impl IntoResponse {
        let room = RoomService::new(&state.db).create(user.user_id).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(room)))
    }

    #[allow(dead_code)]
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

    pub async fn accept_invitation(
        State(state): State<Arc<AppState>>,
        Path(room_id): Path<uuid::Uuid>,
        user: AuthenticatedUser,
    ) -> impl IntoResponse {
        let room = RoomService::new(&state.db)
            .accept_invitation(room_id, user)
            .await?;
        Ok::<_, (StatusCode, String)>((StatusCode::ACCEPTED, Json(room)))
    }
}
