use sea_orm::DbConn;

use crate::common::{errors::DGSResult, routing::auth::AuthenticatedUser};
use crate::{
    apps::{
        games::{repositories::GamesRepository, schemas::GameWithWSLink},
        rooms::repositories::RoomsRepository,
    },
    common::errors::DGSError,
};

use super::schemas::CreateGameSchema;

pub struct GameService<'a> {
    repo: GamesRepository<'a>,
    rooms_repo: RoomsRepository<'a>,
}

impl<'a> GameService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = GamesRepository::new(db);
        let rooms_repo = RoomsRepository::new(db);
        Self { repo, rooms_repo }
    }

    pub async fn start_game(
        &self,
        schema: CreateGameSchema,
        user: AuthenticatedUser,
    ) -> DGSResult<GameWithWSLink> {
        // TODO: turn this into atomic transaction

        let room = self.rooms_repo.get(schema.room_id).await?;

        // Validation
        {
            // Checking if a user is a first player so he has permissions to start game
            if user.user_id != room.player1_id {
                return Err(DGSError::UserIsNotPlayer1);
            }

            // Checking if there're all the players in a room
            if matches!(room.player2_id, None) {
                return Err(DGSError::Player2IsNone);
            }

            // Checking if game is already started
            if matches!(room.game_id, Some(_)) {
                return Err(DGSError::GameAlreadyStarted);
            }
        }

        // Creating a game
        let game = self.repo.create().await?;

        // Attaching it to the room
        self.rooms_repo.attach_game(room, game.id).await?;

        Ok(game.into())
    }
}
