import GUIComponent from './gui_components'
import TextComponent from './text'

export default class PlayerBarGUI {
	protected blackScore: GUIComponent<TextComponent>
	protected whiteScore: GUIComponent<TextComponent>

	constructor(readonly camera: BABYLON.Camera) {
		this.blackScore = this.createScoreComponent('black', 0.5)
		this.whiteScore = this.createScoreComponent('white', 0.4)
	}

	createScoreComponent(color: string, y: number): GUIComponent<TextComponent> {
		const background = color
		color = color === 'black' ? 'white' : 'black'
		const scoreBlock = new TextComponent('80px', '360px', color, background)

		const plane = BABYLON.MeshBuilder.CreatePlane(null)
		plane.position.y = y
		plane.position.x = 0.8
		plane.isVisible = false

		return new GUIComponent(scoreBlock, plane)
	}

	initialize() {
		this.blackScore.initialize()
		this.whiteScore.initialize()
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
	}
}
