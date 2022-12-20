import * as GUI from 'babylonjs-gui'
import { ACCENT_COLOR } from '../constants'

import FieldType from '../logic/fields/enum'
import SelectComponent from './select_menu'

export default class GameCreationFormGUI {
	protected fieldTypeSelect: SelectComponent
	protected gridSizeInput: GUI.InputText

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number
	) {
		this.fieldTypeSelect = this.createFieldTypeSelect(defaultFieldType)
		this.fieldTypeSelect.onSelectRegister(onChangeFieldType)

		this.gridSizeInput = this.createGridSizeInput(
			defaultGridSize,
			onChangeGridSize
		)
	}

	createFieldTypeSelect(defaultFieldType?: FieldType): SelectComponent {
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

		const plane = BABYLON.MeshBuilder.CreatePlane('field-type-plane', {
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

	createGridSizeInput(defaultGridSize: number = 0, onChangeGridSize: Function) {
		const input = new GUI.InputText('grid-size', String(defaultGridSize))
		input.width = 1
		input.height = 0.4
		input.fontSize = 300
		input.color = 'black'
		input.background = 'white'
		input.focusedBackground = ACCENT_COLOR

		// Enabling only digits
		input.onBeforeKeyAddObservable.add((input) => {
			let key = input.currentKey

			input.addKey = key > '0' && key < '9'

			// TODO: add validation
		})

		// Reactivity
		input.onTextChangedObservable.add((input) =>
			onChangeGridSize(parseInt(input.text))
		)

		const plane = BABYLON.MeshBuilder.CreatePlane('grid-size-plane', {
			size: 0.25,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = 0.1
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(input)

		return input
	}
}
