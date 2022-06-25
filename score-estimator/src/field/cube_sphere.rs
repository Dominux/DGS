use crate::{coordinates::Coordinates, point::Point, size_type::SizeType};

use super::interface::Field;

#[derive(Debug, Clone)]
pub struct CubeSphereField {
    points: Vec<Point>,
    size: SizeType,
}

impl CubeSphereField {
    pub fn new(points: Vec<Point>, size: SizeType) -> Self {
        Self { points, size }
    }

    #[inline]
    fn max(&self) -> SizeType {
        self.size - 1
    }
}

impl Field for CubeSphereField {
    fn get_neighbor_points(
        &self,
        point_coords: &Coordinates,
    ) -> Vec<&Point> {
        // Getting neighbors coords
        let (top, right, bottom, left) =
            [(0, 1), (1, 0), (0, -1), (-1, 0)]
                .into_iter()
                .map(|(x_inc, y_inc)| {
                    let Coordinates { mut x, mut y } = point_coords.clone();
                    if x == 0 && x_inc == -1 {
                        x = 
                    }
                });
    }
}
