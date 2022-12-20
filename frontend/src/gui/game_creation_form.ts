import * as GUI from 'babylonjs-gui'

import FieldType from '../logic/fields/enum'
import SelectComponent from './select_menu'

export default class GameCreationFormGUI {
	protected formBlock: GUI.Container
	protected fieldTypeSelect: SelectComponent

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function
	) {
		// this.formBlock = this.createFormBlock()
		this.fieldTypeSelect = this.createFieldTypeSelect()

		this.fieldTypeSelect.onSelectRegister(() => onChangeFieldType())
	}

	createFormBlock(): GUI.Container {
		const formBlock = new GUI.Container('game creation form')
		formBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
		formBlock.width = '20%'
		formBlock.height = '100%'
		formBlock.background = 'white'

		this.advancedTexture.addControl(formBlock)

		return formBlock
	}

	createFieldTypeSelect(): SelectComponent {
		const fieldTypeSelect = new SelectComponent('80px', '360px')

		fieldTypeSelect.shadowOffsetX = 10
		fieldTypeSelect.shadowOffsetY = 10

		Object.values(FieldType).forEach((fieldType) =>
			fieldTypeSelect.addOption(fieldType, fieldType)
		)

		const plane = BABYLON.MeshBuilder.CreatePlane('plane', {
			size: 1.5,
		})
		plane.parent = this.camera
		plane.position.z = 2
		plane.position.y = -0.5
		plane.position.x = 0.7

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(fieldTypeSelect.container)

		return fieldTypeSelect
	}

	createGridSizeInput() {}
}
