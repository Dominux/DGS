import GridSphere from './grid_sphere'
import RegularField from './regular'

enum FieldType {
	GridSphere = 'GridSphere',
	Regular = 'Regular',
}

export default FieldType

export function getFieldFromType(fieldType: FieldType): Field {
	switch (fieldType) {
		case FieldType.Regular:
			return RegularField
			break

		default:
			return GridSphere
			break
	}
}
