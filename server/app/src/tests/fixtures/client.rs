use axum_test_helper::TestClient;
use entity::users::Entity as User;
use migration::TableCreateStatement;
use sea_orm::{ConnectionTrait, DbBackend, DbConn, Schema};

use crate::{
    app::create_app,
    common::{config::Config, db::connection::get_db, routing::app_state::AppState},
};

pub async fn create_test_client() -> TestClient {
    let config = Config::new().unwrap();

    let db = get_db(&config.db_uri).await.unwrap();

    let app_state = AppState::new(db, config);

    let app = create_app(app_state);
    TestClient::new(app)
}

async fn setup_schema(db: &DbConn) {
    // Setup Schema helper
    let schema = Schema::new(DbBackend::Postgres);

    // Derive from Entity
    let stmt: TableCreateStatement = schema.create_table_from_entity(User);

    // Execute create table statement
    db.execute(db.get_database_backend().build(&stmt))
        .await
        .unwrap();
}
