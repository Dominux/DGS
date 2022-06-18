use crate::file_converter::FileConverter;

#[test]
fn test_read_game_from_file() {
    let easy_file = "src/tests/games/easy.game";
    let file_converter = FileConverter::new();
    let game_loading_result = file_converter.load(easy_file);
    assert!(
        game_loading_result.is_ok(),
        "{}",
        game_loading_result.unwrap_err()
    )
}
