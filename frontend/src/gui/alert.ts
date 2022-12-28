import * as GUI from 'babylonjs-gui'

import { ALERT_COLOR, ERROR_MSG_TIMEOUT } from '../constants'

export default class AlertComponent {
	readonly container: GUI.Container
	private textBlock: GUI.TextBlock

	constructor(advancedTexture: GUI.AdvancedDynamicTexture) {
		// Container
		this.container = new GUI.Container()
		this.container.width = '300px'
		this.container.height = '80px'
		this.container.background = ALERT_COLOR
		this.container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
		this.container.top = 10
		this.container.isVisible = false

		// Text
		this.textBlock = new GUI.TextBlock('alert', '')
		this.textBlock.color = 'white'

		// add controls
		this.container.addControl(this.textBlock)
		advancedTexture.addControl(this.container)
	}

	set errorMsg(newVal: string) {
		this.textBlock.text = newVal
		this.container.isVisible = true

		setTimeout(
			() => (this.container.isVisible = false),
			ERROR_MSG_TIMEOUT * 1000
		)
	}
}
