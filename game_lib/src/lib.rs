#![feature(drain_filter)]
#![feature(slice_flatten)]

pub use aliases::SizeType;

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
    inner: game::Game<field::CubicSphereField, rules::JapaneseRules>,
}

impl Game {
    pub fn new(size: &SizeType) -> errors::GameResult<Self> {
        let field = field::CubicSphereFieldBuilder::default().with_size(size)?;
        let rules = rules::JapaneseRules::new();
        let game = Self {
            inner: game::Game::new(field, rules),
        };
        Ok(game)
    }
}

#[cfg(test)]
mod tests;
