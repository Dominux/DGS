use crate::{errors, FieldType, SizeType};

use super::{CubicSphereFieldBuilder, Field, GridSphereFieldBuilder, RegularFieldBuilder};

/// Build field accordingly to given size and field type
pub(crate) fn build_field(size: &SizeType, field_type: FieldType) -> errors::GameResult<Field> {
    let field = match field_type {
        FieldType::CubicSphere => CubicSphereFieldBuilder::default().with_size(size)?,
        FieldType::GridSphere => GridSphereFieldBuilder::default().with_size(size),
        FieldType::Regular => RegularFieldBuilder::default().with_size(size),
    };
    Ok(field)
}
