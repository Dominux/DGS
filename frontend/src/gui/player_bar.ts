import * as GUI from 'babylonjs-gui'

import GUIComponent from './gui_components'
import TextComponent from './text'

export default class PlayerBarGUI {
	protected blackScore: GUIComponent<TextComponent>
	protected whiteScore: GUIComponent<TextComponent>
	protected undoButton: GUIComponent<GUI.Button>

	set isUndoButtonHidden(newVal: boolean) {
		this.undoButton.advancedTextureMesh.isVisible = !newVal
	}

	constructor(readonly camera: BABYLON.Camera, onUndo: Function) {
		this.blackScore = this.createScoreComponent('black', 0.5)
		this.whiteScore = this.createScoreComponent('white', 0.4)
		this.undoButton = this.createUndoButton(onUndo)
	}

	createScoreComponent(color: string, y: number): GUIComponent<TextComponent> {
		const background = color
		color = color === 'black' ? 'white' : 'black'
		const scoreBlock = new TextComponent('80px', '360px', color, background, 46)

		const plane = BABYLON.MeshBuilder.CreatePlane(null)
		plane.position.y = y
		plane.position.x = 0.8
		plane.isVisible = false

		return new GUIComponent(scoreBlock, plane)
	}

	createUndoButton(onUndo: Function): GUIComponent<GUI.Button> {
		const button = GUI.Button.CreateSimpleButton('undo-button', 'Undo move')
		button.background = 'white'
		button.height = '60px'
		button.width = '160px'
		button.fontSize = 24

		button.onPointerClickObservable.add(() => {
			onUndo()
		})

		const plane = BABYLON.MeshBuilder.CreatePlane(null)
		plane.position.y = 0.3
		plane.position.x = 0.8
		plane.isVisible = false

		return new GUIComponent(button, plane)
	}

	initialize() {
		this.blackScore.initialize()
		this.whiteScore.initialize()
		this.undoButton.initialize()
		this.isUndoButtonHidden = true
	}

	setBlackScore(value: number) {
		this.blackScore.component.text = String(value)
	}

	setWhiteScore(value: number) {
		this.whiteScore.component.text = String(value)
	}

	delete() {
		this.blackScore.delete()
		this.whiteScore.delete()
		this.undoButton.delete()
	}
}
