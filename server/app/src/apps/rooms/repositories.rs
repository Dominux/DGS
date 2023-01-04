use entity::rooms;
use sea_orm::{ActiveModelTrait, ActiveValue, DbConn, EntityTrait};
use uuid;

use super::schemas::CreateRoomSchema;
use crate::common::errors::{DGSError, DGSResult};

pub struct RoomsRepository<'a> {
    db: &'a DbConn,
}

impl<'a> RoomsRepository<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        Self { db }
    }

    pub async fn create(&self, schema: &CreateRoomSchema) -> DGSResult<rooms::Model> {
        let room = rooms::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            player1_id: ActiveValue::Set(schema.user_id),
            ..Default::default()
        };
        let room = room.insert(self.db).await?;

        Ok(room)
    }

    pub async fn list(&self) -> DGSResult<Vec<rooms::Model>> {
        Ok(rooms::Entity::find().all(self.db).await?)
    }

    pub async fn get(&self, room_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        Ok(rooms::Entity::find_by_id(room_id)
            .one(self.db)
            .await?
            .ok_or(DGSError::NotFound(format!("room with id {room_id}")))?
            .into())
    }

    pub async fn delete(&self, room_id: uuid::Uuid) -> DGSResult<()> {
        let res = rooms::Entity::delete_by_id(room_id).exec(self.db).await?;

        if res.rows_affected == 1 {
            Ok(())
        } else {
            Err(DGSError::NotFound(format!("room with id {room_id}")))
        }
    }
}
