import GUIComponent from './gui_components'
import ScoreComponent from './score'

export default class PlayerBarGUI {
	protected blackScore: GUIComponent
	protected whiteScore: GUIComponent

	constructor(readonly camera: BABYLON.Camera) {
		this.blackScore = this.createScoreComponent('black', 0.5)
		this.whiteScore = this.createScoreComponent('white', 0.4)
	}

	createScoreComponent(color: string, y: number): GUIComponent {
		const scoreBlock = new ScoreComponent('80px', '360px', color === 'black')

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
