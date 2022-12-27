import FieldType from '../logic/fields/enum'
import GameCreationFormGUI from './game_creation_form'
import PlayerBarGUI from './player_bar'

export default class GameGUI {
	protected gameCreationForm: GameCreationFormGUI
	protected playerBar: PlayerBarGUI

	constructor(
		readonly camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number,
		onSubmit: Function
	) {
		this.gameCreationForm = new GameCreationFormGUI(
			camera,
			onChangeFieldType,
			onChangeGridSize,
			defaultFieldType,
			defaultGridSize,
			onSubmit
		)
		this.playerBar = new PlayerBarGUI(this.camera)
	}

	onStart() {
		this.playerBar.initialize()
	}

	setBlackScore(value: number) {
		this.playerBar.setBlackScore(value)
	}

	setWhiteScore(value: number) {
		this.playerBar.setWhiteScore(value)
	}
}
