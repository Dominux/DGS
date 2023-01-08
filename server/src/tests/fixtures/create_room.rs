use axum::http::StatusCode;
use axum_test_helper::TestClient;
use entity::rooms::Model as Room;

pub async fn create_room(
    user_id: uuid::Uuid,
    user_secure_id: uuid::Uuid,
    client: &TestClient,
) -> Room {
    let auth_headers = format!("{user_id}:{user_secure_id}");
    let res = client
        .post("/rooms")
        .header("AUTHORIZATION", auth_headers)
        .send()
        .await;
    assert_eq!(res.status(), StatusCode::CREATED);

    res.json().await
}
