import * as GUI from 'babylonjs-gui'

import { ACCENT_COLOR } from '../constants'

// https://github.com/BabylonJS/Babylon.js/issues/3910
export default class SelectComponent {
	readonly container: GUI.Container
	readonly options: GUI.StackPanel
	readonly button: GUI.Button
	public selected?
	public selectedValue?
	protected onSelect?: Function

	constructor(
		protected height: string,
		protected width: string,
		defaultValue: any,
		readonly color: string = 'black',
		readonly fontSize: number = 32,
		readonly background: string = 'white',
		readonly accentColor: string = ACCENT_COLOR
	) {
		// Container
		this.container = new GUI.Container()
		this.container.width = this.width
		this.container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
		this.container.isHitTestVisible = false

		// Primary button
		this.button = GUI.Button.CreateSimpleButton(
			null,
			defaultValue || 'Please Select'
		)
		this.button.height = this.height
		this.button.background = this.background
		this.button.color = this.color
		this.button.fontSize = fontSize
		this.button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP

		// Options panel
		this.options = new GUI.StackPanel()
		this.options.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
		this.options.top = this.height
		this.options.isVisible = false
		this.options.isVertical = true

		this.button.onPointerUpObservable.add(() => {
			this.options.isVisible = !this.options.isVisible
		})

		// add controls
		this.container.addControl(this.button)
		this.container.addControl(this.options)

		// Selection
		this.selected = null
		this.selectedValue = null
	}

	addOption(value, text, color?, background?) {
		const button = GUI.Button.CreateSimpleButton(text, text)

		button.height = this.height
		button.paddingTop = '-1px'
		button.background = background || this.accentColor
		button.color = color || this.color
		button.fontSize = this.fontSize

		button.onPointerUpObservable.add(() => {
			this.options.isVisible = false
			this.button.children[0].text = text
			this.selected = button
			this.selectedValue = value

			if (this.onSelect !== undefined) this.onSelect(this.selectedValue)
		})

		this.options.addControl(button)
	}

	onSelectRegister(func: Function) {
		this.onSelect = func
	}

	/////////////////////////////////////////
	////  Descriptors
	/////////////////////////////////////////

	get top() {
		return this.container.top
	}
	set top(value) {
		this.container.top = value
	}

	get left() {
		return this.container.left
	}
	set left(value) {
		this.container.left = value
	}

	get shadowOffsetX() {
		return this.container.shadowOffsetX
	}
	set shadowOffsetX(value) {
		this.container.shadowOffsetX = value
	}

	get shadowOffsetY() {
		return this.container.shadowOffsetY
	}
	set shadowOffsetY(value) {
		this.container.shadowOffsetY = value
	}
}
