use std::io;

#[derive(thiserror::Error, Debug)]
pub enum GameLoadingError {
    #[error("file does not exist")]
    FileNotFound(#[from] io::Error),
    #[error("cannot read sections")]
    CannotReadSections,
}

pub type GameLoadingResult<T> = Result<T, GameLoadingError>;
