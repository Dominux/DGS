use migration::{Migrator, MigratorTrait};

use app::create_app;
use common::{config::Config, db::connection::get_db, routing::app_state::AppState};

mod app;
mod apps;
mod common;

#[cfg(test)]
mod tests;

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
    let app = create_app(app_state);

    // Logging about successful start
    println!("Server ran successfully");

    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
