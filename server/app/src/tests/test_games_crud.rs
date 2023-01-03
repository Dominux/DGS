use axum::http::StatusCode;
use entity::games::Model as Game;

use super::fixtures::{create_game::create_game, test_tools::TestTools};

#[tokio::test]
async fn test_create_and_get_and_list_games() {
    let test_tools = TestTools::new().await;

    // Creating 2 games
    let game_1 = create_game(&test_tools.client).await;
    let game_2 = create_game(&test_tools.client).await;

    // Getting one of them
    {
        let url = format!("/games/{}", &game_1.id);
        let res = test_tools.client.get(&url).send().await;
        assert_eq!(res.status(), StatusCode::OK);

        let res_game: Game = res.json().await;
        assert_eq!(res_game.id, game_1.id);
        assert_eq!(res_game.is_ended, game_1.is_ended);
    }

    // Listing them
    {
        let res = test_tools.client.get("/games").send().await;
        assert_eq!(res.status(), StatusCode::OK);

        let res_games: [Game; 2] = res.json().await;
        assert_eq!(res_games, [game_1, game_2]);
    }
}
