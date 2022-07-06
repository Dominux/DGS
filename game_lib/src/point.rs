use crate::aliases::PointID;

/// Represents a single point in a game field
#[derive(Clone, Debug, PartialEq)]
pub struct Point {
    pub id: PointID,
    pub(crate) status: PointStatus,
}

impl Point {
    pub fn new(id: PointID) -> Self {
        Self {
            id,
            status: PointStatus::default(),
        }
    }

    #[inline]
    pub fn is_empty(&self) -> bool {
        matches!(self.status, PointStatus::Empty)
    }

    #[inline]
    pub fn is_blocked(&self) -> bool {
        matches!(self.status, PointStatus::Blocked)
    }

    #[inline]
    pub fn is_occupied(&self) -> bool {
        matches!(self.status, PointStatus::Occupied(_))
    }

    #[inline]
    pub fn has_color(&self, color: PlayerColor) -> bool {
        match &self.status {
            PointStatus::Occupied(c) if *c == color => true,
            _ => false,
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
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
#[derive(Clone, Debug, PartialEq, Copy)]
pub enum PlayerColor {
    Black,
    White,
}

impl PlayerColor {
    pub fn different_color(&self) -> Self {
        match self {
            Self::Black => Self::White,
            Self::White => Self::Black,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct PointWrapper {
    pub inner: Point,
    pub top: Option<PointID>,
    pub left: Option<PointID>,
    pub right: Option<PointID>,
    pub bottom: Option<PointID>,
}

impl PointWrapper {
    pub fn new(
        inner: Point,
        top: Option<PointID>,
        left: Option<PointID>,
        right: Option<PointID>,
        bottom: Option<PointID>,
    ) -> Self {
        Self {
            inner,
            top,
            left,
            right,
            bottom,
        }
    }

    #[inline]
    pub fn id(&self) -> &PointID {
        &self.inner.id
    }
}
