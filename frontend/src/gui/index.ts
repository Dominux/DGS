import * as GUI from 'babylonjs-gui'

import GameCreationFormGUI from './game_creation_form'

export default class GameGUI {
	private gameCreationForm: GameCreationFormGUI

	constructor(
		camera: BABYLON.Camera,
		onChangeFieldType: Function,
		onChangeGridSize: Function
	) {
		this.gameCreationForm = new GameCreationFormGUI(
			camera,
			onChangeFieldType,
			onChangeGridSize
		)
	}
}
