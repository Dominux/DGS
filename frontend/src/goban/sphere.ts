import { GridMaterial } from '@babylonjs/materials'
import * as BABYLON from '@babylonjs/core'

export default class Playground {
	public static createScene(canvas: HTMLCanvasElement): BABYLON.Scene {
		const engine = new BABYLON.Engine(canvas, true)

		// This creates a basic Babylon Scene object (non-mesh)
		const scene = new BABYLON.Scene(engine)
		scene.clearColor = new BABYLON.Color4(0.93, 0.93, 0.87, 1)

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new BABYLON.HemisphericLight(
			'light1',
			new BABYLON.Vector3(1, 1, 0),
			scene
		)

		// Our built-in 'sphere' shape. Params: name, options, scene
		const sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: 2, segments: 32 },
			scene
		)

		// Creating material
		// Our built-in 'sphere' shape. Params: name, options, scene
		const gridSize = 12
		const material = new GridMaterial('goban', scene)

		material.mainColor = BABYLON.Color3.FromHexString('#FFFFFF')
		material.lineColor = BABYLON.Color3.FromHexString('#000000')
		material.gridRatio = 1 / gridSize
		material.majorUnitFrequency = Math.round(gridSize / 3)
		material.useMaxLine = true

		sphere.material = material

		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			3,
			new BABYLON.Vector3(0, 0, 0),
			scene
		)

		// This attaches the camera to the canvas
		camera.attachControl(canvas, true)

		engine.runRenderLoop(() => {
			scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})

		return scene
	}
}
