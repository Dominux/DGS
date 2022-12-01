use std::cell::RefCell;
use std::rc::Rc;

use crate::{
    field::{Field, RegularField, RegularFieldBuilder},
    point::{Point, PointWrapper},
};

const COMPRESSED_FIELD: [[Option<usize>; 4]; 25] = [
    [None, None, Some(1), Some(5)],
    [None, Some(0), Some(2), Some(6)],
    [None, Some(1), Some(3), Some(7)],
    [None, Some(2), Some(4), Some(8)],
    [None, Some(3), None, Some(9)],
    [Some(0), None, Some(6), Some(10)],
    [Some(1), Some(5), Some(7), Some(11)],
    [Some(2), Some(6), Some(8), Some(12)],
    [Some(3), Some(7), Some(9), Some(13)],
    [Some(4), Some(8), None, Some(14)],
    [Some(5), None, Some(11), Some(15)],
    [Some(6), Some(10), Some(12), Some(16)],
    [Some(7), Some(11), Some(13), Some(17)],
    [Some(8), Some(12), Some(14), Some(18)],
    [Some(9), Some(13), None, Some(19)],
    [Some(10), None, Some(16), Some(20)],
    [Some(11), Some(15), Some(17), Some(21)],
    [Some(12), Some(16), Some(18), Some(22)],
    [Some(13), Some(17), Some(19), Some(23)],
    [Some(14), Some(18), None, Some(24)],
    [Some(15), None, Some(21), None],
    [Some(16), Some(20), Some(22), None],
    [Some(17), Some(21), Some(23), None],
    [Some(18), Some(22), Some(24), None],
    [Some(19), Some(23), None, None],
];

#[test]
fn test_regular_field_builder_with_size_5() {
    let expected_field = {
        let points = COMPRESSED_FIELD
            .iter()
            .enumerate()
            .map(|(id, p)| {
                Rc::new(RefCell::new(PointWrapper::new(
                    Point::new(id),
                    p[0],
                    p[1],
                    p[2],
                    p[3],
                )))
            })
            .collect();
        RegularField::new(points)
    };

    let real = RegularFieldBuilder::default().with_size(&5);

    for id in 0..real.len() {
        assert_eq!(
            *expected_field.get_point(&id).borrow(),
            *real.get_point(&id).borrow()
        )
    }
}
