import FieldType from '../logic/fields/enum'
import GameCreationFormGUI from './game_creation_form'

export default class GameGUI {
	protected gameCreationForm: GameCreationFormGUI

	constructor(
		camera: BABYLON.Camera,
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
	}
}
