use entity::games;
use sea_orm::{ActiveModelTrait, ActiveValue, DbConn, EntityTrait};
use uuid;

use crate::common::errors::{DGSError, DGSResult};

pub struct GamesRepository<'a> {
    db: &'a DbConn,
}

impl<'a> GamesRepository<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        Self { db }
    }

    pub async fn create(&self) -> DGSResult<games::Model> {
        let game = games::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            is_ended: ActiveValue::Set(false),
        };
        let game = game.insert(self.db).await?;

        Ok(game)
    }

    pub async fn list(&self) -> DGSResult<Vec<games::Model>> {
        Ok(games::Entity::find().all(self.db).await?)
    }

    pub async fn get(&self, game_id: uuid::Uuid) -> DGSResult<games::Model> {
        Ok(games::Entity::find_by_id(game_id)
            .one(self.db)
            .await?
            .ok_or(DGSError::NotFound(format!("game with id {game_id}")))?
            .into())
    }

    pub async fn delete(&self, game_id: uuid::Uuid) -> DGSResult<()> {
        let res = games::Entity::delete_by_id(game_id).exec(self.db).await?;

        if res.rows_affected == 1 {
            Ok(())
        } else {
            Err(DGSError::NotFound(format!("game with id {game_id}")))
        }
    }
}
