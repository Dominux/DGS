use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateUserSchema {
    pub username: String,
}
