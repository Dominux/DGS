import * as GUI from 'babylonjs-gui'

import GUIComponent from './gui_components'
import TextComponent from './text'

export default class PlayerBarGUI {
	protected stack: GUIComponent<GUI.StackPanel>
	protected blackScore: GUIComponent<TextComponent>
	protected whiteScore: GUIComponent<TextComponent>
	protected undoButton: GUIComponent<GUI.Button>

	set isUndoButtonHidden(newVal: boolean) {
		this.undoButton.component.isVisible = !newVal
	}

	constructor(readonly camera: BABYLON.Camera, onUndo: Function) {
		this.stack = this.createStackPanel()
		this.blackScore = this.createScoreComponent('black')
		this.whiteScore = this.createScoreComponent('white')
		this.undoButton = this.createUndoButton(onUndo)
	}

	createStackPanel() {
		const stack = new GUI.StackPanel('player-bar')
		stack.spacing = 10
		stack.isHitTestVisible = false

		const plane = BABYLON.MeshBuilder.CreatePlane('stack-plane', {
			size: 0.5,
		})
		// plane.parent = this.camera
		plane.position.z = -0.1
		plane.position.y = 1.3
		plane.position.x = 0.8
		plane.isVisible = false

		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane)
		advancedTexture.addControl(stack)

		return new GUIComponent(stack, plane)
	}

	createScoreComponent(color: string): GUIComponent<TextComponent> {
		const background = color
		color = color === 'black' ? 'white' : 'black'
		const scoreBlock = new TextComponent(
			'200px',
			'760px',
			color,
			background,
			120
		)
		scoreBlock.container.isVisible = false

		this.stack.component.addControl(scoreBlock.container)

		return new GUIComponent(scoreBlock, this.stack.advancedTextureMesh)
	}

	createUndoButton(onUndo: Function): GUIComponent<GUI.Button> {
		const button = GUI.Button.CreateSimpleButton('undo-button', 'Undo move')
		button.background = 'white'
		button.height = '160px'
		button.width = '450px'
		button.fontSize = 60
		button.isVisible = false

		button.onPointerClickObservable.add(() => {
			onUndo()
		})

		this.stack.component.addControl(button)

		return new GUIComponent(button, this.stack.advancedTextureMesh)
	}

	initialize() {
		this.stack.advancedTextureMesh.isVisible = true
		this.blackScore.component.container.isVisible = true
		this.whiteScore.component.container.isVisible = true
		this.undoButton.component.isVisible = true
		this.isUndoButtonHidden = true
	}

	setBlackScore(value: number) {
		this.blackScore.component.text = String(value)
	}

	setWhiteScore(value: number) {
		this.whiteScore.component.text = String(value)
	}
}
