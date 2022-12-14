use std::collections::HashSet;

use crate::PointID;

#[derive(Debug, Clone, PartialEq)]
pub struct KoGuard {
    black_points: HashSet<PointID>,
    white_points: HashSet<PointID>,
}

impl KoGuard {
    pub fn new(black_points: HashSet<PointID>, white_points: HashSet<PointID>) -> Self {
        Self {
            black_points,
            white_points,
        }
    }

    pub fn update(
        &mut self,
        new_black_points: HashSet<PointID>,
        new_white_points: HashSet<PointID>,
    ) {
        self.black_points = new_black_points;
        self.white_points = new_white_points;
    }

    /// Checks if the ko rule was violated
    pub fn check(
        &self,
        next_black_points: HashSet<PointID>,
        next_white_points: HashSet<PointID>,
    ) -> bool {
        self.black_points == next_black_points && self.white_points == next_white_points
    }
}

impl Default for KoGuard {
    fn default() -> Self {
        Self {
            black_points: HashSet::default(),
            white_points: HashSet::default(),
        }
    }
}
