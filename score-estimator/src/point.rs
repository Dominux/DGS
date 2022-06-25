use crate::coordinates::Coordinates;

/// Represents a single point in a game field
#[derive(Clone, Debug)]
pub struct Point {
    coords: Coordinates,
    status: PointStatus,
}

#[derive(Clone, Debug)]
pub enum PointStatus {
    Empty,
    Occupied(PlayerColor),
    Blocked,
}

/// Represents a player for the game.
/// For now we need only color
#[derive(Clone, Debug)]
pub enum PlayerColor {
    Black,
    White,
}
