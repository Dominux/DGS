import * as GUI from 'babylonjs-gui'

export default class AlertComponent {
	readonly container: GUI.Container
	private textBlock: GUI.TextBlock

	constructor(text: string, advancedTexture: GUI.AdvancedDynamicTexture) {
		// Container
		this.container = new GUI.Container()
		this.container.width = '300px'
		this.container.height = '80px'
		this.container.background = 'red'
		this.container.top = '10px'

		// Text
		this.textBlock = new GUI.TextBlock('alert', text)
		this.textBlock.color = 'white'

		// add controls
		this.container.addControl(this.textBlock)
		advancedTexture.addControl(this.container)
	}
}
