import * as GUI from 'babylonjs-gui'

import {
	ACCENT_COLOR,
	ALERT_COLOR,
	MAX_GRIDSIZE,
	MIN_GRIDSIZE,
} from '../constants'
import FieldType from '../logic/fields/enum'
import GUIComponent from './gui_components'
import SelectComponent from './select_menu'
import TextComponent from './text'

const ODD_RANGE_STR = [MIN_GRIDSIZE, MIN_GRIDSIZE + 2, MIN_GRIDSIZE + 4].join(
	','
)

export default class GameCreationFormGUI {
	protected fieldTypeSelect: GUIComponent<SelectComponent>
	protected gridSizeInput: GUIComponent<GUI.InputText>
	protected gridSizeHint: GUIComponent<TextComponent>
	protected startButton: GUIComponent<GUI.Button>

	protected _isValid: boolean = true

	protected get isValid() {
		return this._isValid
	}
	protected set isValid(newVal: boolean) {
		this._isValid = newVal

		// Enabling/disabling start button
		this.startButton.component.isEnabled = this._isValid
	}

	protected get fieldType(): FieldType {
		return this.fieldTypeSelect.component.selectedValue
	}
	protected get gridSize(): number {
		return parseInt(this.gridSizeInput.component.text) || 0
	}

	protected set errorMessage(newVal: string) {
		if (newVal) {
			this.gridSizeHint.component.text = newVal
			this.gridSizeHint.advancedTextureMesh.isVisible = true
		} else {
			this.gridSizeHint.advancedTextureMesh.isVisible = false
		}
	}

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number,
		onSumbit: Function
	) {
		const innerOnChangeFieldType = (selectedValue: FieldType) => {
			this.validateGridSize(this.gridSize)
			onChangeFieldType(selectedValue)
		}

		this.fieldTypeSelect = this.createFieldTypeSelect(defaultFieldType)
		this.fieldTypeSelect.component.onSelectRegister(innerOnChangeFieldType)

		this.gridSizeInput = this.createGridSizeInput(
			defaultGridSize,
			onChangeGridSize
		)
		this.gridSizeHint = this.createGridSizeHint()

		this.startButton = this.createStartButton(onSumbit)

		this.validateGridSize(parseInt(this.gridSizeInput.component.text))
	}

	createFieldTypeSelect(
		defaultFieldType?: FieldType
	): GUIComponent<SelectComponent> {
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
		plane.position.y = 0.9
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(fieldTypeSelect.container)

		return new GUIComponent(fieldTypeSelect, plane)
	}

	createGridSizeInput(
		defaultGridSize: number = 0,
		onChangeGridSize: Function
	): GUIComponent<GUI.InputText> {
		const input = new GUI.InputText('grid-size', String(defaultGridSize))
		input.height = '80px'
		input.width = '360px'
		input.fontSize = 50
		input.color = 'black'
		input.background = 'white'
		input.focusedBackground = ACCENT_COLOR
		input.disableMobilePrompt = true

		// Enabling only digits
		input.onBeforeKeyAddObservable.add((input) => {
			let key = input.currentKey

			input.addKey = key >= '0' && key <= '9'
		})

		// Reactivity
		input.onTextChangedObservable.add((input) => {
			const value = parseInt(input.text) || 0
			onChangeGridSize(value)
			this.validateGridSize(value)
		})

		const plane = BABYLON.MeshBuilder.CreatePlane('grid-size-plane', {
			size: 1,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = 1.1
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(input)

		return new GUIComponent(input, plane)
	}

	createGridSizeHint() {
		// Container
		const text = new TextComponent('50px', '500px', 'white', ALERT_COLOR, 34)

		const plane = BABYLON.MeshBuilder.CreatePlane('grid-size-plane', {
			size: 1,
		})
		// plane.parent = this.camera
		plane.position.z = 0.2
		plane.position.y = 1.035
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(text.container)

		return new GUIComponent(text, plane)
	}

	validateGridSize(value: number): boolean {
		if (value < MIN_GRIDSIZE) {
			this.errorMessage = `Number must be >= ${MIN_GRIDSIZE}`
			this.isValid = false
			return false
		}
		if (value > MAX_GRIDSIZE) {
			this.errorMessage = `Number must be <= ${MAX_GRIDSIZE}`
			this.isValid = false
			return false
		}
		if (this.fieldType === FieldType.GridSphere && value % 2 == 0) {
			this.errorMessage = `Number must be odd (${ODD_RANGE_STR}, ...)`
			this.isValid = false
			return false
		}

		this.errorMessage = ''
		this.isValid = true
		return true
	}

	connectVirtualKeyboard(keyboard: GUI.VirtualKeyboard) {
		keyboard.connect(this.gridSizeInput.component)
	}

	createStartButton(onSumbit: Function): GUIComponent<GUI.Button> {
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
		plane.position.y = 0.9
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
