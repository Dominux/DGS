use std::sync::Arc;

use axum::Router;

use crate::{
    apps::{games::routers::GamesRouter, users::routers::UsersRouter},
    common::routing::app_state::AppState,
};

pub fn create_app(app_state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/users", UsersRouter::get_router(app_state.clone()))
        .nest("/games", GamesRouter::get_router(app_state))
}
