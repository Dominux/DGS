use entity::rooms;
use sea_orm::DbConn;

use super::{repositories::RoomsRepository, schemas::CreateRoomSchema};
use crate::common::errors::DGSResult;

pub struct RoomService<'a> {
    repo: RoomsRepository<'a>,
}

impl<'a> RoomService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = RoomsRepository::new(db);
        Self { repo }
    }

    pub async fn create(&self, schema: &CreateRoomSchema) -> DGSResult<rooms::Model> {
        self.repo.create(schema).await
    }

    pub async fn list(&self) -> DGSResult<Vec<rooms::Model>> {
        self.repo.list().await
    }

    pub async fn get(&self, room_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        self.repo.get(room_id).await
    }

    pub async fn delete(&self, room_id: uuid::Uuid) -> DGSResult<()> {
        self.repo.delete(room_id).await
    }
}
