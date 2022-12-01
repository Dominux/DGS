use crate::{
    aliases::PointID,
    field::{CubicSphereFieldBuilder, Field},
    group::Group,
    point::{PlayerColor, PointStatus},
};

#[test]
fn test_merge_groups() {
    // Creating a game field
    let field = CubicSphereFieldBuilder::default().with_size(&5).unwrap();

    // Making a couple of moves
    let point_id_1 = 1;
    let mut group_1 = make_move(&field, &point_id_1, PlayerColor::Black);
    let point_id_2 = field
        .get_neighbor_points(&point_id_1)
        .into_iter()
        .filter_map(|point| point.map(|p| *p.borrow().id()))
        .next()
        .unwrap();
    let mut group_2 = make_move(&field, &point_id_2, PlayerColor::Black);

    let expected_group = {
        let mut group_1 = group_1.clone();

        // Removing intersections between them
        group_1.liberties = &group_1.liberties - &group_2.points_ids;
        group_2.liberties = &group_2.liberties - &group_1.points_ids;

        // Merging them
        group_1.points_ids = &group_1.points_ids | &group_2.points_ids;
        group_1.liberties = &group_1.liberties | &group_2.liberties;

        group_1
    };

    // Merging groups
    group_1 |= group_2.clone();

    assert_eq!(group_1.points_ids, expected_group.points_ids);
    assert_eq!(group_1.liberties, expected_group.liberties);
}

/// Mock function to make moves without validations at all
fn make_move(field: &Field, point_id: &PointID, color: PlayerColor) -> Group {
    field.get_point(point_id).borrow_mut().inner.status = PointStatus::Occupied(color.clone());
    Group::new(point_id, field, &color)
}
