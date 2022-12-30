use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};

use super::{schemas::CreateUserSchema, services::UserService};
use crate::common::routing::app_state::AppState;

pub struct UsersRouter;

impl UsersRouter {
    pub fn get_router(state: AppState) -> Router {
        Router::new()
            .route("/", post(Self::create_user))
            .with_state(state)
    }

    pub async fn create_user(
        state: State<AppState>,
        Json(user): Json<CreateUserSchema>,
    ) -> impl IntoResponse {
        let user = UserService::new(&state.db).create(&user).await.unwrap();
        (StatusCode::CREATED, Json(user))
    }
}
