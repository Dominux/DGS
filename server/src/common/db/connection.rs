use sea_orm::{Database, DbConn};

use crate::common::errors::DGSResult;

pub async fn get_db(db_uri: &str) -> DGSResult<DbConn> {
    Ok(Database::connect(db_uri).await?)
}
