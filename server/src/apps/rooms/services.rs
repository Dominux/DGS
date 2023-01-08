use entity::rooms;
use sea_orm::DbConn;

use super::repositories::RoomsRepository;
use crate::common::{errors::DGSResult, routing::auth::AuthenticatedUser};

pub struct RoomService<'a> {
    repo: RoomsRepository<'a>,
}

impl<'a> RoomService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = RoomsRepository::new(db);
        Self { repo }
    }

    pub async fn create(&self, user_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        self.repo.create(user_id).await
    }

    pub async fn list(&self) -> DGSResult<Vec<rooms::Model>> {
        self.repo.list().await
    }

    pub async fn get(&self, room_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        self.repo.get(room_id).await
    }

    #[allow(dead_code)]
    pub async fn delete(&self, room_id: uuid::Uuid) -> DGSResult<()> {
        self.repo.delete(room_id).await
    }

    pub async fn accept_invitation(
        &self,
        room_id: uuid::Uuid,
        user: AuthenticatedUser,
    ) -> DGSResult<rooms::Model> {
        self.repo.add_player2(room_id, user).await
    }
}
