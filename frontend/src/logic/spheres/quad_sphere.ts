import * as BABYLON from '@babylonjs/core'

export default class QuadSpherePlayground {
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

		const createPolySphere = (name, options) => {
			const boxSize = options.boxSize || 1
			const gridSize = options.gridSize || 2
			const faceColors = options.faceColors || []

			const boxNormals = [
				BABYLON.Axis.X,
				BABYLON.Axis.X.scale(-1),
				BABYLON.Axis.Y,
				BABYLON.Axis.Y.scale(-1),
				BABYLON.Axis.Z,
				BABYLON.Axis.Z.scale(-1),
			]

			const nomX = [
				BABYLON.Axis.Z,
				BABYLON.Axis.Z.scale(-1),
				BABYLON.Axis.X,
				BABYLON.Axis.X,
				BABYLON.Axis.X.scale(-1),
				BABYLON.Axis.X,
			]

			const nomY = [
				BABYLON.Axis.Y,
				BABYLON.Axis.Y,
				BABYLON.Axis.Z,
				BABYLON.Axis.Z.scale(-1),
				BABYLON.Axis.Y,
				BABYLON.Axis.Y,
			]

			if (faceColors.length < 6) {
				for (let i = 0; i < 6; i++) {
					if (faceColors[i] === undefined) {
						faceColors[i] = new BABYLON.Color4(1, 1, 1, 1)
					}
				}
			}

			const boxPositions = []
			const colors = []
			const uvs = []
			const indices = []

			let colStart = BABYLON.Vector3.Zero()
			let rowStart = BABYLON.Vector3.Zero()
			let indexStart = 0
			//let uStart = 0;
			//const vStart = 0;
			const inc = boxSize / gridSize
			let colInc = BABYLON.Vector3.Zero()
			let rowInc = BABYLON.Vector3.Zero()
			const uvInc = 1 / gridSize
			//const vInc = 1 / gridSize;
			const gridInc = gridSize + 1
			const indexInc = gridInc * gridInc

			for (let face = 0; face < 6; face++) {
				colStart = nomX[face].scale(-0.5 * boxSize)
				rowStart = nomY[face].scale(-0.5 * boxSize)
				colInc = nomX[face].scale(inc)
				rowInc = nomY[face].scale(inc)
				const planePosition = boxNormals[face]

				for (let row = 0; row < gridSize + 1; row++) {
					for (let col = 0; col < gridSize + 1; col++) {
						boxPositions.push(
							colStart
								.add(colInc.scale(col))
								.add(rowStart.add(rowInc.scale(row)))
								.add(planePosition)
						)
						colors.push(
							faceColors[face].r,
							faceColors[face].g,
							faceColors[face].b,
							faceColors[face].a
						)
						uvs.push(uvInc * col, uvInc * row)
					}
				}
				for (let ridx = 0; ridx < gridSize; ridx++) {
					for (let cidx = 0; cidx < gridSize; cidx++) {
						indices.push(
							ridx * gridInc + indexStart + cidx,
							ridx * gridInc + indexStart + cidx + 1,
							ridx * gridInc + indexStart + cidx + gridInc
						)
						indices.push(
							ridx * gridInc + indexStart + cidx + 1,
							ridx * gridInc + indexStart + cidx + 1 + gridInc,
							ridx * gridInc + indexStart + cidx + gridInc
						)
					}
				}
				indexStart += indexInc
			}

			const sphereRadius = Math.sqrt(3) * 0.5 * boxSize

			const vecPositions = boxPositions.map((el) => {
				return el.normalize().scale(sphereRadius)
			})

			const vecNormals = boxPositions.map((el) => {
				return el.normalize()
			})

			const quadCenters = []
			const quadAxes = []

			for (let idx = 0; idx < indices.length / 3; idx += 2) {
				const i0 = indices[3 * idx]
				const i1 = indices[3 * idx + 1]
				const i2 = indices[3 * idx + 2]
				const centerN = vecPositions[i1]
					.add(vecPositions[i2])
					.scale(0.5)
					.normalize()
				const centerP = centerN.scale(sphereRadius)
				quadCenters.push(centerP)
				quadAxes.push(
					vecPositions[i1].subtract(vecPositions[i0]).normalize(),
					centerN,
					vecPositions[i2].subtract(vecPositions[i0])
				)
			}

			/* Cylinder orientation and position test */
			/*        for (let i = 0; i < quadCenters.length; i++) {
            const cyl = BABYLON.MeshBuilder.CreateCylinder("cyl", {diameter: 0.1, height: 0.25});
            cyl.position = quadCenters[i];
            const orientation = BABYLON.Vector3.RotationFromAxis(quadAxes[3 * i], quadAxes[3 * i + 1], quadAxes[3 * i + 2]);
            cyl.rotation = orientation;
        }
*/
			const positions = []
			const normals = []

			for (let p = 0; p < vecPositions.length; p++) {
				positions.push(vecPositions[p].x, vecPositions[p].y, vecPositions[p].z)
				normals.push(vecNormals[p].x, vecNormals[p].y, vecNormals[p].z)
			}

			const customMesh = new BABYLON.Mesh('polySphere', scene)

			const vertexData = new BABYLON.VertexData()

			vertexData.positions = positions
			vertexData.indices = indices
			vertexData.normals = normals
			vertexData.colors = colors
			vertexData.uvs = uvs
			vertexData.applyToMesh(customMesh)

			customMesh.name = name
			customMesh.quadCenters = quadCenters
			customMesh.quadAxes = quadAxes

			return customMesh
		}

		const faceColors = []
		faceColors[0] = BABYLON.Color3.Blue()
		faceColors[1] = BABYLON.Color3.White()
		faceColors[2] = BABYLON.Color3.Red()
		faceColors[3] = BABYLON.Color3.Black()
		faceColors[4] = BABYLON.Color3.Green()
		faceColors[5] = BABYLON.Color3.Yellow()

		const boxSize = 2
		const gridSize = 6

		const poly = createPolySphere('poly', {
			boxSize: boxSize,
			gridSize: gridSize,
			faceColors: faceColors,
		})

		const height = 256
		const gridInc = height / gridSize
		const textureGrid = new BABYLON.DynamicTexture(
			'grid texture',
			height,
			scene
		)
		const textureContext = textureGrid.getContext()

		textureContext.fillStyle = 'white'
		textureContext.fillRect(0, 0, height, height)
		textureGrid.update()

		textureContext.strokeStyle = 'black'
		textureContext.fillStyle = 'black'

		for (let x = 0; x < height + 1; x += gridInc) {
			textureContext.beginPath()
			textureContext.moveTo(x, 0)
			textureContext.lineTo(x, height)
			textureContext.stroke()
			textureContext.moveTo(0, x)
			textureContext.lineTo(height, x)
			textureContext.stroke()
		}

		textureGrid.update()

		const mat = new BABYLON.StandardMaterial('Mat', scene)
		mat.diffuseTexture = textureGrid

		poly.material = mat

		const camera = new BABYLON.ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2,
			3,
			new BABYLON.Vector3(0, 0, 0),
			scene
		)

		camera.setPosition(new BABYLON.Vector3(0, 0, -8))

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
