import * as BABYLON from '@babylonjs/core'

export default class GridSpherePlayground {
	public static createScene(canvas: HTMLCanvasElement): BABYLON.Scene {
		const engine = new BABYLON.Engine(canvas, true)

		const scene = new BABYLON.Scene(engine)

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

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new BABYLON.HemisphericLight(
			'light1',
			new BABYLON.Vector3(1, 1, 0),
			scene
		)

		// Our built-in 'sphere' shape. Params: name, options, scene
		const sphereRadius = 1
		const sphereRadiusSqrd = sphereRadius * sphereRadius
		const sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: sphereRadius * 2, segments: 32 },
			scene
		)

		BABYLON.NodeMaterial.ParseFromSnippetAsync(
			// 'gridMaterial',
			'YCMALW#7',
			scene
		).then((gridMaterial) => {
			const gridRatio = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'gridRatio'
			)
			const majorUnitFrequency = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'majorUnitFrequency'
			)
			const minorUnitVisibility = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'minorUnitVisibility'
			)
			const circleRadius = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleRadius'
			)
			const circleAmount = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleAmount'
			)
			const circlePosition = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circlePosition'
			)
			const circleSmoothness = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleSmoothness'
			)
			const bgColor = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'bgDiffuseColor'
			)
			const lineColor = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'lineColor'
			)

			bgColor.value = BABYLON.Color3.White()
			lineColor.value = BABYLON.Color3.Black()
			gridRatio.value = 0.1
			majorUnitFrequency.value = 1
			minorUnitVisibility.value = 0
			circleRadius.value = 0.03
			circleSmoothness.value = 0.005

			sphere.material = gridMaterial
			sphere.enablePointerMoveEvents = true

			scene.onPointerMove = (
				event: BABYLON.IPointerEvent,
				pickInfo: BABYLON.PickingInfo
			) => {
				if (pickInfo.pickedMesh !== sphere) {
					circleAmount.value = 0
					return
				}

				const pointerPosition = pickInfo.pickedPoint.subtract(sphere.position)
				const gridFactor =
					1 / gridRatio.value / Math.round(majorUnitFrequency.value)
				const jointPosition = pointerPosition.scale(gridFactor)
				jointPosition.x = Math.round(jointPosition.x)
				jointPosition.y = Math.round(jointPosition.y)
				jointPosition.z = Math.round(jointPosition.z)
				jointPosition.scaleInPlace(1 / gridFactor)

				const jointPositionSqrd = jointPosition.multiply(jointPosition)

				const cutoff = 0.5 * sphereRadius
				const absX = Math.abs(jointPosition.x)
				const absY = Math.abs(jointPosition.y)
				const absZ = Math.abs(jointPosition.z)
				const max = Math.max(Math.max(absX, absY, absZ))
				if (max === absX) {
					jointPosition.x =
						Math.sign(jointPosition.x) *
						Math.sqrt(
							sphereRadiusSqrd - jointPositionSqrd.y - jointPositionSqrd.z
						)
					circleAmount.value = absY > cutoff || absZ > cutoff ? 0 : 1
				} else if (max === absY) {
					jointPosition.y =
						Math.sign(jointPosition.y) *
						Math.sqrt(
							sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.z
						)
					circleAmount.value = absX > cutoff || absZ > cutoff ? 0 : 1
				} else {
					jointPosition.z =
						Math.sign(jointPosition.z) *
						Math.sqrt(
							sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.y
						)
					circleAmount.value = absX > cutoff || absY > cutoff ? 0 : 1
				}

				console.log(jointPosition)

				circlePosition.value = jointPosition
				if (
					BABYLON.Vector3.Distance(pointerPosition, jointPosition) >
					circleRadius.value
				) {
					circleAmount.value = 0
				}
			}
		})

		engine.runRenderLoop(() => {
			scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})

		return scene
	}
}
