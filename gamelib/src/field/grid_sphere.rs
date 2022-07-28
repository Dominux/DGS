use std::{cell::RefCell, rc::Rc};

use itertools::Itertools;

use crate::{
    aliases::PointID,
    point::{Point, PointWrapper},
    SizeType,
};

use super::Field;

pub type PointOwner = Rc<RefCell<PointWrapper>>;

#[derive(Debug, Clone)]
pub struct GridSphereField {
    points: Vec<PointOwner>,
}

impl GridSphereField {
    #[allow(dead_code)]
    pub(crate) fn new(points: Vec<PointOwner>) -> Self {
        Self { points }
    }
}

/// Struct to build GridSphereField
pub struct GridSphereFieldBuilder;

impl Default for GridSphereFieldBuilder {
    fn default() -> Self {
        Self {}
    }
}

impl GridSphereFieldBuilder {
    #[allow(dead_code)]
    pub fn with_size(&self, size: &SizeType) -> GridSphereField {
        self.construct(size)
    }

    #[allow(dead_code)]
    fn construct(&self, size: &SizeType) -> GridSphereField {
        let size = *size as usize;

        // Creating points
        let points: Vec<_> = {
            let points_count = size.pow(2) * 6;
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
            Since the field is like a cube we can represent it like:
             - top face
             - middle faces with all edges
             - bottom face
            */

            let quadratic_size = size.pow(2);

            // Top face
            for id in 0..quadratic_size {
                let mut point = points[id].borrow_mut();

                let side_k = id % quadratic_size;

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
                if id < quadratic_size - size {
                    // Not bottom corner
                    point.bottom = Some(id + size)
                }
            }

            let layer_size = size * 4;

            // Top edges
            {
                let last_top_edge_elem_1 = quadratic_size + size - 1;
                let last_top_edge_elem_2 = last_top_edge_elem_1 + size;
                let last_top_edge_elem_3 = last_top_edge_elem_2 + size;
                let last_top_edge_elem_4 = last_top_edge_elem_3 + size;

                let range_1 = quadratic_size..=last_top_edge_elem_1;
                let range_2 = last_top_edge_elem_1..=last_top_edge_elem_2;
                let range_3 = last_top_edge_elem_2..=last_top_edge_elem_3;

                let range_3_first_elem = last_top_edge_elem_2 + 1;
                let last_top_elem = quadratic_size - 1;

                for id in quadratic_size..=(last_top_elem + layer_size) {
                    {
                        let mut point = points[id].borrow_mut();

                        point.bottom = Some(id + layer_size);

                        if id == quadratic_size {
                            // First element
                            point.left = Some(last_top_edge_elem_4);
                            point.right = Some(id + 1);
                            point.top = Some(0);
                            points[0].borrow_mut().left = Some(id);
                            continue;
                        }
                        if id == last_top_edge_elem_4 {
                            // Last element
                            point.right = Some(quadratic_size);
                            point.left = Some(id - 1);
                            point.top = Some(0);
                            points[0].borrow_mut().top = Some(id);
                            continue;
                        }

                        point.left = Some(id - 1);
                        point.right = Some(id + 1);
                    }

                    if range_1.contains(&id) {
                        let top_id = (id - quadratic_size) * size;
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().left = Some(id);
                    } else if range_2.contains(&id) {
                        let top_id = id - (size * 2);
                        points[id].borrow_mut().top = Some(top_id);
                        points[top_id].borrow_mut().bottom = Some(id);
                    } else if range_3.contains(&id) {
                        let k = id - range_3_first_elem;
                        let top_id = last_top_elem - size * k;
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
                for layer in 1..(size - 1) {
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
                let layer_size = size * 4;
                let last_elem = points.len() - 1;
                for id in (points.len() - (quadratic_size + layer_size))..points.len() {
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

        GridSphereField { points }
    }
}

impl Field for GridSphereField {
    #[inline]
    fn len(&self) -> usize {
        self.points.len()
    }

    fn get_point(&self, point_id: &PointID) -> Rc<RefCell<PointWrapper>> {
        self.points[*point_id].clone()
    }

    fn get_neighbor_points(&self, point_id: &PointID) -> [Option<Rc<RefCell<PointWrapper>>>; 4] {
        let point = self.get_point(point_id);
        let p = point.borrow();
        [p.top, p.right, p.bottom, p.left].map(|id| id.map(|id| self.get_point(&id)))
    }
}
