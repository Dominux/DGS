use std::{cell::RefCell, rc::Rc};

use itertools::Itertools;

use crate::{
    aliases::SizeType,
    errors::{GameError, GameResult},
    point::{Point, PointWrapper},
};

use super::{field::FieldType, Field};

/// Struct to build CubicSphereField
pub struct CubicSphereFieldBuilder;

impl Default for CubicSphereFieldBuilder {
    fn default() -> Self {
        Self {}
    }
}

const MIN_SIZE: SizeType = 4;

impl CubicSphereFieldBuilder {
    #[allow(dead_code)]
    pub fn with_size(&self, size: &SizeType) -> GameResult<Field> {
        // Validating
        self.validate_size(size)?;

        // Constructing field
        let field = self.construct(size);
        Ok(field)
    }

    #[allow(dead_code)]
    fn construct(&self, size: &SizeType) -> Field {
        let size = *size as usize;
        let inner_size = size - 2;

        // Creating points
        let points: Vec<_> = {
            let points_count = size.pow(3) - inner_size.pow(3);
            (0..points_count)
                .map(|i| {
                    Rc::new(RefCell::new(PointWrapper::new(
                        Point::new(i),
                        None,
                        None,
                        None,
                        None,
                    )))
                })
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
                let mut point = points[id].borrow_mut();

                let side_k = id % quadratic_inner_size;

                if side_k != 0 {
                    // Not left corner
                    point.left = Some(id - 1);
                }
                if side_k != inner_size - 1 {
                    // Not right corner
                    point.right = Some(id + 1);
                }

                if id >= inner_size {
                    // Not top corner
                    point.top = Some(id - inner_size)
                }
                if id < quadratic_inner_size - inner_size {
                    // Not bottom corner
                    point.bottom = Some(id + inner_size)
                }
            }

            let quadratic_size = size.pow(2);
            let layer_size = quadratic_size - quadratic_inner_size;

            // Top edges
            {
                let last_top_edge_elem_1 = quadratic_inner_size + size - 1;
                let last_top_edge_elem_2 = last_top_edge_elem_1 + size - 1;
                let last_top_edge_elem_3 = last_top_edge_elem_2 + size - 1;
                let last_top_edge_elem_4 = last_top_edge_elem_3 + size - 2;
                let last_top_edge_elems = [
                    last_top_edge_elem_1,
                    last_top_edge_elem_2,
                    last_top_edge_elem_3,
                    last_top_edge_elem_4,
                ];

                let range_1 = quadratic_inner_size..=last_top_edge_elem_1;
                let range_2 = last_top_edge_elem_1..=last_top_edge_elem_2;
                let range_3 = last_top_edge_elem_2..=last_top_edge_elem_3;

                let range_3_first_elem = last_top_edge_elem_2 + 1;
                let last_top_elem = quadratic_inner_size - 1;

                for id in quadratic_inner_size..quadratic_size {
                    {
                        let mut point = points[id].borrow_mut();

                        point.bottom = Some(id + layer_size);

                        if id == quadratic_inner_size {
                            // First element
                            point.left = Some(last_top_edge_elem_4);
                            point.right = Some(id + 1);
                            continue;
                        }
                        if id == last_top_edge_elem_4 {
                            // Last element
                            point.right = Some(quadratic_inner_size);
                            point.left = Some(id - 1);
                            point.top = Some(0);
                            points[0].borrow_mut().bottom = Some(id);
                            continue;
                        }

                        point.left = Some(id - 1);
                        point.right = Some(id + 1);

                        if last_top_edge_elems.contains(&id) {
                            // It does not have a top neighbor
                            continue;
                        }
                    }

                    if range_1.contains(&id) {
                        let top_id = (id - quadratic_inner_size - 1) * inner_size;
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().left = Some(id);
                    } else if range_2.contains(&id) {
                        let top_id = id - (size * 2) + 2;
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().bottom = Some(id);
                    } else if range_3.contains(&id) {
                        let k = id - range_3_first_elem;
                        let top_id = last_top_elem - inner_size * k;
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().right = Some(id);
                    } else {
                        let top_id = last_top_edge_elem_4 - id;
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().top = Some(id);
                    }
                }
            }

            // Middle faces and edges
            {
                for layer in 0..(size - 1) {
                    let min = quadratic_size + layer_size * layer;
                    let max = min + layer_size - 1;

                    for id in min..=max {
                        let mut point = points[id].borrow_mut();

                        point.top = Some(id - layer_size);
                        point.bottom = Some(id + layer_size);

                        if id == min {
                            // First element
                            point.left = Some(max - 1);
                            point.right = Some(id + 1);
                        } else if id == max {
                            // Last element
                            point.left = Some(id - 1);
                            point.right = Some(min);
                        } else {
                            // Default
                            point.left = Some(id - 1);
                            point.right = Some(id + 1)
                        }
                    }
                }
            }

            // Bottom edges and faces
            {
                let last_elem = points.len() - 1;
                for id in (points.len() - quadratic_size)..points.len() {
                    // Mirroring the top ones
                    let mirror_id = last_elem - id;

                    let (top_id, right_id, bottom_id, left_id) = {
                        let mirror_point = points[mirror_id].borrow();

                        [
                            mirror_point.bottom,
                            mirror_point.right,
                            mirror_point.top,
                            mirror_point.left,
                        ]
                        .into_iter()
                        .map(|id| id.map(|i| last_elem - i))
                        .collect_tuple()
                        .unwrap()
                    };

                    let mut point = points[id].borrow_mut();
                    point.top = top_id;
                    point.right = right_id;
                    point.bottom = bottom_id;
                    point.left = left_id;
                }
            }
        }

        Field::new(
            points,
            FieldType::CubicSphere, // size: size as SizeType,
        )
    }

    fn validate_size(&self, size: &SizeType) -> GameResult<()> {
        // TODO: improve algorithm to be able to create fields with size 2 and 3
        if *size >= MIN_SIZE {
            Ok(())
        } else {
            Err(GameError::ValidationError(format!(
                "size must be {MIN_SIZE} or higher"
            )))
        }
    }
}
