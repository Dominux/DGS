use std::{collections::HashSet, fmt::Debug, ops::BitOrAssign};

use crate::{
    aliases::PointID,
    field::Field,
    point::{PlayerColor, PointStatus},
};

#[derive(Clone)]
pub struct Group {
    pub(crate) points_ids: HashSet<PointID>,
    pub(crate) liberties: HashSet<PointID>,
}

impl Group {
    /// Consider making any new point a group
    pub fn new(point_id: &PointID, field: &Field, color: &PlayerColor) -> Self {
        let mut points_ids = HashSet::new();
        points_ids.insert(*point_id);
        Self {
            points_ids,
            liberties: field
                .get_neighbor_points(point_id)
                .into_iter()
                .filter_map(|point| {
                    let enemy = color.different_color();
                    match point {
                        Some(point) if point.borrow().inner.has_color(enemy) => None,
                        Some(point) => Some(*point.borrow().id()),
                        _ => None,
                    }
                })
                .collect(),
        }
    }

    /// Merge another group into current
    pub fn merge(&mut self, mut other: Group) {
        // Removing intersections between them
        self.liberties = &self.liberties - &other.points_ids;
        other.liberties = &other.liberties - &self.points_ids;

        // Merging them
        self.points_ids = &self.points_ids | &other.points_ids;
        self.liberties = &self.liberties | &other.liberties;
    }

    pub fn refresh_liberties(&mut self, field: &Field) {
        self.liberties = self
            .points_ids
            .iter()
            .map(|id| {
                field
                    .get_neighbor_points(id)
                    .into_iter()
                    .filter_map(|point| match point {
                        Some(p) if p.borrow().inner.is_occupied() => None,
                        Some(p) => Some(*p.borrow().id()),
                        None => None,
                    })
                    .collect::<HashSet<_>>()
            })
            .flatten()
            .collect()
    }

    pub fn delete(self, field: &Field) {
        for id in self.points_ids {
            field.get_point(&id).borrow_mut().inner.status = PointStatus::Empty;
        }
    }

    /// Defines if the group has a liberty with the given point id
    #[inline]
    pub fn has_liberty(&self, point_id: &PointID) -> bool {
        self.liberties.contains(point_id)
    }

    #[inline]
    pub fn liberties_amount(&self) -> usize {
        self.liberties.len()
    }

    #[inline]
    pub fn points_amount(&self) -> usize {
        self.points_ids.len()
    }
}

impl BitOrAssign for Group {
    fn bitor_assign(&mut self, rhs: Self) {
        self.merge(rhs)
    }
}

impl Debug for Group {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("")
            .field(&self.points_ids)
            .field(&self.liberties)
            .finish()
    }
}
