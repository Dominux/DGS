import * as BABYLON from 'babylonjs'

import { GRID_MATERIAL, SPHERE_RADIUS } from '../../constants'
import Game from '../game'
import StoneManager, { CreateStoneScheme } from '../stone_manager'
import { Field, returnStonesBack } from './interface'

type SignedNumber = {
	n: number
	sign: 'POSITIVE' | 'NEGATIVE'
}

type SignedNumberOrNumber = SignedNumber | number

/** Special Vector, that contains not just numbers, but its sign */
class SignedVector3 {
	constructor(
		public x: SignedNumberOrNumber,
		public y: SignedNumberOrNumber,
		public z: SignedNumberOrNumber
	) {}

	get babylon(): BABYLON.Vector3 {
		return new BABYLON.Vector3(
			typeof this.x === 'number' ? this.x : this.x.n,
			typeof this.y === 'number' ? this.y : this.y.n,
			typeof this.z === 'number' ? this.z : this.z.n
		)
	}
}

export default class GridSphere implements Field {
	readonly _sphere: BABYLON.Mesh
	protected stoneManager: StoneManager
	game: Game | undefined
	protected sphereRadius = SPHERE_RADIUS
	private onEnvMove: Function | undefined
	private onDeath: Function | undefined
	private onError: Function | undefined
	private points: Array<SignedVector3> = []
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

	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): void {
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

		console.log(this.points[373], this.points[445])

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

		const stoneSchema = {
			id: this.activePointID,
			position: this.activePoint,
			color,
			rotation: this.getStoneRotation(this.activePoint),
		}

		this.stoneManager.create(stoneSchema)
		this.stoneManager.delete(deadlist)

		if (deadlist?.length) this.onDeath()
		this.onEnvMove()
	}

	getCreateStoneSchema(id: number, color: BABYLON.Color3): CreateStoneScheme {
		const position = this.points[id].babylon
		const rotation = this.getStoneRotation(position)
		return {
			id,
			position,
			rotation,
			color,
		}
	}

	protected getStoneRotation(position: BABYLON.Vector3): BABYLON.Vector3 {
		const path = new BABYLON.Path3D([new BABYLON.Vector3(0, 0, 0), position])
		return BABYLON.Vector3.RotationFromAxis(
			path.getBinormalAt(0),
			path.getTangentAt(0),
			path.getNormalAt(0)
		)
	}

	protected getPointID(position: BABYLON.Vector3): number {
		const roundK = 10e6
		const round = (n: number) =>
			Math.round((n + Number.EPSILON) * roundK) / roundK

		const failCheck = (
			attr: string,
			p: SignedVector3,
			other: BABYLON.Vector3
		) => {
			const pAttr: SignedNumberOrNumber = p[attr]
			const otherAttr: number = other[attr]

			switch (typeof pAttr) {
				case 'number':
					if (round(pAttr) !== round(otherAttr)) return false
					break

				default:
					if (round(pAttr.n) !== round(otherAttr)) return false

					switch (pAttr.sign) {
						case 'POSITIVE':
							if (otherAttr < 0) return false
							break

						case 'NEGATIVE':
							if (otherAttr > 0) return false
					}
			}

			return true
		}

		for (const [i, p] of this.points.entries()) {
			if (['x', 'y', 'z'].every((key) => failCheck(key, p, position))) {
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
	protected generatePoints(min: number): Array<SignedVector3> {
		const result = []

		const points = [...Array(this.gridSize).keys()].map(
			(p) => p / (this.gridSize - 1) - min
		)

		// Starting from the top
		for (const y of [...points].reverse()) {
			for (const x of [...points].reverse()) {
				result.push(new SignedVector3(x, y, this.findThirdCoord(x, y, true)))
			}
		}

		// Filling sides
		for (const z of [...points].reverse()) {
			for (const y of [...points].reverse()) {
				result.push(new SignedVector3(this.findThirdCoord(z, y, true), y, z))
			}
			for (const x of [...points].reverse()) {
				result.push(new SignedVector3(x, this.findThirdCoord(x, z, false), z))
			}
			for (const y of points) {
				result.push(new SignedVector3(this.findThirdCoord(y, z, false), y, z))
			}
			for (const x of points) {
				result.push(new SignedVector3(x, this.findThirdCoord(x, z, true), z))
			}
		}

		// Filling the bottom
		for (const x of points) {
			for (const y of points) {
				result.push(new SignedVector3(x, y, this.findThirdCoord(x, y, false)))
			}
		}

		return result
	}

	findThirdCoord(a: number, b: number, isPositive: boolean): SignedNumber {
		/*
     Given a sphere equation: 
     
     (x - x0)^2 + (y - y0)^2 + (z - z0)^2 = r^2;

     We know that x0, y0 and z0 are zeros, 
     cause our sphere has it's center in (0;0;0) coordinates
     So:

     c = sqrt(r^2 - a^2 - b^2);
     */

		const n = Math.sqrt(
			Math.abs(Math.pow(this.sphereRadius, 2) - Math.pow(a, 2) - Math.pow(b, 2))
		)
		return isPositive
			? { n, sign: 'POSITIVE' }
			: { n: n * -1, sign: 'NEGATIVE' }
	}

	undoMove(): void {
		// Undoing move
		this.game?.undoMove()

		const blackStones = this.game?.blackStones.map((id) =>
			this.getCreateStoneSchema(id, BABYLON.Color3.Black())
		)
		const whiteStones = this.game?.whiteStones.map((id) =>
			this.getCreateStoneSchema(id, BABYLON.Color3.White())
		)

		// Returning stones back
		returnStonesBack(this.stoneManager, [...blackStones, ...whiteStones])
	}
}
