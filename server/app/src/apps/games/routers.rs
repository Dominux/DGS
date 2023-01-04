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
        Router::new().with_state(state)
    }
}
