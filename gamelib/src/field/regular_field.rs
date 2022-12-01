use std::{cell::RefCell, rc::Rc};

use crate::{
    aliases::PointID,
    point::{Point, PointWrapper},
    SizeType,
};

use super::{Field, PointOwner};

#[derive(Debug)]
pub struct RegularField {
    points: Vec<PointOwner>,
}

impl RegularField {
    pub(crate) fn new(points: Vec<PointOwner>) -> Self {
        Self { points }
    }
}

// Custom implementation cause Rc<RefCell<_>> does not create completely new object in memory on .clone()
impl Clone for RegularField {
    fn clone(&self) -> Self {
        let points = self
            .points
            .iter()
            .map(|point| Rc::new(RefCell::new(point.borrow().clone())))
            .collect();
        Self { points }
    }
}

/// Struct to build RegularField
pub struct RegularFieldBuilder;

impl Default for RegularFieldBuilder {
    fn default() -> Self {
        Self {}
    }
}

impl RegularFieldBuilder {
    pub fn with_size(&self, size: &SizeType) -> RegularField {
        self.construct(size)
    }

    #[allow(dead_code)]
    fn construct(&self, size: &SizeType) -> RegularField {
        let size = *size as usize;

        // Creating points
        let points: Vec<_> = {
            let points_count = size.pow(2);

            (0..points_count)
                .map(|i| {
                    let top = if i < size { None } else { Some(i - size) };
                    let bottom = if i >= (points_count - size) {
                        None
                    } else {
                        Some(i + size)
                    };
                    let left = if i % size == 0 { None } else { Some(i - 1) };
                    let right = if i % size == size - 1 {
                        None
                    } else {
                        Some(i + 1)
                    };

                    Rc::new(RefCell::new(PointWrapper::new(
                        Point::new(i),
                        top,
                        left,
                        right,
                        bottom,
                    )))
                })
                .collect()
        };

        RegularField { points }
    }
}

impl Field for RegularField {
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
