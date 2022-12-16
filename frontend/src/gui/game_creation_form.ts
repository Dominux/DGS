import * as GUI from 'babylonjs-gui'

export default class GameCreationFormGUI {
	protected formBlock: GUI.Container

	constructor(readonly advancedTexture: GUI.AdvancedDynamicTexture) {
		this.formBlock = this.createFormBlock()
	}

	createFormBlock() {
		const formBlock = new GUI.Container('game creation form')
		formBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
		formBlock.width = '20%'
		formBlock.height = '100%'
		formBlock.background = 'white'

		this.advancedTexture.addControl(formBlock)

		return formBlock
	}

	createFieldTypeSelect() {
		// const fieldTypeSelect = new GUI.Se()
	}

	createGridSizeInput() {}
}
