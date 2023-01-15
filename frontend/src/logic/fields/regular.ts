import * as BABYLON from 'babylonjs'
import { MoveResult } from '../../api/models'

import {
	REGULAR_FIELD_PADDING_TO_CELL_FRACTION,
	SPHERE_RADIUS,
} from '../../constants'
import Game from '../game'
import StoneManager, { CreateStoneScheme } from '../stone_manager'
import { Field, returnStonesBack } from './interface'

export type Coordinates = {
	x: number
	z: number
}

export default class RegularField implements Field {
	readonly fieldSize = 1
	readonly fieldHeight = 0.05
	readonly _field: BABYLON.Mesh
	readonly clickableRadius: number
	readonly stoneY: number
	protected points: Array<Coordinates>
	protected stoneManager: StoneManager
	protected game: Game | undefined
	protected sphereRadius = SPHERE_RADIUS
	private onEndMove: Function | undefined
	private onDeath: Function | undefined
	private onError: Function | undefined
	private canPutStone = false
	canMove = true

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		const textureSize = 512
		const paddingFraction =
			REGULAR_FIELD_PADDING_TO_CELL_FRACTION / (gridSize + 1)
		const pointsManager = new PointsCoordinatesManager(
			gridSize,
			paddingFraction
		)

		this.clickableRadius = ((1 - paddingFraction * 2) / gridSize) * 0.8

		// Creating a texture
		const textureGrid = new BABYLON.DynamicTexture(
			'regular grid texture',
			textureSize,
			scene
		)
		const textureContext = textureGrid.getContext()

		textureContext.fillStyle = 'white'
		textureContext.fillRect(0, 0, textureSize, textureSize)
		textureGrid.update()

		textureContext.strokeStyle = 'black'
		textureContext.fillStyle = 'black'

		const textureSizedPoints = pointsManager.getMultipliedOn(textureSize)
		for (const row of textureSizedPoints) {
			// rows
			textureContext.beginPath()
			textureContext.moveTo(row[0].x, row[0].z)

			const [lastCol] = row.slice(-1)
			textureContext.lineTo(lastCol.x, lastCol.z)
			textureContext.stroke()

			// cols
			textureContext.beginPath()
			textureContext.moveTo(row[0].z, row[0].x)

			textureContext.lineTo(lastCol.z, lastCol.x)
			textureContext.stroke()
		}

		textureGrid.update()

		const mat = new BABYLON.PBRMaterial('Mat', scene)
		mat.albedoTexture = textureGrid
		mat.roughness = 0.15
		mat.metallic = 0

		// Placing the drawed texture at only one face
		const faceUV = new Array(6)
		for (let i = 0; i < 6; i++) {
			faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0)
		}
		faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1)

		this._field = BABYLON.MeshBuilder.CreateBox('regular_field', {
			height: this.fieldSize * this.fieldHeight,
			width: this.fieldSize,
			depth: this.fieldSize,
			faceUV: faceUV,
		})
		this._field.position.y = this.fieldHeight + 1
		this._field.material = mat

		this.stoneManager = new StoneManager(scene, gridSize, 1)

		this.stoneY =
			this._field.position.y +
			(this.fieldSize * this.fieldHeight) / 2 +
			this.stoneManager.height / 2

		// Getting points
		const subtrehand = 0.5
		this.points = pointsManager
			.getMultipliedOn(this.fieldSize)
			.flat()
			.map((p) => {
				return {
					x: p.x - subtrehand,
					z: p.z - subtrehand,
				}
			})
	}

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

		this._field.enablePointerMoveEvents = true

		// Starting the game process
		await this.game?.start()

		// Allowing putting stones
		this.allowPuttingStones()
	}

	/**
	 * Delete field
	 */
	delete() {
		this._field.dispose()
	}

	get playerTurn() {
		return this.game?.playerTurn
	}

	get blackScore(): number {
		return this.game?.blackScore
	}

	get whiteScore(): number {
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
							pointerInfo.pickInfo?.pickedMesh === this._field
						) {
							await this.putStone(pointerInfo.pickInfo.pickedPoint)
						}
				}
			}
		)
	}

	private async putStone(point: BABYLON.Vector3) {
		const clickedPointID = this.getPointID(point)

		if (clickedPointID === undefined) return

		const clickedCoords = this.points[clickedPointID]

		let deadlist = []
		try {
			deadlist = await this.game?.makeMove(clickedPointID)
		} catch (error) {
			this.onError(error.message)
			throw error
		}

		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		// Placing a stone
		const clickedPoint = new BABYLON.Vector3(
			clickedCoords.x,
			this.stoneY,
			clickedCoords.z
		)
		const schema = {
			id: clickedPointID,
			position: clickedPoint,
			color,
			rotation: new BABYLON.Vector3(),
		}
		this.stoneManager.create(schema)
		this.stoneManager.delete(deadlist)

		if (deadlist?.length) this.onDeath()
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
		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		const stoneSchema = this.getCreateStoneSchema(move_result.point_id, color)

		this.stoneManager.create(stoneSchema)
		this.stoneManager.delete(move_result.died_stones_ids)

		if (move_result.died_stones_ids?.length) this.onDeath()
		this.onEndMove()
	}

	protected getPointID(coords: BABYLON.Vector3): number | void {
		const maxX = coords.x + this.clickableRadius
		const minX = coords.x - this.clickableRadius
		const maxZ = coords.z + this.clickableRadius
		const minZ = coords.z - this.clickableRadius

		for (const [i, p] of this.points.entries()) {
			if (p.x < maxX && p.x > minX && p.z < maxZ && p.z > minZ) return i
		}
	}

	getCreateStoneSchema(id: number, color: BABYLON.Color3): CreateStoneScheme {
		const coords = this.points[id]
		return {
			id,
			position: new BABYLON.Vector3(coords.x, this.stoneY, coords.z),
			rotation: new BABYLON.Vector3(),
			color,
		}
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

class PointsCoordinatesManager {
	readonly pointsCoords: Array<Array<Coordinates>>

	constructor(size: number, paddingFraction: number) {
		this.pointsCoords = PointsCoordinatesManager.genPointsCoords(
			size,
			paddingFraction
		)
	}

	static genPointsCoords(
		size: number,
		paddingFraction: number
	): Array<Array<Coordinates>> {
		const size_minus_1 = size - 1
		const contextFraction = 1 - paddingFraction * 2

		return [...Array(size).keys()].map((row) => {
			const x = (row / size_minus_1 - 0.5) * contextFraction + 0.5

			return [...Array(size).keys()].map((col) => {
				const z = (col / size_minus_1 - 0.5) * contextFraction + 0.5

				return { x, z }
			})
		})
	}

	getMultipliedOn(multiplier: number): Array<Array<Coordinates>> {
		return this.pointsCoords.map((row) =>
			row.map((col) => {
				return { x: col.x * multiplier, z: col.z * multiplier }
			})
		)
	}
}
