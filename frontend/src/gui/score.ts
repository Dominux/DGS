import * as GUI from 'babylonjs-gui'

export default class ScoreComponent {
	readonly container: GUI.Container
	private textBlock: GUI.TextBlock

	constructor(
		protected height: string,
		protected width: string,
		readonly isBlack: boolean,
		readonly fontSize: number = 32
	) {
		// Container
		this.container = new GUI.Container()
		this.container.width = this.width
		this.container.height = this.height
		this.container.isHitTestVisible = false
		this.container.background = this.background

		// Text
		this.textBlock = new GUI.TextBlock()
		this.textBlock.fontSize = 42
		this.textBlock.color = this.color

		// add controls
		this.container.addControl(this.textBlock)
	}

	private get color() {
		return this.isBlack ? 'white' : 'black'
	}

	private get background() {
		return this.isBlack ? 'black' : 'white'
	}

	get text() {
		return this.textBlock.text
	}
	set text(value: string) {
		this.textBlock.text = value
	}
}
