use crate::common::{aliases::DBConnection, config::Config};

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: DBConnection,
    pub config: Config,
}

impl AppState {
    pub fn new(db: DBConnection, config: Config) -> Self {
        Self { db, config }
    }
}
