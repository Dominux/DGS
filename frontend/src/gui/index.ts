import * as GUI from 'babylonjs-gui'

import FieldType from '../logic/fields/enum'
import AlertComponent from './alert'
import GameCreationFormGUI from './game_creation_form'
import PlayerBarGUI from './player_bar'

export default class GameGUI {
	protected gameCreationForm: GameCreationFormGUI
	protected playerBar: PlayerBarGUI
	protected globalTexture: GUI.AdvancedDynamicTexture

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

		this.gameCreationForm = new GameCreationFormGUI(
			camera,
			onChangeFieldType,
			onChangeGridSize,
			defaultFieldType,
			defaultGridSize,
			onSubmit
		)
		this.playerBar = new PlayerBarGUI(this.camera, onUndo)

		this.alert = new AlertComponent(this.globalTexture)
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
