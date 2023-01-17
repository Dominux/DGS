import * as BABYLON from 'babylonjs'
import createLocalStore from '../../../libs'

import { MoveResult } from '../../api/models'
import { GRID_MATERIAL, SPHERE_RADIUS } from '../../constants'
import Game from '../game'
import StoneManager, { CreateStoneScheme } from '../stone_manager'
import { Field, returnStonesBack } from './interface'

export default class GridSphere implements Field {
	readonly _sphere: BABYLON.Mesh
	protected stoneManager: StoneManager
	game: Game | undefined
	protected sphereRadius = SPHERE_RADIUS
	private onEndMove: Function | undefined
	private onDeath: Function | undefined
	private onError: Function | undefined
	private points: Array<BABYLON.Vector3> = []
	private activePointID: number | null = null
	private activePoint: BABYLON.Vector3 | undefined
	private canPutStone = false
	canMove = true
	private circleRadius
	private circleAmount
	private circlePosition
	private circleColor
	private gridRatio
	private majorUnitFrequency

	static async init(
		scene: globalThis.BABYLON.Scene,
		gridSize: number
	): Promise<GridSphere> {
		const _this = new GridSphere(scene, gridSize)

		gridSize--

		_this._sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{ diameter: _this.sphereRadius * 2, segments: 32 },
			scene
		)
		_this._sphere.position.y = 1

		_this.stoneManager = new StoneManager(scene, gridSize, _this.sphereRadius)

		const gridMaterial = await BABYLON.NodeMaterial.ParseFromFileAsync(
			'gridMaterial',
			GRID_MATERIAL,
			scene
		)
		_this.gridRatio = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'gridRatio'
		)
		_this.majorUnitFrequency = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'majorUnitFrequency'
		)
		const minorUnitVisibility = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'minorUnitVisibility'
		)
		_this.circleRadius = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'circleRadius'
		)
		_this.circleAmount = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'circleAmount'
		)
		_this.circlePosition = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'circlePosition'
		)
		const circleSmoothness = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'circleSmoothness'
		)
		const lineColor = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'lineColor'
		)
		_this.circleColor = gridMaterial.getInputBlockByPredicate(
			(b) => b.name === 'circleColor'
		)

		lineColor.value = BABYLON.Color3.Black()
		// this.circleColor.value = BABYLON.Color3.Green()
		_this.gridRatio.value = _this.sphereRadius / gridSize
		_this.majorUnitFrequency.value = 1
		minorUnitVisibility.value = 0
		_this.circleRadius.value = (0.4 * _this.sphereRadius) / gridSize
		circleSmoothness.value = 0.005

		_this._sphere.material = gridMaterial

		return _this
	}

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {}

	async start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): Promise<void> {
		this.game = game
		this.onDeath = onDeath
		this.onEndMove = onEndMove
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
		await this.game?.start()

		// Setting circle color
		this.setCircleColor()

		// Allowing putting stones
		this.allowPuttingStones()
	}

	/**
	 * Delete sphere
	 */
	delete() {
		this._sphere.dispose()
	}

	get playerTurn(): string {
		return this.game?.playerTurn
	}

	get blackScore() {
		return this.game?.blackScore
	}

	get whiteScore() {
		return this.game?.whiteScore
	}

	protected allowPuttingStones() {
		this.scene.onPointerObservable.add(
			async (pointerInfo: BABYLON.PointerInfo) => {
				switch (pointerInfo.type) {
					case BABYLON.PointerEventTypes.POINTERDOWN:
						this.canPutStone = true
						setTimeout(() => (this.canPutStone = false), 300)
						break
					case BABYLON.PointerEventTypes.POINTERUP:
						if (
							this.canMove &&
							this.canPutStone &&
							pointerInfo.pickInfo?.hit &&
							pointerInfo.pickInfo?.pickedMesh === this._sphere &&
							this.activePointID !== null
						) {
							await this.putStone()
						}
				}
			}
		)
	}

	private async putStone() {
		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		let deadlist = []
		try {
			deadlist = await this.game?.makeMove(this.activePointID)
		} catch (error) {
			this.onError(error.message)
			throw error
		}

		console.log(this.game?.moveNumber)

		// Adjusting position a bit
		const position = this.activePoint
		position.y += 1

		const stoneSchema = {
			id: this.activePointID,
			position: position,
			color,
			rotation: this.getStoneRotation(position),
		}

		this.stoneManager.create(stoneSchema)
		this.stoneManager.delete(deadlist)

		if (deadlist?.length) this.onDeath()
		this.setCircleColor()
		this.onEndMove()

		// Defines if the game is multiplayered
		if (this.game.wsClient) {
			this.canMove = false

			const move_result = await this.game.waitForOpponentMove()
			this.makeMoveProgramatically(move_result)

			this.canMove = true
		}
	}

	makeMoveProgramatically(move_result: MoveResult): void {
		console.log(this.game?.moveNumber)
		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		const stoneSchema = this.getCreateStoneSchema(move_result.point_id, color)

		this.stoneManager.create(stoneSchema)
		this.stoneManager.delete(move_result.died_stones_ids)

		if (move_result.died_stones_ids?.length) this.onDeath()
		this.setCircleColor()
		this.onEndMove()
	}

	private setCircleColor() {
		if (this.game.wsClient) {
			const [store, _setStore] = createLocalStore()
			this.circleColor.value =
				store.user.id === store.room.player1_id
					? BABYLON.Color3.Black()
					: BABYLON.Color3.White()
		} else {
			this.circleColor.value =
				this.playerTurn.toLowerCase() === 'black'
					? BABYLON.Color3.Black()
					: BABYLON.Color3.White()
		}
	}

	getCreateStoneSchema(id: number, color: BABYLON.Color3): CreateStoneScheme {
		const position = this.points[id].clone()
		position.y += 1
		const rotation = this.getStoneRotation(position)
		return {
			id,
			position,
			rotation,
			color,
		}
	}

	protected getStoneRotation(position: BABYLON.Vector3): BABYLON.Vector3 {
		const path = new BABYLON.Path3D([new BABYLON.Vector3(0, 1, 0), position])
		return BABYLON.Vector3.RotationFromAxis(
			path.getBinormalAt(0),
			path.getTangentAt(0),
			path.getNormalAt(0)
		)
	}

	protected getPointID(position: BABYLON.Vector3): number | void {
		const roundK = 10e6
		const round = (n: number) =>
			Math.round((n + Number.EPSILON) * roundK) / roundK

		for (const [i, p] of this.points.entries()) {
			if (
				round(p.x) === round(position.x) &&
				round(p.y) === round(position.y) &&
				round(p.z) === round(position.z)
			) {
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
	protected generatePoints(min: number): Array<BABYLON.Vector3> {
		const result = []

		const points = [...Array(this.gridSize).keys()].map(
			(p) => (p / (this.gridSize - 1) - min) * this.sphereRadius
		)

		// Starting from the top
		for (const y of [...points].reverse()) {
			for (const x of [...points].reverse()) {
				result.push(new BABYLON.Vector3(x, y, this.findThirdCoord(x, y, true)))
			}
		}

		// Filling sides
		for (const z of [...points].reverse()) {
			for (const y of [...points].reverse()) {
				result.push(new BABYLON.Vector3(this.findThirdCoord(z, y, true), y, z))
			}
			for (const x of [...points].reverse()) {
				result.push(new BABYLON.Vector3(x, this.findThirdCoord(x, z, false), z))
			}
			for (const y of points) {
				result.push(new BABYLON.Vector3(this.findThirdCoord(y, z, false), y, z))
			}
			for (const x of points) {
				result.push(new BABYLON.Vector3(x, this.findThirdCoord(x, z, true), z))
			}
		}

		// Filling the bottom
		for (const x of points) {
			for (const y of points) {
				result.push(new BABYLON.Vector3(x, y, this.findThirdCoord(x, y, false)))
			}
		}

		return result
	}

	findThirdCoord(a: number, b: number, isPositive: boolean): number {
		/*
     Given a sphere equation: 
     
     (x - x0)^2 + (y - y0)^2 + (z - z0)^2 = r^2;

     We know that x0, y0 and z0 are zeros, 
     cause our sphere has it's center in (0;0;0) coordinates
     So:

     c = sqrt(r^2 - a^2 - b^2);
     */

		const c = Math.sqrt(
			Math.abs(Math.pow(this.sphereRadius, 2) - Math.pow(a, 2) - Math.pow(b, 2))
		)
		return isPositive ? c : c * -1
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

		// Setting circle color
		this.setCircleColor()
	}
}
