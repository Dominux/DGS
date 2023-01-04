use axum::http::StatusCode;
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
    #[error("not found: `{0}`")]
    NotFound(String),
    #[error("cannot decode token")]
    TokenDecodingError,
    #[error("game is already full of players")]
    CannotAddPlayer,
    #[error("unknown error")]
    Unknown,
}

impl From<DbErr> for DGSError {
    fn from(e: DbErr) -> Self {
        match e {
            DbErr::ConnectionAcquire => Self::DBConnectionError,
            DbErr::RecordNotFound(s) => Self::NotFound(s),
            _ => Self::Unknown,
        }
    }
}

impl From<DGSError> for (StatusCode, String) {
    fn from(e: DGSError) -> Self {
        match &e {
            DGSError::NotFound(_) => (StatusCode::NOT_FOUND, e.to_string()),
            DGSError::TokenDecodingError => (StatusCode::UNAUTHORIZED, e.to_string()),
            DGSError::CannotAddPlayer => (StatusCode::CONFLICT, e.to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Something went wrong".to_owned(),
            ),
        }
    }
}

pub type DGSResult<T> = Result<T, DGSError>;
