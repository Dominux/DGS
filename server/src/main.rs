use axum::{routing::get, Router};

use apps::users::routers::UsersRouter;
use common::{config::Config, db::connection::get_db, routing::app_state::AppState};
use migration::{Migrator, MigratorTrait};

mod apps;
mod common;

#[tokio::main]
async fn main() {
    // Creating config
    let config = Config::new().unwrap();

    // Creating a db connection
    let db = get_db(&config.db_uri).await.unwrap();

    // Running migrations
    Migrator::up(&db, None).await.unwrap();

    // Creating app_state
    let app_state = AppState::new(db, config);

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .nest("/users", UsersRouter::get_router(app_state));

    // Logging about successful start
    println!("Server ran successfully");

    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
