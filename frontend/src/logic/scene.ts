import * as BABYLON from 'babylonjs'

import { ENV_TEXTURE } from '../constants'

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
		camera.attachControl(canvas, true)

		const light1 = new BABYLON.HemisphericLight(
			'light1',
			new BABYLON.Vector3(1, 1, 0),
			this._scene
		)
		const light2 = new BABYLON.HemisphericLight(
			'light2',
			new BABYLON.Vector3(-1, 0, -1),
			this._scene
		)
		light1.intensity = 0.7
		light2.intensity = 0.7

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
			hdrSkyboxMaterial.cameraExposure = 0.66
			hdrSkyboxMaterial.cameraContrast = 1.66
			hdrSkyboxMaterial.disableLighting = true
			hdrSkybox.material = hdrSkyboxMaterial
			hdrSkybox.infiniteDistance = true

			// this._scene.environmentTexture.setReflectionTextureMatrix(
			// 	BABYLON.Matrix.RotationY(0)
			// )
			// const hdrTexture = new BABYLON.HDRCubeTexture(
			// 	'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/whipple_creek_regional_park_04_2k.hdr',
			// 	this._scene,
			// 	512
			// )

			// Skybox
			// const hdrSkybox = BABYLON.Mesh.CreateBox('hdrSkyBox', 1000.0, this._scene)
			// const hdrSkyboxMaterial = new BABYLON.PBRMaterial('skyBox', this._scene)
			// hdrSkyboxMaterial.backFaceCulling = false
			// hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone()
			// hdrSkyboxMaterial.reflectionTexture.coordinatesMode =
			// 	BABYLON.Texture.SKYBOX_MODE
			// hdrSkyboxMaterial.microSurface = 1.0
			// hdrSkyboxMaterial.cameraExposure = 0.66
			// hdrSkyboxMaterial.cameraContrast = 1.66
			// // hdrSkyboxMaterial.disableLighting = true
			// hdrSkybox.material = hdrSkyboxMaterial
			// hdrSkybox.infiniteDistance = true
		}, 0)
	}
}
