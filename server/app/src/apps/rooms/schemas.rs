use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateRoomSchema {
    pub user_id: uuid::Uuid,
}
