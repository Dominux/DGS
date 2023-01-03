use axum::http::StatusCode;
use axum_test_helper::TestClient;
use entity::games::Model as Game;

pub async fn create_game(client: &TestClient) -> Game {
    let res = client.post("/games").send().await;
    assert_eq!(res.status(), StatusCode::CREATED);

    res.json().await
}
