import * as GUI from 'babylonjs-gui'
import FieldType from '../logic/fields/enum'

import GameCreationFormGUI from './game_creation_form'

export default class GameGUI {
	private gameCreationForm: GameCreationFormGUI

	constructor(
		camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function,
		defaultFieldType: FieldType,
		defaultGridSize: number
	) {
		this.gameCreationForm = new GameCreationFormGUI(
			camera,
			onChangeFieldType,
			onChangeGridSize,
			defaultFieldType,
			defaultGridSize
		)
	}
}
