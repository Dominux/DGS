import * as GUI from 'babylonjs-gui'

import FieldType from '../logic/fields/enum'
import AlertComponent from './alert'
import GameCreationFormGUI from './game_creation_form'
import GUIComponent from './gui_components'
import PlayerBarGUI from './player_bar'

export default class GameGUI {
	protected gameCreationForm: GameCreationFormGUI
	protected playerBar: PlayerBarGUI
	protected globalTexture: GUI.AdvancedDynamicTexture
	protected virtualKeyboard: GUIComponent<GUI.VirtualKeyboard>

	protected alert: AlertComponent

	set isUndoButtonHidden(newVal: boolean) {
		this.playerBar.isUndoButtonHidden = newVal
	}

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number,
		onSubmit: Function,
		onUndo: Function
	) {
		this.globalTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('gui')

		this.virtualKeyboard = this.createVirtualKeyBoard()

		this.gameCreationForm = new GameCreationFormGUI(
			camera,
			onChangeFieldType,
			onChangeGridSize,
			defaultFieldType,
			defaultGridSize,
			onSubmit
		)
		this.gameCreationForm.connectVirtualKeyboard(this.virtualKeyboard.component)

		this.playerBar = new PlayerBarGUI(this.camera, onUndo)

		this.alert = new AlertComponent(this.globalTexture)
	}

	createVirtualKeyBoard(): GUIComponent<GUI.VirtualKeyboard> {
		const keyboard = GUI.VirtualKeyboard.CreateDefaultLayout()
		keyboard.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP

		const plane = BABYLON.MeshBuilder.CreatePlane('start-button-plane')
		// plane.parent = this.camera
		plane.position.z = -0.12
		plane.position.y = 0.4
		plane.position.x = 0.8

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(keyboard)

		return new GUIComponent(keyboard, plane)
	}

	onStart() {
		this.playerBar.initialize()
	}

	onError(errorMsg: string) {
		this.alert.errorMsg = errorMsg
	}

	setBlackScore(value: number) {
		this.playerBar.setBlackScore(value)
	}

	setWhiteScore(value: number) {
		this.playerBar.setWhiteScore(value)
	}
}
