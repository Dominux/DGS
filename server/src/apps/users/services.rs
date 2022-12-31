use crate::common::{aliases::DBConnection, errors::DGSResult};
use entity::users;

use super::{
    repositories::UsersRepository,
    schemas::{CreateUserSchema, OutUserSchema},
};

pub struct UserService<'a> {
    repo: UsersRepository<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(db: &'a DBConnection) -> Self {
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
