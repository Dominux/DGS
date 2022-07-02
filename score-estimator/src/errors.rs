use std::io;

#[derive(thiserror::Error, Debug)]
pub enum GameLoadingError {
    #[error("file does not exist")]
    FileNotFound(#[from] io::Error),
}

pub type GameLoadingResult<T> = Result<T, GameLoadingError>;

/// All common errors
#[derive(thiserror::Error, Debug)]
pub enum GameError {
    #[error("{0}")]
    ValidationError(String),
}

pub type GameResult<T> = Result<T, GameError>;
