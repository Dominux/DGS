use crate::aliases::PointID;

/// Represents a single point in a game field
#[derive(Clone, Debug)]
pub struct Point {
    pub id: PointID,
    status: PointStatus,
}

impl Point {
    pub fn new(id: PointID) -> Self {
        Self {
            id,
            status: PointStatus::default(),
        }
    }
}

#[derive(Clone, Debug)]
pub enum PointStatus {
    Empty,
    Occupied(PlayerColor),
    Blocked,
}

impl Default for PointStatus {
    fn default() -> Self {
        Self::Empty
    }
}

/// Represents a player for the game.
/// For now we need only color
#[derive(Clone, Debug)]
pub enum PlayerColor {
    Black,
    White,
}
