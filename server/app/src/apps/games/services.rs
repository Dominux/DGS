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

    pub async fn create(&self) -> DGSResult<games::Model> {
        self.repo.create().await
    }

    pub async fn list(&self) -> DGSResult<Vec<games::Model>> {
        self.repo.list().await
    }

    pub async fn get(&self, game_id: uuid::Uuid) -> DGSResult<games::Model> {
        self.repo.get(game_id).await
    }

    pub async fn delete(&self, game_id: uuid::Uuid) -> DGSResult<()> {
        self.repo.delete(game_id).await
    }
}
