import * as BABYLON from '@babylonjs/core'

export enum Pole {
	POSITIVE = 'POSITIVE',
	NEGATIVE = 'NEGATIVE',
}

export type Coordinates = {
	x: number | Pole
	y: number | Pole
	z: number | Pole
}

export default class GridSphere {
	readonly _sphere: BABYLON.Mesh
	private points: Array<Coordinates>
	private activePoint: Coordinates | null

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		// Our built-in 'sphere' shape. Params: name, options, scene
		gridSize--

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
			const circleColor = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleColor'
			)

			bgColor.value = BABYLON.Color3.White()
			lineColor.value = BABYLON.Color3.Black()
			circleColor.value = BABYLON.Color3.Green()
			gridRatio.value = 1 / gridSize
			majorUnitFrequency.value = 1
			minorUnitVisibility.value = 0
			circleRadius.value = 0.03
			circleSmoothness.value = 0.005

			sphere.material = gridMaterial
			sphere.enablePointerMoveEvents = true

			const gridFactor =
				1 / gridRatio.value / Math.round(majorUnitFrequency.value)

			scene.onPointerMove = (
				_event: BABYLON.IPointerEvent,
				pickInfo: BABYLON.PickingInfo
			) => {
				if (pickInfo.pickedMesh !== sphere) {
					circleAmount.value = 0
					this.activePoint = null
					return
				}

				const pointerPosition = pickInfo.pickedPoint.subtract(sphere.position)
				const jointPosition = pointerPosition.scale(gridFactor)
				jointPosition.x = Math.round(jointPosition.x)
				jointPosition.y = Math.round(jointPosition.y)
				jointPosition.z = Math.round(jointPosition.z)
				jointPosition.scaleInPlace(1 / gridFactor)

				// console.log(jointPosition)

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

				circlePosition.value = jointPosition
				if (
					BABYLON.Vector3.Distance(pointerPosition, jointPosition) >
					circleRadius.value
				) {
					circleAmount.value = 0
					this.activePoint = null
				} else {
					// console.log(jointPosition)
					this.activePoint = this.getPoint(jointPosition)
				}
			}
		})

		this.points = this.generatePoints(0.5)
		console.log(this.points)
		this._sphere = sphere
	}

	allowPuttingStones() {
		this.scene.onPointerObservable.add((pointerInfo: BABYLON.PointerInfo) => {
			if (
				pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP &&
				pointerInfo.pickInfo?.hit &&
				pointerInfo.pickInfo.pickedMesh === this._sphere
				// this.activePoint
			) {
				this.putStone()
			}
		})
	}

	private putStone() {
		console.log(this.activePoint)
	}

	protected getPoint(coords: BABYLON.Vector3) {
		const roundK = 10e6
		const round = (n: number) =>
			Math.round((n + Number.EPSILON) * roundK) / roundK

		const faildCheck = (
			key: string,
			p: Coordinates,
			coords: BABYLON.Vector3
		) => {
			switch (typeof p[key]) {
				case 'number':
					if (round(p[key]) !== round(coords[key])) return false
					break
				default:
					switch (p[key]) {
						case Pole.POSITIVE:
							if (coords[key] < 0) return false
							break
						case Pole.NEGATIVE:
							if (coords[key] > 0) return false
					}
			}

			return true
		}

		for (const p of this.points) {
			// debugger
			if (['x', 'y', 'z'].every((key) => faildCheck(key, p, coords))) {
				return p
			}
		}
	}

	/**
	 * Generates ids for all points
	 *
	 * Since ids are integers starting from 0,
	 * array of points coordinates are returns
	 */
	protected generatePoints(min: number): Array<Coordinates> {
		const result: Array<Coordinates> = []

		// const k = this.gridSize - 1
		const points = [...Array(this.gridSize).keys()].map(
			(p) => p / (this.gridSize - 1) - min
		)
		console.log(points)

		// Starting from the top
		for (const y of [...points].reverse()) {
			for (const x of points) {
				result.push({ x, y, z: Pole.POSITIVE })
			}
		}

		// Filling sides
		for (const z of [...points].reverse()) {
			for (let x = 1; x < 5; x++) {
				switch (x) {
					case 1:
						for (const y of [...points].reverse()) {
							result.push({ x: Pole.NEGATIVE, y, z })
						}
						break
					case 2:
						for (const x of points) {
							result.push({ x, y: Pole.NEGATIVE, z })
						}
						break
					case 3:
						for (const y of points) {
							result.push({ x: Pole.POSITIVE, y, z })
						}
						break
					case 4:
						for (const x of [...points].reverse()) {
							result.push({ x, y: Pole.POSITIVE, z })
						}
						break
				}
			}
		}

		// Filling the bottom
		for (const y of points) {
			for (const x of [...points].reverse()) {
				result.push({ x, y, z: Pole.NEGATIVE })
			}
		}

		return result
	}
}
