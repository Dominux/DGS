import BABYLON from 'babylonjs'

export default class Playground {
	public static createScene(canvas: HTMLCanvasElement): BABYLON.Scene {
		const engine = new BABYLON.Engine(canvas, true)

		// This creates a basic Babylon Scene object (non-mesh)
		const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.93, 0.93, 0.87, 1)

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new BABYLON.HemisphericLight(
			'light1',
			new BABYLON.Vector3(0, 1, 0),
			scene
		)

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7

		// Our built-in 'sphere' shape. Params: name, options, scene
		const sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: 2, segments: 32 },
			scene
		)

    const cube = BABYLON.MeshBuilder.CreateBox("ur mom", {}, scene)
    console.log(cube)

		// Move the sphere upward 1/2 its height
		sphere.position.y = 1

    console.log(sphere)

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI/2,
      Math.PI/2,
      5,
      new BABYLON.Vector3(0, 1, 0),
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
