import * as BABYLON from '@babylonjs/core'

import { HDR } from '../constants'

export default class Scene {
	readonly _scene: BABYLON.Scene

	constructor(canvas: HTMLCanvasElement) {
		const engine = new BABYLON.Engine(canvas, true)

		this._scene = new BABYLON.Scene(engine)

		// Loading environment
		this.loadEnv()

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

	protected loadEnv() {
		setTimeout(() => {
			const hdrTexture = new BABYLON.HDRCubeTexture(HDR, this._scene, 512)

			// Skybox
			const hdrSkybox = BABYLON.Mesh.CreateBox('hdrSkyBox', 1000.0, this._scene)
			const hdrSkyboxMaterial = new BABYLON.PBRMaterial('skyBox', this._scene)
			hdrSkyboxMaterial.backFaceCulling = false
			hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone()
			hdrSkyboxMaterial.reflectionTexture.coordinatesMode =
				BABYLON.Texture.SKYBOX_MODE
			hdrSkyboxMaterial.microSurface = 1.0
			hdrSkyboxMaterial.cameraExposure = 0.66
			hdrSkyboxMaterial.cameraContrast = 1.66
			hdrSkyboxMaterial.disableLighting = true
			hdrSkybox.material = hdrSkyboxMaterial
			hdrSkybox.infiniteDistance = true
		}, 0)
	}
}
