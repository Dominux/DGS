import * as BABYLON from 'babylonjs'
import {
	defaultEnvTextures,
	defaultResolution,
	defaultTextureName,
	EnvTexture,
} from '../constants'

export default class Scene {
	readonly _scene: BABYLON.Scene
	readonly _camera: BABYLON.ArcRotateCamera
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
		this._ground.setEnabled(false)

		// Loading environment
		this.setEnv(defaultEnvTextures[defaultTextureName][defaultResolution])

		this._camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			sphereRadius * 4,
			new BABYLON.Vector3(0, 1, 0),
			this._scene
		)
		this._camera.attachControl(canvas, true)
		this._camera.lowerRadiusLimit = sphereRadius * 3.1
		this._camera.upperRadiusLimit = sphereRadius * 10
		this._camera.wheelPrecision = 100

		// Loading VR
		this.loadVR()

		engine.runRenderLoop(() => {
			this._scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})
	}

	public setEnv(envTexture: EnvTexture) {
		setTimeout(() => {
			const hdrTexture = new BABYLON.HDRCubeTexture(
				envTexture.url,
				this._scene,
				envTexture.res
			)

			this._scene.createDefaultSkybox(hdrTexture)
		}, 0)
	}

	protected async loadVR() {
		this._XRHelper = await this._scene.createDefaultXRExperienceAsync({
			floorMeshes: [this._ground],
		})
	}
}
