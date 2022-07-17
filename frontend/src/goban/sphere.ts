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
		const gridSize = 7
		const height = 1000
		const gridInc = height / gridSize
		const textureGrid = new BABYLON.DynamicTexture(
			'grid texture',
			height,
			scene,
			false
		)

		const textureContext = textureGrid.getContext()
		textureContext.fillStyle = 'white'
		textureContext.fillRect(0, 0, height, height)
		textureGrid.update()

		textureContext.lineWidth = 10 / gridSize
		textureContext.strokeStyle = 'black'
		textureContext.fillStyle = 'black'

		const k = gridSize * 2
		const lines = [...Array(k + 1).keys()]
			.filter((n) => n % 2 == 1)
			.map((n) => n / (k * 2) + 0.25)
		console.log(lines)

		for (const line of lines) {
			const scaledLine = line * height

			textureContext.moveTo(0, scaledLine)
			textureContext.lineTo(height, scaledLine)
			textureContext.stroke()
		}

		// for (let x = 0; x < 1; x += gridInc) {
		// 	// Normalization
		// 	const y = x / 2 + normalization_k

		// 	console.log(y)

		// 	// textureContext.beginPath()
		// 	// textureContext.moveTo(y, 0)
		// 	// textureContext.lineTo(y, height)
		// 	textureContext.stroke()
		// 	textureContext.moveTo(0, y)
		// 	textureContext.lineTo(height, y)
		// 	textureContext.stroke()
		// }
		textureGrid.update()

		const mat = new BABYLON.StandardMaterial('Mat', scene)
		mat.diffuseTexture = textureGrid
		sphere.material = mat

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
