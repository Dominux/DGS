use crate::point::Point;

/// Any field must implement this trait to be representive for the game score-estimator
pub trait Field {
    // TODO
    fn get_neighbor_points(&self, point: &Point) -> Vec<&Point>;
}
