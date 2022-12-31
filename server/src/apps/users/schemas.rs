use entity::users::Model as User;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateUserSchema {
    pub username: String,
}

#[derive(Debug, Deserialize)]
pub struct DeleteUserSchema {
    pub secure_id: uuid::Uuid,
}

#[derive(Debug, Serialize)]
pub struct OutUserSchema {
    pub id: uuid::Uuid,
    pub username: String,
}

impl From<User> for OutUserSchema {
    fn from(value: User) -> Self {
        Self {
            id: value.id,
            username: value.username,
        }
    }
}
