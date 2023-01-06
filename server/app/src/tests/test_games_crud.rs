use axum::http::StatusCode;
use entity::rooms::Model as Room;
use serde_json::json;

use crate::tests::fixtures::{
    create_room::create_room, create_user::create_user, test_tools::TestTools,
};

#[tokio::test]
async fn test_rooms_crud() {
    let test_tools = TestTools::new().await;

    // Creating 2 players and room
    let user_1 = create_user("motherfucker", &test_tools.client).await;
    let user_2 = create_user("dumba", &test_tools.client).await;
    let room = create_room(user_1.id, user_1.secure_id, &test_tools.client).await;

    let starting_game_json = json!({"room_id": room.id});

    // Trying to start game without 2 players
    {
        let auth_header = format!("{}:{}", user_1.id, user_1.secure_id);
        let res = test_tools
            .client
            .post("/games")
            .json(&starting_game_json)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::CONFLICT);
    }

    // Adding a second player
    {
        let url = format!("/rooms/{}/invite", room.id);
        let auth_header = format!("{}:{}", user_2.id, user_2.secure_id);
        let res = test_tools
            .client
            .patch(&url)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::ACCEPTED);

        let res_room: Room = res.json().await;
        assert_eq!(res_room.id, room.id);
        assert_eq!(res_room.player1_id, user_1.id);
        assert_eq!(res_room.player2_id, Some(user_2.id));
    }

    // Trying to start a game by a player 2
    {
        let auth_header = format!("{}:{}", user_2.id, user_2.secure_id);
        let res = test_tools
            .client
            .post("/games")
            .json(&starting_game_json)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::FORBIDDEN);
    }

    // Trying to start a game by a player 1
    {
        let auth_header = format!("{}:{}", user_1.id, user_1.secure_id);
        let res = test_tools
            .client
            .post("/games")
            .json(&starting_game_json)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::CREATED);
    }

    // Trying to start a game again
    {
        let auth_header = format!("{}:{}", user_1.id, user_1.secure_id);
        let res = test_tools
            .client
            .post("/games")
            .json(&starting_game_json)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::CONFLICT);
    }
}
