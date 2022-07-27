#![feature(drain_filter)]
#![feature(slice_flatten)]

pub use aliases::{PointID, SizeType};

mod aliases;
pub mod errors;
mod field;
mod game;
mod group;
mod point;
mod rules;
mod state;

#[cfg(feature = "json")]
mod file_converters;

pub struct Game {
    inner: game::Game<field::GridSphereField, rules::JapaneseRules>,
}

impl Game {
    /// Create the game
    pub fn new(size: &SizeType) -> errors::GameResult<Self> {
        let field = field::GridSphereFieldBuilder::default().with_size(size);
        let rules = rules::JapaneseRules::new();
        let game = Self {
            inner: game::Game::new(field, rules),
        };
        Ok(game)
    }

    /// Make a move
    pub fn make_move(&mut self, point_id: &PointID) -> errors::GameResult<()> {
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

    pub fn is_not_started(&self) -> bool {
        self.inner.is_not_started()
    }

    pub fn is_started(&self) -> bool {
        self.inner.is_started()
    }

    pub fn is_ended(&self) -> bool {
        self.inner.is_ended()
    }
}

#[cfg(test)]
mod tests;
