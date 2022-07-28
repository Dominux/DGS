use super::fixtures::game::create_and_start_game;

#[test]
fn test_remove_one_stone() {
    // Creating and starting game
    let mut game = create_and_start_game(&10);

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

#[test]
fn test_remove_one_stone_at_border() {
    // Creating and starting game
    let mut game = create_and_start_game(&5);

    /*
    Starting creating

    Considering the white is to be useless
    and the black is to surround the first white stone till it's dead
     */
    {
        let moves = [139, 122, 121, 134, 123, 144];
        for id in moves {
            let deadlist = game.make_move(&id).unwrap();
            assert_eq!(deadlist.len(), 0)
        }

        // Making killing move
        let deadlist = game.make_move(&102).unwrap();
        assert_eq!(deadlist.len(), 1)
    }

    // for id in 0..(5_usize.pow(2) * 6) {
    //     println!("{:?}", game.inner.field.get_point(&id).borrow());
    // }
    // assert!(false)
}
