use axum::http::StatusCode;
use entity::rooms::Model as Room;

use crate::tests::fixtures::{
    create_room::create_room, create_user::create_user, test_tools::TestTools,
};

#[tokio::test]
async fn test_rooms_crud() {
    let test_tools = TestTools::new().await;

    // Creating 2 users and 2 rooms to each one
    let room_1 = {
        let user = create_user("motherfucker", &test_tools.client).await;

        let room = create_room(user.id, user.secure_id, &test_tools.client).await;
        assert_eq!(room.player1_id, user.id);
        assert_eq!(room.player2_id, None);
        room
    };
    {
        let user = create_user("lmao", &test_tools.client).await;

        let room = create_room(user.id, user.secure_id, &test_tools.client).await;
        assert_eq!(room.player1_id, user.id);
        assert_eq!(room.player2_id, None);
    };

    // Getting one of them
    {
        let url = format!("/rooms/{}", room_1.id);
        let res = test_tools.client.get(&url).send().await;
        assert_eq!(res.status(), StatusCode::OK);

        let room: Room = res.json().await;
        assert_eq!(room.id, room_1.id)
    }
}

#[tokio::test]
async fn test_invite() {
    let test_tools = TestTools::new().await;

    // Creating 2 users and 1 room
    let user_1 = create_user("motherfucker", &test_tools.client).await;
    let user_2 = create_user("motherfucker", &test_tools.client).await;

    let room = create_room(user_1.id, user_1.secure_id, &test_tools.client).await;

    // Accepting invitation
    {
        let url = format!("/rooms/{}/enter", room.id);
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

    // Trying to do it again and we must get an error
    {
        let url = format!("/rooms/{}/enter", room.id);
        let auth_header = format!("{}:{}", user_2.id, user_2.secure_id);
        let res = test_tools
            .client
            .patch(&url)
            .header("AUTHORIZATION", auth_header)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::CONFLICT);
    }
}
