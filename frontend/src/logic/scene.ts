import * as BABYLON from 'babylonjs'

import { ENV_TEXTURE } from '../constants'

export default class Scene {
	readonly _scene: BABYLON.Scene
	readonly _ground: BABYLON.GroundMesh
	protected _XRHelper: BABYLON.WebXRDefaultExperience | undefined

	constructor(canvas: HTMLCanvasElement, sphereRadius: number) {
		const engine = new BABYLON.Engine(canvas, true)

		this._scene = new BABYLON.Scene(engine)

		// Creating ground
		this._ground = BABYLON.MeshBuilder.CreateGround('ground', {
			height: 30,
			width: 30,
		})
		// const groundMaterial = new BABYLON.PBRMaterial('ground_material')
		// groundMaterial.roughness = 0.4
		// groundMaterial.metallic = 0.4
		// this._ground.material = groundMaterial
		this._ground.setEnabled(false)

		// Loading environment
		this.loadEnv()

		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			sphereRadius * 4,
			new BABYLON.Vector3(0, 0, 0),
			this._scene
		)
		camera.attachControl(canvas, true)
		camera.lowerRadiusLimit = sphereRadius * 3.1
		camera.upperRadiusLimit = sphereRadius * 10
		camera.wheelPrecision = 100

		// Loading VR
		this.loadVR()

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

	protected async loadVR() {
		this._XRHelper = await this._scene.createDefaultXRExperienceAsync({
			floorMeshes: [this._ground],
		})
	}
}
