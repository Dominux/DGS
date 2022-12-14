use crate::{errors::GameError, FieldType};

use super::fixtures::game::create_and_start_game;

#[test]
fn test_get_blocking_error() {
    // Creating and starting game
    let mut game = create_and_start_game(FieldType::GridSphere, &5, false);

    /*
    Starting creating

    Reminder:
         0  1  2  3  4
         5  6  7  8  9
        10 11 12 13 14
        15 16 17 18 19
        20 21 22 23 24
     */
    {
        // Creating a typical case
        let moves = [7, 8, 11, 14, 17, 18, 13];
        for id in moves {
            game.make_move(&id).unwrap();
        }

        // Making first killing move
        let result = game.make_move(&12);
        assert!(result.is_ok());

        // Trying to kill blocked stone
        // We must get blocking error here
        let result = game.make_move(&13);
        assert!(matches!(result, Err(GameError::PointBlocked(13))));

        // Trying to put stone at another points by both players
        // like a case when one player had made a Ko-threat and another didn't miss it
        for id in [68, 69] {
            assert!(game.make_move(&id).is_ok())
        }

        // Trying to put by the player that previously got the error a stone at the same point
        let result = game.make_move(&13);
        assert!(result.is_ok(), "{}", result.unwrap_err());
    }
}
