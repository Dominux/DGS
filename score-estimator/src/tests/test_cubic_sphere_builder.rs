use crate::{
    field::cube_sphere::{CubicSphereField, CubicSphereFieldBuilder, PointWrapper},
    point::{Point, PointStatus},
};

#[test]
fn test_cubic_sphere_builder_with_size_4() {
    let expected = {
        let points = vec![
            // PointWrapper::new(Point::new(1), Some(), left, right, bottom)
        ];
        CubicSphereField::new(points, &4)
    };

    let real = CubicSphereFieldBuilder::default().with_size(&5).unwrap();
    // println!("{:?}", real);

    {
        let kek = vec![
            PointWrapper {
                inner: Point {
                    id: 0,
                    status: PointStatus::Empty,
                },
                top: None,
                left: None,
                right: Some(1),
                bottom: Some(5),
            },
            PointWrapper {
                inner: Point {
                    id: 1,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(0),
                right: Some(2),
                bottom: Some(24),
            },
            PointWrapper {
                inner: Point {
                    id: 2,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(1),
                right: Some(3),
                bottom: Some(23),
            },
            PointWrapper {
                inner: Point {
                    id: 3,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(2),
                right: Some(4),
                bottom: Some(22),
            },
            PointWrapper {
                inner: Point {
                    id: 4,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(3),
                right: None,
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 5,
                    status: PointStatus::Empty,
                },
                top: Some(0),
                left: Some(4),
                right: Some(6),
                bottom: Some(19),
            },
            PointWrapper {
                inner: Point {
                    id: 6,
                    status: PointStatus::Empty,
                },
                top: Some(1),
                left: Some(5),
                right: Some(7),
                bottom: Some(14),
            },
            PointWrapper {
                inner: Point {
                    id: 7,
                    status: PointStatus::Empty,
                },
                top: Some(2),
                left: Some(6),
                right: Some(8),
                bottom: Some(15),
            },
            PointWrapper {
                inner: Point {
                    id: 8,
                    status: PointStatus::Empty,
                },
                top: Some(3),
                left: Some(7),
                right: Some(9),
                bottom: Some(18),
            },
            PointWrapper {
                inner: Point {
                    id: 9,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(33),
                right: Some(10),
                bottom: Some(25),
            },
            PointWrapper {
                inner: Point {
                    id: 10,
                    status: PointStatus::Empty,
                },
                top: Some(10),
                left: Some(9),
                right: Some(11),
                bottom: Some(10),
            },
            PointWrapper {
                inner: Point {
                    id: 11,
                    status: PointStatus::Empty,
                },
                top: Some(15),
                left: Some(10),
                right: Some(12),
                bottom: Some(27),
            },
            PointWrapper {
                inner: Point {
                    id: 12,
                    status: PointStatus::Empty,
                },
                top: Some(20),
                left: Some(11),
                right: Some(13),
                bottom: Some(28),
            },
            PointWrapper {
                inner: Point {
                    id: 13,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(12),
                right: Some(14),
                bottom: Some(29),
            },
            PointWrapper {
                inner: Point {
                    id: 14,
                    status: PointStatus::Empty,
                },
                top: Some(6),
                left: Some(13),
                right: Some(15),
                bottom: Some(30),
            },
            PointWrapper {
                inner: Point {
                    id: 15,
                    status: PointStatus::Empty,
                },
                top: Some(7),
                left: Some(14),
                right: Some(16),
                bottom: Some(31),
            },
            PointWrapper {
                inner: Point {
                    id: 16,
                    status: PointStatus::Empty,
                },
                top: Some(8),
                left: Some(15),
                right: Some(17),
                bottom: Some(32),
            },
            PointWrapper {
                inner: Point {
                    id: 17,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(16),
                right: Some(18),
                bottom: Some(33),
            },
            PointWrapper {
                inner: Point {
                    id: 18,
                    status: PointStatus::Empty,
                },
                top: Some(8),
                left: Some(17),
                right: Some(19),
                bottom: Some(34),
            },
            PointWrapper {
                inner: Point {
                    id: 19,
                    status: PointStatus::Empty,
                },
                top: Some(5),
                left: Some(18),
                right: Some(20),
                bottom: Some(35),
            },
            PointWrapper {
                inner: Point {
                    id: 20,
                    status: PointStatus::Empty,
                },
                top: Some(2),
                left: Some(19),
                right: Some(21),
                bottom: Some(36),
            },
            PointWrapper {
                inner: Point {
                    id: 21,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(20),
                right: Some(22),
                bottom: Some(37),
            },
            PointWrapper {
                inner: Point {
                    id: 22,
                    status: PointStatus::Empty,
                },
                top: Some(3),
                left: Some(21),
                right: Some(23),
                bottom: Some(38),
            },
            PointWrapper {
                inner: Point {
                    id: 23,
                    status: PointStatus::Empty,
                },
                top: Some(2),
                left: Some(22),
                right: Some(24),
                bottom: Some(39),
            },
            PointWrapper {
                inner: Point {
                    id: 24,
                    status: PointStatus::Empty,
                },
                top: Some(1),
                left: Some(23),
                right: Some(25),
                bottom: Some(40),
            },
            PointWrapper {
                inner: Point {
                    id: 25,
                    status: PointStatus::Empty,
                },
                top: Some(9),
                left: Some(40),
                right: Some(26),
                bottom: Some(41),
            },
            PointWrapper {
                inner: Point {
                    id: 26,
                    status: PointStatus::Empty,
                },
                top: Some(10),
                left: Some(25),
                right: Some(27),
                bottom: Some(42),
            },
            PointWrapper {
                inner: Point {
                    id: 27,
                    status: PointStatus::Empty,
                },
                top: Some(11),
                left: Some(26),
                right: Some(28),
                bottom: Some(43),
            },
            PointWrapper {
                inner: Point {
                    id: 28,
                    status: PointStatus::Empty,
                },
                top: Some(12),
                left: Some(27),
                right: Some(29),
                bottom: Some(44),
            },
            PointWrapper {
                inner: Point {
                    id: 29,
                    status: PointStatus::Empty,
                },
                top: Some(13),
                left: Some(28),
                right: Some(30),
                bottom: Some(45),
            },
            PointWrapper {
                inner: Point {
                    id: 30,
                    status: PointStatus::Empty,
                },
                top: Some(14),
                left: Some(29),
                right: Some(31),
                bottom: Some(46),
            },
            PointWrapper {
                inner: Point {
                    id: 31,
                    status: PointStatus::Empty,
                },
                top: Some(15),
                left: Some(30),
                right: Some(32),
                bottom: Some(47),
            },
            PointWrapper {
                inner: Point {
                    id: 32,
                    status: PointStatus::Empty,
                },
                top: Some(16),
                left: Some(31),
                right: Some(33),
                bottom: Some(48),
            },
            PointWrapper {
                inner: Point {
                    id: 33,
                    status: PointStatus::Empty,
                },
                top: Some(17),
                left: Some(32),
                right: Some(34),
                bottom: Some(49),
            },
            PointWrapper {
                inner: Point {
                    id: 34,
                    status: PointStatus::Empty,
                },
                top: Some(18),
                left: Some(33),
                right: Some(35),
                bottom: Some(50),
            },
            PointWrapper {
                inner: Point {
                    id: 35,
                    status: PointStatus::Empty,
                },
                top: Some(19),
                left: Some(34),
                right: Some(36),
                bottom: Some(51),
            },
            PointWrapper {
                inner: Point {
                    id: 36,
                    status: PointStatus::Empty,
                },
                top: Some(20),
                left: Some(35),
                right: Some(37),
                bottom: Some(52),
            },
            PointWrapper {
                inner: Point {
                    id: 37,
                    status: PointStatus::Empty,
                },
                top: Some(21),
                left: Some(36),
                right: Some(38),
                bottom: Some(53),
            },
            PointWrapper {
                inner: Point {
                    id: 38,
                    status: PointStatus::Empty,
                },
                top: Some(22),
                left: Some(37),
                right: Some(39),
                bottom: Some(54),
            },
            PointWrapper {
                inner: Point {
                    id: 39,
                    status: PointStatus::Empty,
                },
                top: Some(23),
                left: Some(38),
                right: Some(40),
                bottom: Some(55),
            },
            PointWrapper {
                inner: Point {
                    id: 40,
                    status: PointStatus::Empty,
                },
                top: Some(24),
                left: Some(39),
                right: Some(41),
                bottom: Some(56),
            },
            PointWrapper {
                inner: Point {
                    id: 41,
                    status: PointStatus::Empty,
                },
                top: Some(25),
                left: Some(56),
                right: Some(42),
                bottom: Some(57),
            },
            PointWrapper {
                inner: Point {
                    id: 42,
                    status: PointStatus::Empty,
                },
                top: Some(26),
                left: Some(41),
                right: Some(43),
                bottom: Some(58),
            },
            PointWrapper {
                inner: Point {
                    id: 43,
                    status: PointStatus::Empty,
                },
                top: Some(27),
                left: Some(42),
                right: Some(44),
                bottom: Some(59),
            },
            PointWrapper {
                inner: Point {
                    id: 44,
                    status: PointStatus::Empty,
                },
                top: Some(28),
                left: Some(43),
                right: Some(45),
                bottom: Some(60),
            },
            PointWrapper {
                inner: Point {
                    id: 45,
                    status: PointStatus::Empty,
                },
                top: Some(29),
                left: Some(44),
                right: Some(46),
                bottom: Some(61),
            },
            PointWrapper {
                inner: Point {
                    id: 46,
                    status: PointStatus::Empty,
                },
                top: Some(30),
                left: Some(45),
                right: Some(47),
                bottom: Some(62),
            },
            PointWrapper {
                inner: Point {
                    id: 47,
                    status: PointStatus::Empty,
                },
                top: Some(31),
                left: Some(46),
                right: Some(48),
                bottom: Some(63),
            },
            PointWrapper {
                inner: Point {
                    id: 48,
                    status: PointStatus::Empty,
                },
                top: Some(32),
                left: Some(47),
                right: Some(49),
                bottom: Some(64),
            },
            PointWrapper {
                inner: Point {
                    id: 49,
                    status: PointStatus::Empty,
                },
                top: Some(33),
                left: Some(48),
                right: Some(50),
                bottom: Some(65),
            },
            PointWrapper {
                inner: Point {
                    id: 50,
                    status: PointStatus::Empty,
                },
                top: Some(34),
                left: Some(49),
                right: Some(51),
                bottom: Some(66),
            },
            PointWrapper {
                inner: Point {
                    id: 51,
                    status: PointStatus::Empty,
                },
                top: Some(35),
                left: Some(50),
                right: Some(52),
                bottom: Some(67),
            },
            PointWrapper {
                inner: Point {
                    id: 52,
                    status: PointStatus::Empty,
                },
                top: Some(36),
                left: Some(51),
                right: Some(53),
                bottom: Some(68),
            },
            PointWrapper {
                inner: Point {
                    id: 53,
                    status: PointStatus::Empty,
                },
                top: Some(37),
                left: Some(52),
                right: Some(54),
                bottom: Some(69),
            },
            PointWrapper {
                inner: Point {
                    id: 54,
                    status: PointStatus::Empty,
                },
                top: Some(38),
                left: Some(53),
                right: Some(55),
                bottom: Some(70),
            },
            PointWrapper {
                inner: Point {
                    id: 55,
                    status: PointStatus::Empty,
                },
                top: Some(39),
                left: Some(54),
                right: Some(56),
                bottom: Some(71),
            },
            PointWrapper {
                inner: Point {
                    id: 56,
                    status: PointStatus::Empty,
                },
                top: Some(40),
                left: Some(55),
                right: Some(57),
                bottom: Some(72),
            },
            PointWrapper {
                inner: Point {
                    id: 57,
                    status: PointStatus::Empty,
                },
                top: Some(41),
                left: Some(72),
                right: Some(58),
                bottom: Some(73),
            },
            PointWrapper {
                inner: Point {
                    id: 58,
                    status: PointStatus::Empty,
                },
                top: Some(42),
                left: Some(57),
                right: Some(59),
                bottom: Some(74),
            },
            PointWrapper {
                inner: Point {
                    id: 59,
                    status: PointStatus::Empty,
                },
                top: Some(43),
                left: Some(58),
                right: Some(60),
                bottom: Some(75),
            },
            PointWrapper {
                inner: Point {
                    id: 60,
                    status: PointStatus::Empty,
                },
                top: Some(44),
                left: Some(59),
                right: Some(61),
                bottom: Some(76),
            },
            PointWrapper {
                inner: Point {
                    id: 61,
                    status: PointStatus::Empty,
                },
                top: Some(45),
                left: Some(60),
                right: Some(62),
                bottom: Some(77),
            },
            PointWrapper {
                inner: Point {
                    id: 62,
                    status: PointStatus::Empty,
                },
                top: Some(46),
                left: Some(61),
                right: Some(63),
                bottom: Some(78),
            },
            PointWrapper {
                inner: Point {
                    id: 63,
                    status: PointStatus::Empty,
                },
                top: Some(47),
                left: Some(62),
                right: Some(64),
                bottom: Some(79),
            },
            PointWrapper {
                inner: Point {
                    id: 64,
                    status: PointStatus::Empty,
                },
                top: Some(48),
                left: Some(63),
                right: Some(65),
                bottom: Some(80),
            },
            PointWrapper {
                inner: Point {
                    id: 65,
                    status: PointStatus::Empty,
                },
                top: Some(49),
                left: Some(64),
                right: Some(66),
                bottom: Some(81),
            },
            PointWrapper {
                inner: Point {
                    id: 66,
                    status: PointStatus::Empty,
                },
                top: Some(50),
                left: Some(65),
                right: Some(67),
                bottom: Some(82),
            },
            PointWrapper {
                inner: Point {
                    id: 67,
                    status: PointStatus::Empty,
                },
                top: Some(51),
                left: Some(66),
                right: Some(68),
                bottom: Some(83),
            },
            PointWrapper {
                inner: Point {
                    id: 68,
                    status: PointStatus::Empty,
                },
                top: Some(52),
                left: Some(67),
                right: Some(69),
                bottom: Some(84),
            },
            PointWrapper {
                inner: Point {
                    id: 69,
                    status: PointStatus::Empty,
                },
                top: Some(53),
                left: Some(68),
                right: Some(70),
                bottom: Some(85),
            },
            PointWrapper {
                inner: Point {
                    id: 70,
                    status: PointStatus::Empty,
                },
                top: Some(54),
                left: Some(69),
                right: Some(71),
                bottom: Some(86),
            },
            PointWrapper {
                inner: Point {
                    id: 71,
                    status: PointStatus::Empty,
                },
                top: Some(55),
                left: Some(70),
                right: Some(72),
                bottom: Some(87),
            },
            PointWrapper {
                inner: Point {
                    id: 72,
                    status: PointStatus::Empty,
                },
                top: Some(56),
                left: Some(71),
                right: Some(73),
                bottom: Some(88),
            },
            PointWrapper {
                inner: Point {
                    id: 73,
                    status: PointStatus::Empty,
                },
                top: Some(96),
                left: Some(74),
                right: Some(72),
                bottom: Some(57),
            },
            PointWrapper {
                inner: Point {
                    id: 74,
                    status: PointStatus::Empty,
                },
                top: Some(95),
                left: Some(75),
                right: Some(73),
                bottom: Some(58),
            },
            PointWrapper {
                inner: Point {
                    id: 75,
                    status: PointStatus::Empty,
                },
                top: Some(94),
                left: Some(76),
                right: Some(74),
                bottom: Some(59),
            },
            PointWrapper {
                inner: Point {
                    id: 76,
                    status: PointStatus::Empty,
                },
                top: Some(60),
                left: Some(77),
                right: Some(75),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 77,
                    status: PointStatus::Empty,
                },
                top: Some(95),
                left: Some(78),
                right: Some(76),
                bottom: Some(61),
            },
            PointWrapper {
                inner: Point {
                    id: 78,
                    status: PointStatus::Empty,
                },
                top: Some(92),
                left: Some(79),
                right: Some(77),
                bottom: Some(62),
            },
            PointWrapper {
                inner: Point {
                    id: 79,
                    status: PointStatus::Empty,
                },
                top: Some(89),
                left: Some(80),
                right: Some(78),
                bottom: Some(63),
            },
            PointWrapper {
                inner: Point {
                    id: 80,
                    status: PointStatus::Empty,
                },
                top: Some(64),
                left: Some(81),
                right: Some(79),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 81,
                    status: PointStatus::Empty,
                },
                top: Some(89),
                left: Some(82),
                right: Some(80),
                bottom: Some(65),
            },
            PointWrapper {
                inner: Point {
                    id: 82,
                    status: PointStatus::Empty,
                },
                top: Some(90),
                left: Some(83),
                right: Some(81),
                bottom: Some(66),
            },
            PointWrapper {
                inner: Point {
                    id: 83,
                    status: PointStatus::Empty,
                },
                top: Some(91),
                left: Some(84),
                right: Some(82),
                bottom: Some(67),
            },
            PointWrapper {
                inner: Point {
                    id: 84,
                    status: PointStatus::Empty,
                },
                top: Some(68),
                left: Some(85),
                right: Some(83),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 85,
                    status: PointStatus::Empty,
                },
                top: Some(77),
                left: Some(86),
                right: Some(84),
                bottom: Some(69),
            },
            PointWrapper {
                inner: Point {
                    id: 86,
                    status: PointStatus::Empty,
                },
                top: Some(82),
                left: Some(87),
                right: Some(85),
                bottom: Some(70),
            },
            PointWrapper {
                inner: Point {
                    id: 87,
                    status: PointStatus::Empty,
                },
                top: Some(87),
                left: Some(88),
                right: Some(86),
                bottom: Some(87),
            },
            PointWrapper {
                inner: Point {
                    id: 88,
                    status: PointStatus::Empty,
                },
                top: Some(72),
                left: Some(64),
                right: Some(87),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 89,
                    status: PointStatus::Empty,
                },
                top: Some(94),
                left: Some(90),
                right: Some(88),
                bottom: Some(79),
            },
            PointWrapper {
                inner: Point {
                    id: 90,
                    status: PointStatus::Empty,
                },
                top: Some(95),
                left: Some(91),
                right: Some(89),
                bottom: Some(82),
            },
            PointWrapper {
                inner: Point {
                    id: 91,
                    status: PointStatus::Empty,
                },
                top: Some(96),
                left: Some(92),
                right: Some(90),
                bottom: Some(83),
            },
            PointWrapper {
                inner: Point {
                    id: 92,
                    status: PointStatus::Empty,
                },
                top: Some(97),
                left: Some(93),
                right: Some(91),
                bottom: Some(78),
            },
            PointWrapper {
                inner: Point {
                    id: 93,
                    status: PointStatus::Empty,
                },
                top: None,
                left: Some(94),
                right: None,
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 94,
                    status: PointStatus::Empty,
                },
                top: Some(75),
                left: Some(95),
                right: Some(93),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 95,
                    status: PointStatus::Empty,
                },
                top: Some(74),
                left: Some(96),
                right: Some(94),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 96,
                    status: PointStatus::Empty,
                },
                top: Some(73),
                left: Some(97),
                right: Some(95),
                bottom: None,
            },
            PointWrapper {
                inner: Point {
                    id: 97,
                    status: PointStatus::Empty,
                },
                top: Some(92),
                left: None,
                right: Some(96),
                bottom: None,
            },
        ];
    }

    todo!()
}
