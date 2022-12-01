use std::cell::RefCell;
use std::rc::Rc;

use crate::{
    field::{CubicSphereFieldBuilder, Field, FieldType},
    point::{Point, PointWrapper},
};

const COMPRESSED_FIELD: [[Option<usize>; 4]; 218] = [
    [None, Some(26), Some(1), Some(48)],
    [Some(47), Some(0), Some(2), Some(6)],
    [Some(46), Some(1), Some(3), Some(7)],
    [Some(45), Some(2), Some(4), Some(8)],
    [Some(44), Some(3), Some(42), Some(9)],
    [Some(0), Some(27), Some(6), Some(10)],
    [Some(1), Some(5), Some(7), Some(11)],
    [Some(2), Some(6), Some(8), Some(12)],
    [Some(3), Some(7), Some(9), Some(13)],
    [Some(4), Some(8), Some(41), Some(14)],
    [Some(5), Some(28), Some(11), Some(15)],
    [Some(6), Some(10), Some(12), Some(16)],
    [Some(7), Some(11), Some(13), Some(17)],
    [Some(8), Some(12), Some(14), Some(18)],
    [Some(9), Some(13), Some(40), Some(19)],
    [Some(10), Some(29), Some(16), Some(20)],
    [Some(11), Some(15), Some(17), Some(21)],
    [Some(12), Some(16), Some(18), Some(22)],
    [Some(13), Some(17), Some(19), Some(23)],
    [Some(14), Some(18), Some(39), Some(24)],
    [Some(15), Some(30), Some(21), Some(32)],
    [Some(16), Some(20), Some(22), Some(33)],
    [Some(17), Some(21), Some(23), Some(34)],
    [Some(18), Some(22), Some(24), Some(35)],
    [Some(19), Some(23), Some(38), Some(36)],
    [None, Some(48), Some(26), Some(49)],
    [Some(0), Some(25), Some(27), Some(50)],
    [Some(5), Some(26), Some(28), Some(51)],
    [Some(10), Some(27), Some(29), Some(52)],
    [Some(15), Some(28), Some(30), Some(53)],
    [Some(20), Some(29), Some(31), Some(54)],
    [None, Some(30), Some(32), Some(55)],
    [Some(20), Some(31), Some(33), Some(56)],
    [Some(21), Some(32), Some(34), Some(57)],
    [Some(22), Some(33), Some(35), Some(58)],
    [Some(23), Some(34), Some(36), Some(59)],
    [Some(24), Some(35), Some(37), Some(60)],
    [None, Some(36), Some(38), Some(61)],
    [Some(24), Some(37), Some(39), Some(62)],
    [Some(19), Some(38), Some(40), Some(63)],
    [Some(14), Some(39), Some(41), Some(64)],
    [Some(9), Some(40), Some(42), Some(65)],
    [Some(4), Some(41), Some(43), Some(66)],
    [None, Some(42), Some(44), Some(67)],
    [Some(4), Some(43), Some(45), Some(68)],
    [Some(3), Some(44), Some(46), Some(69)],
    [Some(2), Some(45), Some(47), Some(70)],
    [Some(1), Some(46), Some(48), Some(71)],
    [Some(0), Some(47), Some(25), Some(72)],
    [Some(25), Some(71), Some(50), Some(73)],
    [Some(26), Some(49), Some(51), Some(74)],
    [Some(27), Some(50), Some(52), Some(75)],
    [Some(28), Some(51), Some(53), Some(76)],
    [Some(29), Some(52), Some(54), Some(77)],
    [Some(30), Some(53), Some(55), Some(78)],
    [Some(31), Some(54), Some(56), Some(79)],
    [Some(32), Some(55), Some(57), Some(80)],
    [Some(33), Some(56), Some(58), Some(81)],
    [Some(34), Some(57), Some(59), Some(82)],
    [Some(35), Some(58), Some(60), Some(83)],
    [Some(36), Some(59), Some(61), Some(84)],
    [Some(37), Some(60), Some(62), Some(85)],
    [Some(38), Some(61), Some(63), Some(86)],
    [Some(39), Some(62), Some(64), Some(87)],
    [Some(40), Some(63), Some(65), Some(88)],
    [Some(41), Some(64), Some(66), Some(89)],
    [Some(42), Some(65), Some(67), Some(90)],
    [Some(43), Some(66), Some(68), Some(91)],
    [Some(44), Some(67), Some(69), Some(92)],
    [Some(45), Some(68), Some(70), Some(93)],
    [Some(46), Some(69), Some(71), Some(94)],
    [Some(47), Some(70), Some(72), Some(95)],
    [Some(48), Some(71), Some(49), Some(96)],
    [Some(49), Some(95), Some(74), Some(97)],
    [Some(50), Some(73), Some(75), Some(98)],
    [Some(51), Some(74), Some(76), Some(99)],
    [Some(52), Some(75), Some(77), Some(100)],
    [Some(53), Some(76), Some(78), Some(101)],
    [Some(54), Some(77), Some(79), Some(102)],
    [Some(55), Some(78), Some(80), Some(103)],
    [Some(56), Some(79), Some(81), Some(104)],
    [Some(57), Some(80), Some(82), Some(105)],
    [Some(58), Some(81), Some(83), Some(106)],
    [Some(59), Some(82), Some(84), Some(107)],
    [Some(60), Some(83), Some(85), Some(108)],
    [Some(61), Some(84), Some(86), Some(109)],
    [Some(62), Some(85), Some(87), Some(110)],
    [Some(63), Some(86), Some(88), Some(111)],
    [Some(64), Some(87), Some(89), Some(112)],
    [Some(65), Some(88), Some(90), Some(113)],
    [Some(66), Some(89), Some(91), Some(114)],
    [Some(67), Some(90), Some(92), Some(115)],
    [Some(68), Some(91), Some(93), Some(116)],
    [Some(69), Some(92), Some(94), Some(117)],
    [Some(70), Some(93), Some(95), Some(118)],
    [Some(71), Some(94), Some(96), Some(119)],
    [Some(72), Some(95), Some(73), Some(120)],
    [Some(73), Some(119), Some(98), Some(121)],
    [Some(74), Some(97), Some(99), Some(122)],
    [Some(75), Some(98), Some(100), Some(123)],
    [Some(76), Some(99), Some(101), Some(124)],
    [Some(77), Some(100), Some(102), Some(125)],
    [Some(78), Some(101), Some(103), Some(126)],
    [Some(79), Some(102), Some(104), Some(127)],
    [Some(80), Some(103), Some(105), Some(128)],
    [Some(81), Some(104), Some(106), Some(129)],
    [Some(82), Some(105), Some(107), Some(130)],
    [Some(83), Some(106), Some(108), Some(131)],
    [Some(84), Some(107), Some(109), Some(132)],
    [Some(85), Some(108), Some(110), Some(133)],
    [Some(86), Some(109), Some(111), Some(134)],
    [Some(87), Some(110), Some(112), Some(135)],
    [Some(88), Some(111), Some(113), Some(136)],
    [Some(89), Some(112), Some(114), Some(137)],
    [Some(90), Some(113), Some(115), Some(138)],
    [Some(91), Some(114), Some(116), Some(139)],
    [Some(92), Some(115), Some(117), Some(140)],
    [Some(93), Some(116), Some(118), Some(141)],
    [Some(94), Some(117), Some(119), Some(142)],
    [Some(95), Some(118), Some(120), Some(143)],
    [Some(96), Some(119), Some(97), Some(144)],
    [Some(97), Some(143), Some(122), Some(145)],
    [Some(98), Some(121), Some(123), Some(146)],
    [Some(99), Some(122), Some(124), Some(147)],
    [Some(100), Some(123), Some(125), Some(148)],
    [Some(101), Some(124), Some(126), Some(149)],
    [Some(102), Some(125), Some(127), Some(150)],
    [Some(103), Some(126), Some(128), Some(151)],
    [Some(104), Some(127), Some(129), Some(152)],
    [Some(105), Some(128), Some(130), Some(153)],
    [Some(106), Some(129), Some(131), Some(154)],
    [Some(107), Some(130), Some(132), Some(155)],
    [Some(108), Some(131), Some(133), Some(156)],
    [Some(109), Some(132), Some(134), Some(157)],
    [Some(110), Some(133), Some(135), Some(158)],
    [Some(111), Some(134), Some(136), Some(159)],
    [Some(112), Some(135), Some(137), Some(160)],
    [Some(113), Some(136), Some(138), Some(161)],
    [Some(114), Some(137), Some(139), Some(162)],
    [Some(115), Some(138), Some(140), Some(163)],
    [Some(116), Some(139), Some(141), Some(164)],
    [Some(117), Some(140), Some(142), Some(165)],
    [Some(118), Some(141), Some(143), Some(166)],
    [Some(119), Some(142), Some(144), Some(167)],
    [Some(120), Some(143), Some(121), Some(168)],
    [Some(121), Some(167), Some(146), Some(169)],
    [Some(122), Some(145), Some(147), Some(170)],
    [Some(123), Some(146), Some(148), Some(171)],
    [Some(124), Some(147), Some(149), Some(172)],
    [Some(125), Some(148), Some(150), Some(173)],
    [Some(126), Some(149), Some(151), Some(174)],
    [Some(127), Some(150), Some(152), Some(175)],
    [Some(128), Some(151), Some(153), Some(176)],
    [Some(129), Some(152), Some(154), Some(177)],
    [Some(130), Some(153), Some(155), Some(178)],
    [Some(131), Some(154), Some(156), Some(179)],
    [Some(132), Some(155), Some(157), Some(180)],
    [Some(133), Some(156), Some(158), Some(181)],
    [Some(134), Some(157), Some(159), Some(182)],
    [Some(135), Some(158), Some(160), Some(183)],
    [Some(136), Some(159), Some(161), Some(184)],
    [Some(137), Some(160), Some(162), Some(185)],
    [Some(138), Some(161), Some(163), Some(186)],
    [Some(139), Some(162), Some(164), Some(187)],
    [Some(140), Some(163), Some(165), Some(188)],
    [Some(141), Some(164), Some(166), Some(189)],
    [Some(142), Some(165), Some(167), Some(190)],
    [Some(143), Some(166), Some(168), Some(191)],
    [Some(144), Some(167), Some(145), Some(192)],
    [Some(145), Some(170), Some(192), Some(217)],
    [Some(146), Some(171), Some(169), Some(216)],
    [Some(147), Some(172), Some(170), Some(215)],
    [Some(148), Some(173), Some(171), Some(214)],
    [Some(149), Some(174), Some(172), Some(213)],
    [Some(150), Some(175), Some(173), None],
    [Some(151), Some(176), Some(174), Some(213)],
    [Some(152), Some(177), Some(175), Some(208)],
    [Some(153), Some(178), Some(176), Some(203)],
    [Some(154), Some(179), Some(177), Some(198)],
    [Some(155), Some(180), Some(178), Some(193)],
    [Some(156), Some(181), Some(179), None],
    [Some(157), Some(182), Some(180), Some(193)],
    [Some(158), Some(183), Some(181), Some(194)],
    [Some(159), Some(184), Some(182), Some(195)],
    [Some(160), Some(185), Some(183), Some(196)],
    [Some(161), Some(186), Some(184), Some(197)],
    [Some(162), Some(187), Some(185), None],
    [Some(163), Some(188), Some(186), Some(197)],
    [Some(164), Some(189), Some(187), Some(202)],
    [Some(165), Some(190), Some(188), Some(207)],
    [Some(166), Some(191), Some(189), Some(212)],
    [Some(167), Some(192), Some(190), Some(217)],
    [Some(168), Some(169), Some(191), None],
    [Some(181), Some(194), Some(179), Some(198)],
    [Some(182), Some(195), Some(193), Some(199)],
    [Some(183), Some(196), Some(194), Some(200)],
    [Some(184), Some(197), Some(195), Some(201)],
    [Some(185), Some(187), Some(196), Some(202)],
    [Some(193), Some(199), Some(178), Some(203)],
    [Some(194), Some(200), Some(198), Some(204)],
    [Some(195), Some(201), Some(199), Some(205)],
    [Some(196), Some(202), Some(200), Some(206)],
    [Some(197), Some(188), Some(201), Some(207)],
    [Some(198), Some(204), Some(177), Some(208)],
    [Some(199), Some(205), Some(203), Some(209)],
    [Some(200), Some(206), Some(204), Some(210)],
    [Some(201), Some(207), Some(205), Some(211)],
    [Some(202), Some(189), Some(206), Some(212)],
    [Some(203), Some(209), Some(176), Some(213)],
    [Some(204), Some(210), Some(208), Some(214)],
    [Some(205), Some(211), Some(209), Some(215)],
    [Some(206), Some(212), Some(210), Some(216)],
    [Some(207), Some(190), Some(211), Some(217)],
    [Some(208), Some(214), Some(175), Some(173)],
    [Some(209), Some(215), Some(213), Some(172)],
    [Some(210), Some(216), Some(214), Some(171)],
    [Some(211), Some(217), Some(215), Some(170)],
    [Some(169), Some(191), Some(216), None],
];

#[test]
fn test_cubic_sphere_builder_with_size_7() {
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
        Field::new(points, FieldType::CubicSphere)
    };

    let real = CubicSphereFieldBuilder::default().with_size(&7).unwrap();

    for id in 0..expected_field.len() {
        assert_eq!(
            *expected_field.get_point(&id).borrow(),
            *real.get_point(&id).borrow()
        )
    }
}
