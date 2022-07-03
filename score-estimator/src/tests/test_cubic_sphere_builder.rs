use crate::{
    field::cube_sphere::{CubicSphereField, CubicSphereFieldBuilder, PointWrapper},
    point::Point,
};

#[test]
fn test_cubic_sphere_builder_with_size_4() {
    let expected = {
        let points = vec![
            // PointWrapper::new(Point::new(1), Some(), left, right, bottom)
        ];
        CubicSphereField::new(points, &4)
    };

    let real = CubicSphereFieldBuilder::default().with_size(&4).unwrap();
    todo!()
}
