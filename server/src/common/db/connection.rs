use sea_orm::Database;

use crate::common::{aliases::DBConnection, errors::DGSResult};

pub async fn get_db(db_uri: &str) -> DGSResult<DBConnection> {
    Ok(Database::connect(db_uri).await?)
}
