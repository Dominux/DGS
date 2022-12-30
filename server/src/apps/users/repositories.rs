use entity::users;
use sea_orm::{ActiveModelTrait, ActiveValue};
use uuid;

use crate::common::{aliases::DBConnection, errors::DGSResult};

use crate::apps::users::schemas::CreateUserSchema;

pub struct UsersRepository<'a> {
    db: &'a DBConnection,
}

impl<'a> UsersRepository<'a> {
    pub fn new(db: &'a DBConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, user: &CreateUserSchema) -> DGSResult<users::Model> {
        let user = users::ActiveModel {
            id: ActiveValue::Set(uuid::Uuid::new_v4()),
            username: ActiveValue::Set(user.username.clone()),
            secure_id: ActiveValue::Set(uuid::Uuid::new_v4()),
        };

        let user_from_db = user.insert(self.db).await?;

        Ok(user_from_db)
    }
}
