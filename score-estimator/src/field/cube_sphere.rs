use crate::{
    errors::{GameError, GameResult},
    point::{Point, PointID},
    size_type::SizeType,
};

use super::interface::Field;

#[derive(Debug, Clone)]
pub struct CubeSphereField {
    points: Vec<Point>,
    size: SizeType,
}

/// Struct to build CubeSphereField
pub struct CubeSphereFieldBuilder;

impl Default for CubeSphereFieldBuilder {
    fn default() -> Self {
        Self {}
    }
}

impl CubeSphereFieldBuilder {
    pub fn with_size(&self, size: &SizeType) -> GameResult<CubeSphereField> {
        // Validating
        self.validate_size(size)?;

        // Constructing field
        let size = *size as usize;
        let field_len = size.pow(3);
        let points = (1..=field_len).map(|id| Point::new(id)).collect();
        let field = CubeSphereField {
            points,
            size: size as SizeType,
        };

        Ok(field)
    }

    fn validate_size(&self, size: &SizeType) -> GameResult<()> {
        if *size >= 2 {
            Ok(())
        } else {
            Err(GameError::ValidationError(
                "size must be 2 or higher".to_string(),
            ))
        }
    }
}

impl CubeSphereField {
    #[inline]
    pub(self) fn side_from_size(size: &SizeType) -> SizeType {
        size - 1
    }

    #[inline]
    fn side(&self) -> SizeType {
        Self::side_from_size(&self.size)
    }
}

impl Field for CubeSphereField {
    fn get_neighbor_points(&self, point_id: &PointID) -> [Option<&Point>; 4] {
        // let top = {
        //     if point_id
        // };

        todo!()
    }

    fn get_neighbor_points_mut(&mut self, point_id: &PointID) -> [Option<&mut Point>; 4] {
        todo!()
    }
}
