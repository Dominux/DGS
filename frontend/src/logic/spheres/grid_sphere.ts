import * as BABYLON from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'

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

		const gridMaterial = new GridMaterial('')

		gridMaterial.mainColor = BABYLON.Color3.White()
		gridMaterial.lineColor = BABYLON.Color3.Black()
		gridMaterial.gridRatio = 0.1
		gridMaterial.majorUnitFrequency = 1
		gridMaterial.minorUnitVisibility = 0

		sphere.material = gridMaterial
		sphere.enablePointerMoveEvents = true

		scene.onPointerMove = (
			event: BABYLON.IPointerEvent,
			pickInfo: BABYLON.PickingInfo
		) => {
			// if (pickInfo.pickedMesh !== sphere) {
			// 	gridMaterial.circleAmount = 0
			// 	return
			// }

			if (pickInfo.pickedPoint === null) {
				return
			}

			console.log(pickInfo.pickedPoint)

			const pointerPosition = pickInfo.pickedPoint.subtract(sphere.position)
			const gridFactor =
				1 / gridMaterial.gridRatio / Math.round(gridMaterial.majorUnitFrequency)
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
				// circleAmount.value = absY > cutoff || absZ > cutoff ? 0 : 1
			} else if (max === absY) {
				jointPosition.y =
					Math.sign(jointPosition.y) *
					Math.sqrt(
						sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.z
					)
				// circleAmount.value = absX > cutoff || absZ > cutoff ? 0 : 1
			} else {
				jointPosition.z =
					Math.sign(jointPosition.z) *
					Math.sqrt(
						sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.y
					)
				// circleAmount.value = absX > cutoff || absY > cutoff ? 0 : 1
			}
			// circlePosition.value = jointPosition
			// if (
			// 	BABYLON.Vector3.Distance(pointerPosition, jointPosition) >
			// 	circleRadius.value
			// ) {
			// 	circleAmount.value = 0
			// }
		}

		engine.runRenderLoop(() => {
			scene.render()
		})

		window.addEventListener('resize', () => {
			engine.resize()
		})

		return scene
	}
}
