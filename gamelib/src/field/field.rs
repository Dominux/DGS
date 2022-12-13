use std::{cell::RefCell, rc::Rc};

use serde::{Deserialize, Serialize};

use crate::{aliases::PointID, point::PointWrapper};

pub type PointOwner = Rc<RefCell<PointWrapper>>;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum FieldType {
    Regular,
    CubicSphere,
    GridSphere,
}

#[derive(Debug)]
pub struct Field {
    points: Vec<PointOwner>,
    pub field_type: FieldType,
}

impl Field {
    pub fn new(points: Vec<PointOwner>, field_type: FieldType) -> Self {
        Self { points, field_type }
    }

    #[allow(dead_code)]
    #[inline]
    pub fn len(&self) -> usize {
        self.points.len()
    }

    pub fn get_point(&self, point_id: &PointID) -> Rc<RefCell<PointWrapper>> {
        self.points[*point_id].clone()
    }

    pub fn get_neighbor_points(
        &self,
        point_id: &PointID,
    ) -> [Option<Rc<RefCell<PointWrapper>>>; 4] {
        let point = self.get_point(point_id);
        let p = point.borrow();
        [p.top, p.right, p.bottom, p.left].map(|id| id.map(|id| self.get_point(&id)))
    }
}

// Custom implementation cause Rc<RefCell<_>> does not create completely new object in memory on .clone()
// (IMAO just a bruh moment)
impl Clone for Field {
    fn clone(&self) -> Self {
        let points = self
            .points
            .iter()
            .map(|point| Rc::new(RefCell::new(point.borrow().clone())))
            .collect();
        Self {
            points,
            field_type: self.field_type,
        }
    }
}
