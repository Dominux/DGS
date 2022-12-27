import * as GUI from 'babylonjs-gui'
import { ACCENT_COLOR } from '../constants'

import FieldType from '../logic/fields/enum'
import GUIComponent from './gui_components'
import SelectComponent from './select_menu'

export default class GameCreationFormGUI {
	protected fieldTypeSelect: GUIComponent
	protected gridSizeInput: GUIComponent
	protected startButton: GUIComponent

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number,
		onSumbit: Function
	) {
		this.fieldTypeSelect = this.createFieldTypeSelect(defaultFieldType)
		this.fieldTypeSelect.component.onSelectRegister(onChangeFieldType)

		this.gridSizeInput = this.createGridSizeInput(
			defaultGridSize,
			onChangeGridSize
		)

		this.startButton = this.createStartButton(onSumbit)
	}

	createFieldTypeSelect(defaultFieldType?: FieldType): GUIComponent {
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

		return new GUIComponent(fieldTypeSelect, plane)
	}

	createGridSizeInput(
		defaultGridSize: number = 0,
		onChangeGridSize: Function
	): GUIComponent {
		const input = new GUI.InputText('grid-size', String(defaultGridSize))
		input.height = '80px'
		input.width = '360px'
		input.fontSize = 50
		input.color = 'black'
		input.background = 'white'
		input.focusedBackground = ACCENT_COLOR

		// Enabling only digits
		input.onBeforeKeyAddObservable.add((input) => {
			let key = input.currentKey

			input.addKey = key >= '0' && key <= '9'

			// TODO: add validation
		})

		// Reactivity
		input.onTextChangedObservable.add((input) =>
			onChangeGridSize(parseInt(input.text))
		)

		const plane = BABYLON.MeshBuilder.CreatePlane('grid-size-plane', {
			size: 1,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = 0.1
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(input)

		return new GUIComponent(input, plane)
	}

	createStartButton(onSumbit: Function): GUIComponent {
		const button = GUI.Button.CreateSimpleButton('start-button', 'Start')
		button.height = '80px'
		button.width = '360px'
		button.fontSize = 36
		button.background = ACCENT_COLOR

		button.onPointerUpObservable.add(() => {
			this.delete()

			onSumbit()
		})

		const plane = BABYLON.MeshBuilder.CreatePlane('start-button-plane', {
			size: 1,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = -0.1
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(button)

		return new GUIComponent(button, plane)
	}

	delete() {
		this.fieldTypeSelect.delete()
		this.gridSizeInput.delete()
		this.startButton.delete()
	}
}
