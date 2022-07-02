use std::{
    cell::RefCell,
    rc::{Rc, Weak},
};

use crate::{
    aliases::{PointID, SizeType},
    errors::{GameError, GameResult},
    point::Point,
};

use super::interface::Field;

#[derive(Debug, Clone)]
pub struct PointWrapper {
    pub inner: Point,
    pub top: Relation,
    pub left: Relation,
    pub right: Relation,
    pub bottom: Relation,
}

pub type Relation = Weak<RefCell<PointWrapper>>;

impl PointWrapper {
    pub fn new(inner: Point) -> Self {
        Self {
            inner,
            top: Weak::new(),
            left: Weak::new(),
            right: Weak::new(),
            bottom: Weak::new(),
        }
    }

    pub fn id(&self) -> &PointID {
        &self.inner.id
    }
}

#[derive(Debug, Clone)]
pub struct CubeSphereField {
    points: Vec<Rc<RefCell<PointWrapper>>>,
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
        // Creating points
        let mut points: Vec<_> = {
            let points_count = (*size as usize).pow(3);
            (0..points_count)
                .map(|i| Rc::new(RefCell::new(PointWrapper::new(Point::new(i)))))
                .collect()
        };

        /*
        For example I'm gonna create a field with size of 5
        */

        CubeSphereField {
            points: points,
            size: *size,
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
