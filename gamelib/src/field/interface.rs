use std::{cell::RefCell, fmt::Debug, rc::Rc};

use crate::{aliases::PointID, point::PointWrapper};

/// Any field must implement this trait to be representive for the game score-estimator
pub trait Field: Debug + Clone {
    fn len(&self) -> usize;
    fn get_point(&self, point_id: &PointID) -> Rc<RefCell<PointWrapper>>;
    fn get_neighbor_points(&self, point_id: &PointID) -> [Option<Rc<RefCell<PointWrapper>>>; 4];
}

pub type PointOwner = Rc<RefCell<PointWrapper>>;
