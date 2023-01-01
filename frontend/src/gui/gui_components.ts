import * as GUI from 'babylonjs-gui'

export default class GUIComponent<Type> {
	constructor(
		readonly component: Type,
		readonly advancedTextureMesh: BABYLON.Mesh
	) {}

	initialize() {
		this.advancedTextureMesh.isVisible = true
		const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(
			this.advancedTextureMesh
		)
		advancedTexture.addControl(
			this.component.container ? this.component.container : this.component
		)
	}
}
