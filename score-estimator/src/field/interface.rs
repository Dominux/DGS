use crate::point::{Point, PointID};

/// Any field must implement this trait to be representive for the game score-estimator
pub trait Field {
    fn get_neighbor_points(&self, point_id: &PointID) -> [Option<&Point>; 4];
    fn get_neighbor_points_mut(&mut self, point_id: &PointID) -> [Option<&mut Point>; 4];
}
