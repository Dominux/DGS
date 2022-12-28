import * as GUI from 'babylonjs-gui'

export default class TextComponent {
	readonly container: GUI.Container
	private textBlock: GUI.TextBlock

	constructor(
		protected height: string,
		protected width: string,
		readonly color: string,
		readonly background: string,
		fontSize: number = 32
	) {
		// Container
		this.container = new GUI.Container()
		this.container.width = this.width
		this.container.height = this.height
		this.container.isHitTestVisible = false
		this.container.background = this.background

		// Text
		this.textBlock = new GUI.TextBlock()
		this.textBlock.fontSize = fontSize
		this.textBlock.color = this.color

		// add controls
		this.container.addControl(this.textBlock)
	}

	get text() {
		return this.textBlock.text
	}
	set text(value: string) {
		this.textBlock.text = value
	}
}
