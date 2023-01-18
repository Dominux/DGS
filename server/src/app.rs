use std::sync::Arc;

use axum::Router;
use tower_http::{
    cors,
    trace::{self, TraceLayer},
};
use tracing::Level;

use crate::{
    apps::{games::routers::GamesRouter, rooms::routers::RoomsRouter, users::routers::UsersRouter},
    common::routing::app_state::AppState,
};

pub fn create_app(app_state: Arc<AppState>) -> Router {
    let dgs_cors = cors::CorsLayer::new()
        .allow_methods(cors::Any)
        .allow_headers(cors::Any)
        .allow_origin(
            app_state
                .config
                .allowed_origins
                .iter()
                .map(|origin| origin.parse().unwrap())
                .collect::<Vec<_>>(),
        );

    Router::new()
        .nest("/users", UsersRouter::get_router(app_state.clone()))
        .nest("/games", GamesRouter::get_router(app_state.clone()))
        .nest("/rooms", RoomsRouter::get_router(app_state))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
    // .layer(dgs_cors)
}
