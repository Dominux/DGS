use crate::{Game, SizeType};

pub fn create_and_start_game(size: &SizeType) -> Game {
    let mut game = Game::new(size).unwrap();
    game.start().unwrap();
    game
}
