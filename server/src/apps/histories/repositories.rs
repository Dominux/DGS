use entity::{histories, history_records};
use sea_orm::{
    ActiveModelTrait, ActiveValue, ColumnTrait, DbConn, EntityTrait, QueryFilter, QueryOrder,
};

use super::schemas::{CreateHistoryRecordSchema, CreateHistorySchema, HistoryWithRecords};
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

    pub async fn create_record(
        &self,
        record: &CreateHistoryRecordSchema,
    ) -> DGSResult<history_records::Model> {
        let record = history_records::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            history_id: ActiveValue::Set(record.history_id),
            move_number: ActiveValue::Set(record.move_number as i32),
            point_id: ActiveValue::Set(record.point_id as i32),
            died_points_ids: ActiveValue::Set(
                record
                    .died_stones_ids
                    .iter()
                    .map(|rec| *rec as i32)
                    .collect(),
            ),
        };

        let record = record.insert(self.db).await?;

        Ok(record)
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
            .order_by_asc(history_records::Column::MoveNumber)
            .all(self.db)
            .await?;

        Ok(HistoryWithRecords { history, records })
    }
}
