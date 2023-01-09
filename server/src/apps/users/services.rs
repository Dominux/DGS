use entity::users;
use sea_orm::DbConn;

use super::{
    repositories::UsersRepository,
    schemas::{CreateUserSchema, OutUserSchema},
};
use crate::common::errors::DGSResult;

pub struct UserService<'a> {
    repo: UsersRepository<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(db: &'a DbConn) -> Self {
        let repo = UsersRepository::new(db);
        Self { repo }
    }

    pub async fn create(&self, user: &CreateUserSchema) -> DGSResult<users::Model> {
        self.repo.create(user).await
    }

    pub async fn list(&self) -> DGSResult<Vec<OutUserSchema>> {
        self.repo.list().await
    }

    pub async fn get(&self, user_id: uuid::Uuid) -> DGSResult<OutUserSchema> {
        self.repo.get(user_id).await
    }

    pub async fn delete(&self, user_id: uuid::Uuid, secure_id: uuid::Uuid) -> DGSResult<()> {
        self.repo.delete(user_id, secure_id).await
    }
}