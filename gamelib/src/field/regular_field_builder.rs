use std::{cell::RefCell, rc::Rc};

use crate::{
    point::{Point, PointWrapper},
    SizeType,
};

use super::{field::FieldType, Field};

/// Struct to build RegularField
pub struct RegularFieldBuilder;

impl Default for RegularFieldBuilder {
    fn default() -> Self {
        Self {}
    }
}

impl RegularFieldBuilder {
    #[allow(dead_code)]
    pub fn with_size(&self, size: &SizeType) -> Field {
        self.construct(size)
    }

    #[allow(dead_code)]
    fn construct(&self, size: &SizeType) -> Field {
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

        Field::new(points, FieldType::Regular)
    }
}
