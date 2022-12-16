import * as GUI from 'babylonjs-gui'

import GameCreationFormGUI from './game_creation_form'

export default class GameGUI {
	readonly gui: GUI.AdvancedDynamicTexture

	private gameCreationForm: GameCreationFormGUI

	constructor() {
		this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('gui')
		this.gameCreationForm = new GameCreationFormGUI(this.gui)
	}
}
