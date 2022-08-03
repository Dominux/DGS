import * as BABYLON from 'babylonjs'

import { ENV_TEXTURE } from '../constants'

export default class Scene {
	readonly _scene: BABYLON.Scene

	constructor(canvas: HTMLCanvasElement, sphereRadius: number) {
		const engine = new BABYLON.Engine(canvas, true)

		this._scene = new BABYLON.Scene(engine)

		// Loading environment
		this.loadEnv()

		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			sphereRadius * 6,
			new BABYLON.Vector3(0, 0, 0),
			this._scene
		)
		camera.attachControl(canvas, true)
		camera.lowerRadiusLimit = sphereRadius * 2
		camera.upperRadiusLimit = sphereRadius * 10
		camera.wheelPrecision = 50

		engine.runRenderLoop(() => {
			this._scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})
	}

	protected loadEnv() {
		setTimeout(() => {
			const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
				ENV_TEXTURE,
				this._scene
			)
			envTexture.name = 'envTexture'
			envTexture.gammaSpace = false

			this._scene.environmentTexture = envTexture

			const hdrSkybox = BABYLON.Mesh.CreateBox('hdrSkyBox', 1000.0, this._scene)
			const hdrSkyboxMaterial = new BABYLON.PBRMaterial('skyBox', this._scene)
			hdrSkyboxMaterial.backFaceCulling = false
			hdrSkyboxMaterial.reflectionTexture = envTexture.clone()
			hdrSkyboxMaterial.reflectionTexture.coordinatesMode =
				BABYLON.Texture.SKYBOX_MODE
			hdrSkyboxMaterial.microSurface = 1.0
			hdrSkyboxMaterial.cameraExposure = 0.8
			hdrSkyboxMaterial.cameraContrast = 1.5
			hdrSkyboxMaterial.disableLighting = true
			hdrSkybox.material = hdrSkyboxMaterial
			hdrSkybox.infiniteDistance = true
		}, 0)
	}
}
