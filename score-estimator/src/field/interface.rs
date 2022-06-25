use crate::{coordinates::Coordinates, point::Point};

/// Any field must implement this trait to be representive for the game score-estimator
pub trait Field {
    fn get_neighbor_points(&self, point_coords: &Coordinates) -> Vec<&Point>;
}
