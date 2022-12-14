use super::fixtures::game::create_and_start_game;
use crate::FieldType;

#[test]
fn test_undo() {
    // Creating and starting game
    let mut game = create_and_start_game(FieldType::Regular, &5, true);

    /*
    Reminder:
         0  1  2  3  4
         5  6  7  8  9
        10 11 12 13 14
        15 16 17 18 19
        20 21 22 23 24
     */
    {
        // Creating a typical case
        let moves = [7, 8, 11, 14, 12, 18, 13, 3];
        for id in moves {
            game.make_move(&id).unwrap();
        }

        // Freezing a game
        let freezed_game = game.inner.clone();

        // Making one more move
        game.make_move(&15).unwrap();

        // Making undo
        assert!(game.undo_move().is_ok());

        // Comparing games
        assert_eq!(game.inner, freezed_game)
    }
}

#[test]
fn test_undo_with_clear_history() {
    // Creating and starting game
    let mut game = create_and_start_game(FieldType::GridSphere, &5, true);

    // Trying to undo move
    assert!(game.undo_move().is_err());
}
