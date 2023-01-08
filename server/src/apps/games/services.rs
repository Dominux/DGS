use sea_orm::DbConn;
use spherical_go_game_lib::Game as Gamelib;

use super::schemas::{CreateGameSchema, MoveSchema};
use crate::{
    apps::{
        games::{repositories::GamesRepository, schemas::GameWithWSLink},
        histories::{
            repositories::HistoriesRepository,
            schemas::{CreateHistoryRecordSchema, CreateHistorySchema, MoveResult},
        },
        rooms::repositories::RoomsRepository,
    },
    common::{
        errors::{DGSError, DGSResult},
        routing::auth::AuthenticatedUser,
    },
};

/// Main game process service
pub struct GameService<'a> {
    repo: GamesRepository<'a>,
    rooms_repo: RoomsRepository<'a>,
    histories_repo: HistoriesRepository<'a>,
}

impl<'a> GameService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = GamesRepository::new(db);
        let rooms_repo = RoomsRepository::new(db);
        let histories_repo = HistoriesRepository::new(db);
        Self {
            repo,
            rooms_repo,
            histories_repo,
        }
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

        // Creating a game history
        {
            let history = CreateHistorySchema::new(game.id, schema.field_type, schema.size);
            self.histories_repo.create(&history).await?;
        }

        Ok(game.into())
    }

    pub async fn make_move(
        &self,
        move_schema: MoveSchema,
        user: AuthenticatedUser,
    ) -> DGSResult<MoveResult> {
        // Getting room
        let room = self.rooms_repo.get_by_game_id(move_schema.game_id).await?;

        // Checking if user is one of room players
        if user.user_id != room.player1_id && Some(user.user_id) != room.player2_id {
            return Err(DGSError::UserIsNotRoomPlayer);
        }

        // Getting game and history
        let game = self.repo.get(move_schema.game_id).await?;
        let history = self
            .histories_repo
            .get_by_game_id(move_schema.game_id)
            .await?;
        let history_id = history.history.id;
        let history_len = history.records.len();

        // Validating
        {
            // Checking if game is ended
            if game.is_ended {
                return Err(DGSError::GameEnded);
            }

            // Checking if player can make a move
            match history_len % 2 {
                0 if user.user_id != room.player1_id => return Err(DGSError::NotPlayerTurn),
                1 if user.user_id == room.player1_id => return Err(DGSError::NotPlayerTurn),
                _ => (),
            };
        }

        // Finally making move
        let died_stones = {
            let mut game = Gamelib::new_from_history(history.into())?;
            game.make_move(&move_schema.point_id)?
        };

        // Saving result as a history record
        {
            let move_number = history_len + 1;
            let record = &CreateHistoryRecordSchema::new(
                history_id,
                move_number,
                move_schema.point_id,
                died_stones.clone(),
            );
            self.histories_repo.create_record(record).await?
        };

        Ok(MoveResult::new(died_stones))
    }

    pub async fn undo_move(&self, user: AuthenticatedUser) -> DGSResult<()> {
        unimplemented!("undo move is currently unemplemented")
    }
}
