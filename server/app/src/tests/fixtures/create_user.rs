use axum::http::StatusCode;
use axum_test_helper::TestClient;
use entity::users::Model as User;
use serde_json::json;

pub async fn create_user(username: &str, client: &TestClient) -> User {
    let user_schema = json!({
        "username": username,
    });

    let res = client.post("/users").json(&user_schema).send().await;
    assert_eq!(res.status(), StatusCode::CREATED);

    // By deserializing response to a model that has a secure_id field
    // we ensure it has this field
    let user: User = res.json().await;
    assert_eq!(user.username, username);

    user
}
