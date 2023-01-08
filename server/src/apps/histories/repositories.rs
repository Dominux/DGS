use entity::{histories, history_records};
use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, DbConn, EntityTrait, QueryFilter};

use super::schemas::{CreateHistorySchema, HistoryWithRecords};
use crate::common::errors::{DGSError, DGSResult};

pub struct HistoriesRepository<'a> {
    db: &'a DbConn,
}

impl<'a> HistoriesRepository<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        Self { db }
    }

    pub async fn create(&self, history: &CreateHistorySchema) -> DGSResult<histories::Model> {
        let history = histories::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            game_id: ActiveValue::Set(history.game_id),
            field_type: ActiveValue::Set(history.field_type.clone()),
            size: ActiveValue::Set(history.size.into()),
        };

        let history = history.insert(self.db).await?;

        Ok(history)
    }

    pub async fn get_by_game_id(&self, game_id: uuid::Uuid) -> DGSResult<HistoryWithRecords> {
        // Getting a history itself
        let history = histories::Entity::find()
            .filter(histories::Column::GameId.eq(game_id))
            .one(self.db)
            .await?
            .ok_or(DGSError::NotFound(format!(
                "history with game id {game_id}"
            )))?;

        // Getting its records
        let records = history_records::Entity::find()
            .filter(history_records::Column::HistoryId.eq(history.id))
            .all(self.db)
            .await?;

        Ok(HistoryWithRecords { history, records })
    }
}
