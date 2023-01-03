use axum::http::StatusCode;
use serde_json::json;

use super::fixtures::{create_user::create_user, test_tools::TestTools};
use crate::apps::users::schemas::OutUserSchema;

#[tokio::test]
async fn test_create_and_get_user() {
    let test_tools = TestTools::new().await;

    // Creating a user
    let user = create_user("test_user", &test_tools.client).await;

    // Getting him
    {
        let url = format!("/users/{}", &user.id);
        let res = test_tools.client.get(&url).send().await;
        assert_eq!(res.status(), StatusCode::OK);

        // By deserializing response to a schema that doesn't have a secure_id field
        // we ensure it doesn't have it
        let out_user: OutUserSchema = res.json().await;
        assert_eq!(out_user.id, user.id);
        assert_eq!(out_user.username, user.username);
    }
}

#[tokio::test]
async fn test_get_and_list_users() {
    let test_tools = TestTools::new().await;

    // Creating users
    let user_1 = create_user("test_user_1", &test_tools.client).await;
    let user_2 = create_user("test_user_2", &test_tools.client).await;

    // Getting 1 user
    {
        let url = format!("/users/{}", &user_1.id);
        let res = test_tools.client.get(&url).send().await;
        assert_eq!(res.status(), StatusCode::OK);

        // By deserializing response to a schema that doesn't have a secure_id field
        // we ensure it doesn't have it
        let out_user: OutUserSchema = res.json().await;
        assert_eq!(out_user.id, user_1.id);
        assert_eq!(out_user.username, user_1.username);
    }

    // Getting both
    {
        let res = test_tools.client.get("/users").send().await;
        assert_eq!(res.status(), StatusCode::OK);

        // By deserializing response to a schema that doesn't have a secure_id field
        // we ensure it doesn't have it
        let out_users: [OutUserSchema; 2] = res.json().await;
        let real_users = [user_1, user_2].map(|u| u.into());
        assert_eq!(out_users, real_users);
    }

    // Trying to get a user that doesn't exist
    {
        let doesnt_exist_user_id = uuid::Uuid::new_v4();
        let url = format!("/users/{}", &doesnt_exist_user_id);
        let res = test_tools.client.get(&url).send().await;
        assert_eq!(res.status(), StatusCode::NOT_FOUND);
    }
}

#[tokio::test]
async fn test_delete_user() {
    let test_tools = TestTools::new().await;

    // Creating users
    let user_1 = create_user("test_user_1", &test_tools.client).await;
    let user_2 = create_user("test_user_2", &test_tools.client).await;

    // Deleting 1 user
    {
        // Deleting the user
        let delete_schema = json!({"secure_id": user_1.secure_id});
        let url = format!("/users/{}", &user_1.id);
        let res = test_tools
            .client
            .delete(&url)
            .json(&delete_schema)
            .send()
            .await;
        assert_eq!(res.status(), StatusCode::NO_CONTENT);

        // Ensuring we don't have the user anymore
        let res = test_tools.client.get("/users").send().await;
        assert_eq!(res.status(), StatusCode::OK);

        let out_users: [OutUserSchema; 1] = res.json().await;
        let real_users = [user_2].map(|u| u.into());
        assert_eq!(out_users, real_users);
    }
}
