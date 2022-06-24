use crate::{coordinates::Coordinates, point::Point};

/// Any field must implement this trait to be representive for the game score-estimator
pub trait Field {
    type CoordinatesT;

    fn get_neighbor_points(
        &self,
        point_coords: &Coordinates<Self::CoordinatesT>,
    ) -> Vec<&Point<Self::CoordinatesT>>;
}
