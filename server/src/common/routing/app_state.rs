use sea_orm::DbConn;

use crate::common::config::Config;

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: DbConn,
    pub config: Config,
}

impl AppState {
    pub fn new(db: DbConn, config: Config) -> Self {
        Self { db, config }
    }
}
