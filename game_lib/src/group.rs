use std::{collections::HashSet, fmt::Debug, ops::BitOrAssign};

use crate::{aliases::PointID, field::interface::Field, point::PlayerColor};

#[derive(Clone)]
pub struct Group<'a, T: Field> {
    pub(crate) points_ids: HashSet<PointID>,
    pub(crate) liberties: HashSet<PointID>,
    field: &'a T,
}

impl<'a, T> Group<'a, T>
where
    T: Field,
{
    /// Consider making any new point a group
    pub fn new<'b>(point_id: &PointID, field: &'a T, color: &PlayerColor) -> Self {
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
            field,
        }
    }

    /// Merge another group into current
    pub fn merge(&mut self, mut other: Group<T>) {
        // Removing intersections between them
        self.liberties = &self.liberties - &other.points_ids;
        other.liberties = &other.liberties - &self.points_ids;

        // Merging them
        self.points_ids = &self.points_ids | &other.points_ids;
        self.liberties = &self.liberties | &other.liberties;
    }

    #[inline]
    pub fn liberties_amount(&self) -> usize {
        self.liberties.len()
    }
}

impl<'a, T> BitOrAssign for Group<'a, T>
where
    T: Field,
{
    fn bitor_assign(&mut self, rhs: Self) {
        self.merge(rhs)
    }
}

impl<'a, T> Debug for Group<'a, T>
where
    T: Field,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("")
            .field(&self.points_ids)
            .field(&self.liberties)
            .finish()
    }
}
