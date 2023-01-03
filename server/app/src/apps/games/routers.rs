use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};

use super::services::GameService;
use crate::common::routing::app_state::AppState;

pub struct GamesRouter;

impl GamesRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        Router::new()
            .route("/", get(Self::list_games).post(Self::create_game))
            .route("/:game_id", get(Self::get_game))
            .with_state(state)
    }

    pub async fn create_game(State(state): State<Arc<AppState>>) -> impl IntoResponse {
        let game = GameService::new(&state.db).create().await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(game)))
    }

    pub async fn list_games(State(state): State<Arc<AppState>>) -> impl IntoResponse {
        let games = GameService::new(&state.db).list().await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(games)))
    }

    pub async fn get_game(
        State(state): State<Arc<AppState>>,
        Path(game_id): Path<uuid::Uuid>,
    ) -> impl IntoResponse {
        let game = GameService::new(&state.db).get(game_id).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(game)))
    }
}
