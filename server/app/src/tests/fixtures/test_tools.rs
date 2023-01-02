use std::sync::Arc;

use axum_test_helper::TestClient;
use entity::users::Entity as User;
use migration::TableCreateStatement;
use sea_orm::{ConnectionTrait, DbBackend, DbConn, Schema, Statement};

use crate::{
    app::create_app,
    common::{config::Config, db::connection::get_db, routing::app_state::AppState},
};

pub struct TestTools {
    pub db: TestDB,
    pub client: TestClient,
}

impl TestTools {
    pub async fn new() -> Self {
        // Creating config
        let config = Config::new().unwrap();

        // Creating test db
        let db = TestDB::new(&config.db_uri).await;

        // Running db schema setup
        setup_schema(&db.db).await;

        // Getting test client
        let client = create_test_client(db.db.clone(), config).await;

        Self { db, client }
    }
}

async fn create_test_client(db: DbConn, config: Config) -> TestClient {
    let app_state = AppState::new(db, config);

    let app = create_app(Arc::new(app_state));
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

// Creates DB on object cretion and deletes it on object drop
pub struct TestDB {
    pub db_uri: String,
    pub db_name: String,
    pub db: DbConn,
}

impl TestDB {
    async fn new(db_uri: &str) -> Self {
        // Create database with UUID
        let db_name = {
            let id = uuid::Uuid::new_v4().to_string().replace("-", "");
            format!("test_{id}")
        };

        let new_db_uri = {
            let db = get_db(db_uri).await.unwrap();

            db.execute(Statement::from_string(
                DbBackend::Postgres,
                format!("CREATE DATABASE {db_name};"),
            ))
            .await
            .unwrap();

            format!("{db_uri}/{db_name}")
        };

        // Getting new db_conn
        let db = get_db(new_db_uri.as_str()).await.unwrap();

        Self {
            db_uri: db_uri.to_string(),
            db_name,
            db,
        }
    }
}
