use entity::games;
use sea_orm::DbConn;

use super::repositories::GamesRepository;
use crate::common::errors::DGSResult;

pub struct GameService<'a> {
    repo: GamesRepository<'a>,
}

impl<'a> GameService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = GamesRepository::new(db);
        Self { repo }
    }
}
