use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};

use super::{
    schemas::{CreateUserSchema, DeleteUserSchema},
    services::UserService,
};
use crate::common::routing::app_state::AppState;

pub struct UsersRouter;

impl UsersRouter {
    pub fn get_router(state: Arc<AppState>) -> Router {
        Router::new()
            .route("/", get(Self::list_users).post(Self::create_user))
            .route("/:user_id", get(Self::get_user).delete(Self::delete_user))
            .with_state(state)
    }

    pub async fn create_user(
        State(state): State<Arc<AppState>>,
        Json(user): Json<CreateUserSchema>,
    ) -> impl IntoResponse {
        let user = UserService::new(&state.db).create(&user).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::CREATED, Json(user)))
    }

    pub async fn list_users(State(state): State<Arc<AppState>>) -> impl IntoResponse {
        let users = UserService::new(&state.db).list().await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(users)))
    }

    pub async fn get_user(
        State(state): State<Arc<AppState>>,
        Path(user_id): Path<uuid::Uuid>,
    ) -> impl IntoResponse {
        let user = UserService::new(&state.db).get(user_id).await?;
        Ok::<_, (StatusCode, String)>((StatusCode::OK, Json(user)))
    }

    pub async fn delete_user(
        State(state): State<Arc<AppState>>,
        Path(user_id): Path<uuid::Uuid>,
        Json(delete_schema): Json<DeleteUserSchema>,
    ) -> impl IntoResponse {
        UserService::new(&state.db)
            .delete(user_id, delete_schema.secure_id)
            .await?;
        Ok::<_, (StatusCode, String)>(StatusCode::NO_CONTENT)
    }
}
