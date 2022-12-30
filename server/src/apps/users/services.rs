use crate::common::{aliases::DBConnection, errors::DGSResult};
use entity::users;

use super::{repositories::UsersRepository, schemas::CreateUserSchema};

pub struct UserService<'a> {
    repo: UsersRepository<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(db: &'a DBConnection) -> Self {
        let repo = UsersRepository::new(db);
        Self { repo }
    }

    pub async fn create(&mut self, user: &CreateUserSchema) -> DGSResult<users::Model> {
        self.repo.create(user).await
    }
}
