use sea_orm::error::DbErr;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DGSError {
    #[error("environment variable `{0}` is not set")]
    EnvConfigLoadingError(String),
    #[error("environment variable `{0}` cannot be parsed as type `{1}`")]
    EnvVarParsingError(String, String),
    #[error("cannot establish connection with db")]
    DBConnectionError,
    #[error("not found")]
    NotFound,
    #[error("unknown error")]
    Unknown,
}

impl From<DbErr> for DGSError {
    fn from(e: DbErr) -> Self {
        match e {
            DbErr::ConnectionAcquire => Self::DBConnectionError,
            _ => unimplemented!(),
        }
    }
}

pub type DGSResult<T> = Result<T, DGSError>;
