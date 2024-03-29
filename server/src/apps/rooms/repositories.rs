use entity::rooms;
use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, DbConn, EntityTrait, QueryFilter};
use uuid;

use crate::common::{
    errors::{DGSError, DGSResult},
    routing::auth::AuthenticatedUser,
};

pub struct RoomsRepository<'a> {
    db: &'a DbConn,
}

impl<'a> RoomsRepository<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        Self { db }
    }

    pub async fn create(&self, user_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        let room = rooms::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            player1_id: ActiveValue::Set(user_id),
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

    pub async fn get_by_game_id(&self, game_id: uuid::Uuid) -> DGSResult<rooms::Model> {
        Ok(rooms::Entity::find()
            .filter(rooms::Column::GameId.eq(game_id))
            .one(self.db)
            .await?
            .ok_or(DGSError::NotFound(format!("room with game id {game_id}")))?
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

    pub async fn add_player2(
        &self,
        room_id: uuid::Uuid,
        user: AuthenticatedUser,
    ) -> DGSResult<rooms::Model> {
        // Checking if the game already has a second player
        let game = self.get(room_id).await?;
        if matches!(game.player2_id, Some(_)) {
            return Err(DGSError::CannotAddPlayer);
        }

        // Adding a player
        let mut game: rooms::ActiveModel = game.into();
        game.player2_id = ActiveValue::Set(Some(user.user_id));

        // Updating it
        Ok(game.update(self.db).await?)
    }

    pub async fn attach_game(
        &self,
        room: rooms::Model,
        game_id: uuid::Uuid,
    ) -> DGSResult<rooms::Model> {
        let mut room: rooms::ActiveModel = room.into();
        room.game_id = ActiveValue::Set(Some(game_id));

        Ok(room.update(self.db).await?)
    }
}
