#![feature(drain_filter)]
#![feature(hash_drain_filter)]
#![feature(slice_flatten)]

use std::collections::HashSet;

pub use aliases::{PointID, SizeType};
use field::build_field;
pub use field::FieldType;
use group::Group;
use history::{HistoryManager, StoredGame, StoredGameMeta, StoredGameMove, StoredGameMoveType};
pub use point::PlayerColor;

mod aliases;
pub mod errors;
mod field;
mod file_converters;
mod game;
mod group;
mod history;
mod ko_guard;
mod point;
mod state;

pub struct Game {
    pub(crate) inner: game::Game,
    pub(crate) history_manager: Option<HistoryManager>,
}

impl Game {
    /// Create the game
    pub fn new(
        field_type: FieldType,
        size: &SizeType,
        use_history: bool,
    ) -> errors::GameResult<Self> {
        // Creating a field by it's field_type
        let field = build_field(size, field_type)?;

        // Creating a history manager
        let history_manager = if use_history {
            let meta = StoredGameMeta {
                field_type,
                size: *size,
            };
            let stored_game = StoredGame {
                meta,
                moves: Vec::new(),
            };
            let history_manager = HistoryManager::new(stored_game);
            Some(history_manager)
        } else {
            None
        };

        let game = Self {
            inner: game::Game::new(field),
            history_manager,
        };
        Ok(game)
    }

    /// Make a move
    ///
    /// Returns list of stoned became dead by this move
    pub fn make_move(&mut self, point_id: &PointID) -> errors::GameResult<HashSet<PointID>> {
        let died_stones = self.inner.make_move(point_id)?;

        // Filling history if we have it
        self.history_manager.as_mut().map(|history| {
            // TODO: add other types of moves (like pass and surrender)
            let record = StoredGameMove {
                move_type: StoredGameMoveType::Move,
                point_id: Some(*point_id),
                died: died_stones.clone(),
            };
            history.append_record(record)
        });

        Ok(died_stones)
    }

    /// Undo previous move
    pub fn undo_move(&mut self) -> errors::GameResult<()> {
        if self.history_manager.is_none() {
            return Err(errors::GameError::UndoIsImpossible);
        }
        let hm = self.history_manager.as_mut().unwrap();

        // Undoing move
        hm.pop_record()?;

        // Recreating game
        self.inner = hm.load()?;

        Ok(())
    }

    /// Start game
    pub fn start(&mut self) -> errors::GameResult<()> {
        self.inner.start()
    }

    /// End game
    pub fn end(&mut self) -> errors::GameResult<()> {
        self.inner.end()
    }

    #[inline]
    pub fn is_not_started(&self) -> bool {
        self.inner.is_not_started()
    }

    #[inline]
    pub fn is_started(&self) -> bool {
        self.inner.is_started()
    }

    #[inline]
    pub fn is_ended(&self) -> bool {
        self.inner.is_ended()
    }

    #[inline]
    pub fn get_black_stones(&self) -> Vec<PointID> {
        Self::get_points_ids_from_groups(&self.inner.black_groups)
    }

    #[inline]
    pub fn get_white_stones(&self) -> Vec<PointID> {
        Self::get_points_ids_from_groups(&self.inner.white_groups)
    }

    #[inline]
    fn get_points_ids_from_groups(groups: &Vec<Group>) -> Vec<PointID> {
        groups.iter().flat_map(|g| g.points_ids.clone()).collect()
    }

    #[inline]
    pub fn get_black_score(&self) -> Option<usize> {
        self.inner.get_black_score()
    }

    #[inline]
    pub fn get_white_score(&self) -> Option<usize> {
        self.inner.get_white_score()
    }

    #[inline]
    pub fn player_turn(&self) -> Option<PlayerColor> {
        self.inner.player_turn()
    }

    #[inline]
    pub fn field_type(&self) -> FieldType {
        self.inner.field.field_type
    }
}

#[cfg(test)]
mod tests;
