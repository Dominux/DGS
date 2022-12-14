use std::io;

use crate::{aliases::PointID, state::GameState};

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
    #[error("{action} is not possible at {current:?} game state")]
    GameStateError { current: GameState, action: String },
    #[error("Point with id \"{0}\" is blocked")]
    PointBlocked(PointID),
    #[error("Point with id \"{0}\" is not empty")]
    PointOccupied(PointID),
    #[error("Suicide move is not permitted")]
    SuicideMoveIsNotPermitted,
    #[error("Game history is clear, you have nothing to undo")]
    UndoOnClearHistory,
}

pub type GameResult<T> = Result<T, GameError>;
