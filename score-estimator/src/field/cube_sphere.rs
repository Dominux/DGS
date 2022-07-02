use crate::{
    aliases::{PointID, SizeType},
    errors::{GameError, GameResult},
    point::Point,
};

use super::interface::Field;

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
pub struct CubeSphereField {
    points: Vec<PointWrapper>,
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
        let field = self.construct(size);
        Ok(field)
    }

    fn construct(&self, size: &SizeType) -> CubeSphereField {
        let size = *size as usize;
        let inner_size = size - 2;

        // Creating points
        let mut points: Vec<_> = {
            let points_count = size.pow(3) - inner_size.pow(3);
            (0..points_count)
                .map(|i| PointWrapper::new(Point::new(i), None, None, None, None))
                .collect()
        };

        // Filling relations
        {
            /*
            Since the field is a cube we can represent it like:
             - top face
             - middle faces with all edges
             - bottom face
            */

            let quadratic_inner_size = (size - 2).pow(2);

            // Top face
            for id in 0..quadratic_inner_size {
                let point = &mut points[id];

                let side_k = id % quadratic_inner_size;

                if side_k != 0 {
                    // Not left corner
                    point.left = Some(id - 1);
                }
                if side_k != size - 1 {
                    // Not right corner
                    point.right = Some(id + 1);
                }

                if id >= size {
                    // Not top corner
                    point.top = Some(id - size)
                }
                if id < quadratic_inner_size - size {
                    // Not bottom corner
                    point.bottom = Some(id + size)
                }
            }

            let quadratic_size = size.pow(2);
            let layer_size = quadratic_size - quadratic_inner_size;

            {
                let last_top_edge_elem_1 = quadratic_inner_size + size - 1;
                let last_top_edge_elem_2 = last_top_edge_elem_1 + size - 1;
                let last_top_edge_elem_3 = last_top_edge_elem_2 + size - 1;
                let last_top_edge_elem_4 = last_top_edge_elem_3 + size - 1;

                let range_1 = quadratic_inner_size..=last_top_edge_elem_1;
                let range_2 = last_top_edge_elem_1..=last_top_edge_elem_2;
                let range_3 = last_top_edge_elem_2..=last_top_edge_elem_3;
                let range_4 = last_top_edge_elem_3..=last_top_edge_elem_4;

                let range_3_first_elem = last_top_edge_elem_2 + 1;
                let last_top_elem = quadratic_inner_size - 1;

                // Top edges
                for id in quadratic_inner_size..quadratic_size {
                    let point = &mut points[id];

                    point.bottom = Some(id + layer_size);

                    if id == quadratic_inner_size {
                        // First element
                        point.left = Some(id + quadratic_size - 1);
                        point.right = Some(id + 1);
                        continue;
                    }
                    if id == last_top_edge_elem_4 {
                        // Last element
                        point.right = Some(id - quadratic_size + 1);
                        point.top = Some(0);
                        point.left = Some(id - 1);
                        continue;
                    }

                    point.left = Some(id - 1);
                    point.right = Some(id + 1);

                    if range_1.contains(&id) {
                        point.top = Some((id - quadratic_size) * size);
                    }
                    if range_2.contains(&id) {
                        point.top = Some(id - (size * 2) + 2);
                    }
                    if range_3.contains(&id) {
                        let k = id - range_3_first_elem;
                        point.top = Some(last_top_elem - inner_size * k);
                    }
                    if range_4.contains(&id) {
                        point.top = Some(last_top_edge_elem_4 - id);
                    }
                }
            }
        }

        CubeSphereField {
            points,
            size: size as SizeType,
        }
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
