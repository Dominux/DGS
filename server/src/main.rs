use std::sync::Arc;

use migration::{Migrator, MigratorTrait};

use app::create_app;
use common::{config::Config, db::connection::get_db, routing::app_state::AppState};

mod app;
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

    // Getting url
    let url = format!("0.0.0.0:{}", config.port);

    // Creating app_state
    let shared_state = {
        let app_state = AppState::new(db, config);
        Arc::new(app_state)
    };

    // build our application with a single route
    let app = create_app(shared_state);

    // Logging about successful start
    println!("Server ran successfully at {url}");

    // run it with hyper on localhost:3000
    axum::Server::bind(&url.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[cfg(test)]
mod tests;
