/// Represents a single point in a game field
pub struct Point {
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
