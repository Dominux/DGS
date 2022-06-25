use serde::{Deserialize, Serialize};

use crate::size_type::SizeType;

/// Represents unique point's location
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Coordinates {
    pub x: SizeType,
    pub y: SizeType,
}

impl Coordinates {
    pub fn new(x: SizeType, y: SizeType) -> Self {
        Self { x, y }
    }
}
