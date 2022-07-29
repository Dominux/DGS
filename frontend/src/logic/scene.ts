import * as BABYLON from '@babylonjs/core'

import { HDR } from '../constants'

export default class Scene {
	readonly _scene: BABYLON.Scene

	constructor(canvas: HTMLCanvasElement) {
		const engine = new BABYLON.Engine(canvas, true)

		this._scene = new BABYLON.Scene(engine)

		// Loading environment
		this._scene.environmentTexture = new BABYLON.CubeTexture(
			'src/assets/environment.env',
			this._scene
		)

		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			3,
			new BABYLON.Vector3(0, 0, 0),
			this._scene
		)

		// This attaches the camera to the canvas
		camera.attachControl(canvas, true)

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new BABYLON.HemisphericLight(
			'light1',
			new BABYLON.Vector3(1, 1, 0),
			this._scene
		)

		engine.runRenderLoop(() => {
			this._scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})
	}
}
