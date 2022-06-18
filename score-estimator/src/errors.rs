use std::io;

#[derive(thiserror::Error, Debug)]
pub enum LoadingGameError {
    #[error("file does not exist")]
    FileNotFound(#[from] io::Error),
}

pub type GameLoadingResult<T> = Result<T, LoadingGameError>;
