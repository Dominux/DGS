import * as GUI from 'babylonjs-gui'

import FieldType from '../logic/fields/enum'
import SelectComponent from './select_menu'

export default class GameCreationFormGUI {
	protected formBlock: GUI.Container
	protected fieldTypeSelect: SelectComponent

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType = FieldType.GridSphere,
		defaultGridSize: number = 9
	) {
		this.fieldTypeSelect = this.createFieldTypeSelect(defaultFieldType)

		this.fieldTypeSelect.onSelectRegister(onChangeFieldType)
	}

	createFieldTypeSelect(defaultFieldType?: any): SelectComponent {
		const fieldTypeSelect = new SelectComponent(
			'80px',
			'360px',
			defaultFieldType
		)

		fieldTypeSelect.shadowOffsetX = 10
		fieldTypeSelect.shadowOffsetY = 10

		Object.values(FieldType).forEach((fieldType) =>
			fieldTypeSelect.addOption(fieldType, fieldType)
		)

		const plane = BABYLON.MeshBuilder.CreatePlane('plane', {
			size: 1.2,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = -0.1
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(fieldTypeSelect.container)

		return fieldTypeSelect
	}

	createGridSizeInput() {}
}
