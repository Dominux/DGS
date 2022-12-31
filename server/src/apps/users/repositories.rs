use entity::users;
use sea_orm::{ActiveModelTrait, ActiveValue, ColumnTrait, EntityTrait, QueryFilter};
use uuid;

use super::schemas::OutUserSchema;
use crate::apps::users::schemas::CreateUserSchema;
use crate::common::errors::DGSError;
use crate::common::{aliases::DBConnection, errors::DGSResult};

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

    pub async fn list(&self) -> DGSResult<Vec<OutUserSchema>> {
        let db_users = users::Entity::find().all(self.db).await?;
        Ok(db_users.into_iter().map(|u| u.into()).collect())
    }

    pub async fn get(&self, user_id: uuid::Uuid) -> DGSResult<OutUserSchema> {
        Ok(users::Entity::find_by_id(user_id)
            .one(self.db)
            .await?
            .ok_or(DGSError::NotFound(format!("user with id {user_id}")))?
            .into())
    }

    pub async fn delete(&self, user_id: uuid::Uuid, secure_id: uuid::Uuid) -> DGSResult<()> {
        let res = users::Entity::delete_by_id(user_id)
            .filter(users::Column::SecureId.eq(secure_id))
            .exec(self.db)
            .await?;

        if res.rows_affected == 1 {
            Ok(())
        } else {
            Err(DGSError::NotFound(format!(
                "user with id {user_id} and secure_id {secure_id}"
            )))
        }
    }
}
