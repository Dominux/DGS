use std::sync::Arc;

use axum::{
    extract::{
        ws::{Message, WebSocket},
        WebSocketUpgrade,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use futures::{SinkExt, StreamExt};
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
        .route("/websocket", get(websocket_handler))
        .nest("/users", UsersRouter::get_router(app_state.clone()))
        .nest("/games", GamesRouter::get_router(app_state.clone()))
        .nest("/rooms", RoomsRouter::get_router(app_state))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .layer(dgs_cors)
}

async fn websocket_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    println!("inside websocket handler");
    ws.on_upgrade(|socket| websocket(socket))
}

async fn websocket(stream: WebSocket) {
    // By splitting, we can send and receive at the same time.
    let (mut sender, mut _receiver) = stream.split();
    println!("inside websocket");

    let _ = sender
        .send(Message::Text(
            "lmao sup nibba, connection acquired".to_string(),
        ))
        .await;

    println!("after sending msg");
}
