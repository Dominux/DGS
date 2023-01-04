use std::sync::Arc;

use axum_test_helper::TestClient;
use entity::{games::Entity as Game, rooms::Entity as Room, users::Entity as User};
use migration::TableCreateStatement;
use sea_orm::{ConnectionTrait, DbBackend, DbConn, Schema, Statement};

use crate::{
    app::create_app,
    common::{config::Config, db::connection::get_db, routing::app_state::AppState},
};

const DBNAME: &'static str = "test";

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

    // Creating tables
    let stmt: TableCreateStatement = schema.create_table_from_entity(User);
    db.execute(db.get_database_backend().build(&stmt))
        .await
        .unwrap();
    let stmt: TableCreateStatement = schema.create_table_from_entity(Game);
    db.execute(db.get_database_backend().build(&stmt))
        .await
        .unwrap();
    let stmt: TableCreateStatement = schema.create_table_from_entity(Room);
    db.execute(db.get_database_backend().build(&stmt))
        .await
        .unwrap();
}

// Creates DB on object cretion and deletes it on object drop
pub struct TestDB {
    pub db_uri: String,
    pub db: DbConn,
}

impl TestDB {
    async fn new(db_uri: &str) -> Self {
        let db = get_db(db_uri).await.unwrap();

        // Deleting and recreating test db
        for command in [
            format!("DROP DATABASE IF EXISTS {DBNAME};"),
            format!("CREATE DATABASE {DBNAME};"),
        ] {
            db.execute(Statement::from_string(DbBackend::Postgres, command))
                .await
                .unwrap();
        }

        let new_db_uri = format!("{db_uri}/{DBNAME}");

        // Getting new db_conn
        let db = get_db(&new_db_uri).await.unwrap();

        Self {
            db_uri: new_db_uri,
            db,
        }
    }
}
