use crate::{FieldType, Game, SizeType};

pub fn create_and_start_game(field_type: FieldType, size: &SizeType, use_history: bool) -> Game {
    let mut game = Game::new(field_type, size, use_history).unwrap();
    game.start().unwrap();
    game
}
