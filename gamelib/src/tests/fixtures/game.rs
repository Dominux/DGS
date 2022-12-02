use crate::{FieldType, Game, SizeType};

pub fn create_and_start_game(field_type: FieldType, size: &SizeType) -> Game {
    let mut game = Game::new(field_type, size).unwrap();
    game.start().unwrap();
    game
}
