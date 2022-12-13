#![feature(drain_filter)]
#![feature(slice_flatten)]

pub use aliases::{PointID, SizeType};
use field::build_field;
pub use field::FieldType;
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
}

impl Game {
    /// Create the game
    pub fn new(field_type: FieldType, size: &SizeType) -> errors::GameResult<Self> {
        // Creating a field by it's field_type
        let field = build_field(size, field_type)?;

        let game = Self {
            inner: game::Game::new(field),
        };
        Ok(game)
    }

    /// Make a move
    ///
    /// Returns list of stoned became dead by this move
    pub fn make_move(&mut self, point_id: &PointID) -> errors::GameResult<Vec<PointID>> {
        self.inner.make_move(point_id)
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
