use axum::http::StatusCode;
use sea_orm::error::DbErr;
use spherical_go_game_lib::errors::GameError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DGSError {
    #[error("environment variable `{0}` is not set")]
    EnvConfigLoadingError(String),
    #[error("environment variable `{0}` cannot be parsed")]
    EnvVarParsingError(String),
    #[error("cannot establish connection with db")]
    DBConnectionError,
    #[error("not found: `{0}`")]
    NotFound(String),
    #[error("cannot decode token")]
    TokenDecodingError,
    #[error("game is already full of players")]
    CannotAddPlayer,
    #[error("only first player can start game")]
    UserIsNotPlayer1,
    #[error("you need to add a second player to start game")]
    Player2IsNone,
    #[error("game already started")]
    GameAlreadyStarted,
    #[error("user is not one of players")]
    UserIsNotRoomPlayer,
    #[error("it is not the player's turn now")]
    NotPlayerTurn,
    #[error("game is already ended")]
    GameEnded,

    #[error("{0}")]
    GameInternalError(String),

    #[error("unknown error")]
    Unknown,
}

impl From<DbErr> for DGSError {
    fn from(e: DbErr) -> Self {
        match e {
            DbErr::ConnectionAcquire => Self::DBConnectionError,
            DbErr::RecordNotFound(s) => Self::NotFound(s),
            _ => {
                println!("[DB Error] {e}");
                Self::Unknown
            }
        }
    }
}

impl From<DGSError> for (StatusCode, String) {
    fn from(e: DGSError) -> Self {
        match &e {
            DGSError::NotFound(_) => (StatusCode::NOT_FOUND, e.to_string()),
            DGSError::TokenDecodingError => (StatusCode::UNAUTHORIZED, e.to_string()),
            DGSError::CannotAddPlayer => (StatusCode::CONFLICT, e.to_string()),
            DGSError::UserIsNotPlayer1 => (StatusCode::FORBIDDEN, e.to_string()),
            DGSError::GameAlreadyStarted => (StatusCode::CONFLICT, e.to_string()),
            DGSError::Player2IsNone => (StatusCode::CONFLICT, e.to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Something went wrong".to_owned(),
            ),
        }
    }
}

impl From<GameError> for DGSError {
    fn from(e: GameError) -> Self {
        Self::GameInternalError(e.to_string())
    }
}

pub type DGSResult<T> = Result<T, DGSError>;
