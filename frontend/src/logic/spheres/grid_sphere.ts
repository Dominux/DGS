import * as BABYLON from 'babylonjs'
import { GRID_MATERIAL, SPHERE_RADIUS } from '../../constants'
import Game from '../game'
import StoneManager from '../stone_manager'

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
	protected stoneManager: StoneManager
	protected game: Game | undefined
	protected sphereRadius = SPHERE_RADIUS
	private onEnvMove: Function | undefined
	private onDeath: Function | undefined
	private onError: Function | undefined
	private points: Array<Coordinates> = []
	private activePointID: number | null = null
	private activePoint: BABYLON.Vector3 | undefined
	private canPutStone = false
	private circleRadius
	private circleAmount
	private circlePosition
	private gridRatio
	private majorUnitFrequency

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		gridSize--

		this._sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: this.sphereRadius * 2, segments: 32 },
			scene
		)

		this.stoneManager = new StoneManager(scene, gridSize)

		BABYLON.NodeMaterial.ParseFromFileAsync(
			'gridMaterial',
			GRID_MATERIAL,
			scene
		).then((gridMaterial) => {
			this.gridRatio = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'gridRatio'
			)
			this.majorUnitFrequency = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'majorUnitFrequency'
			)
			const minorUnitVisibility = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'minorUnitVisibility'
			)
			this.circleRadius = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleRadius'
			)
			this.circleAmount = gridMaterial.getInputBlockByPredicate(
				(b) => b.name === 'circleAmount'
			)
			this.circlePosition = gridMaterial.getInputBlockByPredicate(
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

			lineColor.value = BABYLON.Color3.Black()
			circleColor.value = BABYLON.Color3.Green()
			this.gridRatio.value = 1 / gridSize
			this.majorUnitFrequency.value = 1
			minorUnitVisibility.value = 0
			this.circleRadius.value = 0.4 / gridSize
			circleSmoothness.value = 0.005

			this._sphere.material = gridMaterial
		})
	}

	start(game: Game, onEndMove: Function, onDeath: Function, onError: Function) {
		this.game = game
		this.onDeath = onDeath
		this.onEnvMove = onEndMove
		this.onError = onError

		this._sphere.enablePointerMoveEvents = true

		const sphereRadiusSqrd = this.sphereRadius * this.sphereRadius
		const gridFactor =
			1 / this.gridRatio.value / Math.round(this.majorUnitFrequency.value)

		this.scene.onPointerMove = (
			_event: BABYLON.IPointerEvent,
			pickInfo: BABYLON.PickingInfo
		) => {
			if (pickInfo.pickedMesh !== this._sphere) {
				this.circleAmount.value = 0
				this.activePointID = null
				return
			}

			const pointerPosition = pickInfo.pickedPoint.subtract(
				this._sphere.position
			)
			const jointPosition = pointerPosition.scale(gridFactor)
			jointPosition.x = Math.round(jointPosition.x)
			jointPosition.y = Math.round(jointPosition.y)
			jointPosition.z = Math.round(jointPosition.z)
			jointPosition.scaleInPlace(1 / gridFactor)

			const jointPositionSqrd = jointPosition.multiply(jointPosition)

			const cutoff = 0.5 * this.sphereRadius
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
				this.circleAmount.value = absY > cutoff || absZ > cutoff ? 0 : 1
			} else if (max === absY) {
				jointPosition.y =
					Math.sign(jointPosition.y) *
					Math.sqrt(
						sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.z
					)
				this.circleAmount.value = absX > cutoff || absZ > cutoff ? 0 : 1
			} else {
				jointPosition.z =
					Math.sign(jointPosition.z) *
					Math.sqrt(
						sphereRadiusSqrd - jointPositionSqrd.x - jointPositionSqrd.y
					)
				this.circleAmount.value = absX > cutoff || absY > cutoff ? 0 : 1
			}

			this.circlePosition.value = jointPosition
			if (
				BABYLON.Vector3.Distance(pointerPosition, jointPosition) >
				this.circleRadius.value
			) {
				this.circleAmount.value = 0
				this.activePointID = null
				this.activePoint = undefined
			} else {
				this.activePointID = this.getPointID(jointPosition)
				this.activePoint = jointPosition
			}
		}

		// Calculating points
		this.points = this.generatePoints(0.5)

		// Starting the game process
		this.game?.start()

		// Allowing putting stones
		this.allowPuttingStones()
	}

	/**
	 * Delete sphere
	 */
	delete() {
		this._sphere.dispose()
	}

	get playerTurn() {
		return this.game?.playerTurn
	}

	get blackScore() {
		return this.game?.blackScore
	}

	get whiteScore() {
		return this.game?.whiteScore
	}

	protected allowPuttingStones() {
		this.scene.onPointerObservable.add((pointerInfo: BABYLON.PointerInfo) => {
			switch (pointerInfo.type) {
				case BABYLON.PointerEventTypes.POINTERDOWN:
					this.canPutStone = true
					setTimeout(() => (this.canPutStone = false), 300)
					break
				case BABYLON.PointerEventTypes.POINTERUP:
					if (
						this.canPutStone &&
						pointerInfo.pickInfo?.hit &&
						pointerInfo.pickInfo?.pickedMesh === this._sphere &&
						this.activePointID !== null
					) {
						this.putStone()
					}
			}
		})
	}

	private putStone() {
		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		let deadlist = []
		try {
			deadlist = this.game?.makeMove(this.activePointID)
		} catch (error) {
			this.onError(error.message)
			throw error
		}

		this.stoneManager.create(this.activePointID, this.activePoint, color)
		this.stoneManager.delete(deadlist)

		if (deadlist?.length) this.onDeath()
		this.onEnvMove()
	}

	protected getPointID(coords: BABYLON.Vector3): number {
		const roundK = 10e6
		const round = (n: number) =>
			Math.round((n + Number.EPSILON) * roundK) / roundK

		const failCheck = (
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

		for (const [i, p] of this.points.entries()) {
			if (['x', 'y', 'z'].every((key) => failCheck(key, p, coords))) {
				return i
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

		const points = [...Array(this.gridSize).keys()].map(
			(p) => p / (this.gridSize - 1) - min
		)

		// Starting from the top
		for (const y of [...points].reverse()) {
			for (const x of [...points].reverse()) {
				result.push({ x, y, z: Pole.POSITIVE })
			}
		}

		// Filling sides
		for (const z of [...points].reverse()) {
			for (const y of [...points].reverse()) {
				result.push({ x: Pole.POSITIVE, y, z })
			}
			for (const x of [...points].reverse()) {
				result.push({ x, y: Pole.NEGATIVE, z })
			}
			for (const y of points) {
				result.push({ x: Pole.NEGATIVE, y, z })
			}
			for (const x of points) {
				result.push({ x, y: Pole.POSITIVE, z })
			}
		}

		// Filling the bottom
		for (const x of points) {
			for (const y of points) {
				result.push({ x, y, z: Pole.NEGATIVE })
			}
		}

		return result
	}
}
