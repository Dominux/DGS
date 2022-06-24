use crate::coordinates::Coordinates;

/// Represents a single point in a game field
pub struct Point<T> {
    coords: Coordinates<T>,
    status: PointStatus,
}

pub enum PointStatus {
    Empty,
    Occupied(PlayerColor),
    Blocked,
}

/// Represents a player for the game.
/// For now we need only color
pub enum PlayerColor {
    Black,
    White,
}
