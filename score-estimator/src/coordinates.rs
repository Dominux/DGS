use serde::{Deserialize, Serialize};

/// Represents unique point's location
#[derive(Debug, Serialize, Deserialize)]
pub struct Coordinates<T> {
    pub x: T,
    pub y: T,
}
