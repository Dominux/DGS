use crate::{Game, SizeType};

const SIZE: SizeType = 10;

#[test]
fn test_remove_one_stone() {
    // Creating and starting game
    let mut game = {
        let mut game = Game::new(&SIZE).unwrap();
        game.start().unwrap();
        game
    };

    /*
    Starting creating

    Considering the white is to be useless
    and the black is to surround the first white stone till it's dead
     */
    {
        let moves = [15, 25, 24, 100, 26, 101];
        for id in moves {
            let deadlist = game.make_move(&id).unwrap();
            assert_eq!(deadlist.len(), 0)
        }

        // Making killing move
        let deadlist = game.make_move(&35).unwrap();
        assert_eq!(deadlist.len(), 1)
    }
}
