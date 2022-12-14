import * as BABYLON from 'babylonjs'

import { SPHERE_RADIUS } from '../../constants'
import Game from '../game'
import StoneManager from '../stone_manager'
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

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		const textureSize = 512
		const paddingFraction = 0.05
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
		this._field.position.y = this.fieldHeight
		this._field.material = mat

		this.stoneManager = new StoneManager(scene, gridSize)

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

	start(
		game: Game,
		onEndMove: Function,
		onDeath: Function,
		onError: Function
	): void {
		this.game = game
		this.onDeath = onDeath
		this.onEndMove = onEndMove
		this.onError = onError

		this._field.enablePointerMoveEvents = true

		// Starting the game process
		this.game?.start()

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
						pointerInfo.pickInfo?.pickedMesh === this._field
					) {
						this.putStone(pointerInfo.pickInfo.pickedPoint)
					}
			}
		})
	}

	private putStone(point: BABYLON.Vector3) {
		const color =
			this.game?.playerTurn === 'Black'
				? BABYLON.Color3.Black()
				: BABYLON.Color3.White()

		const clickedPointID = this.getPointID(point)

		if (clickedPointID === undefined) return

		const clickedCoords = this.points[clickedPointID]

		let deadlist = []
		try {
			deadlist = this.game?.makeMove(clickedPointID)
		} catch (error) {
			this.onError(error.message)
			throw error
		}

		// Placing a stone
		const clickedPoint = new BABYLON.Vector3(
			clickedCoords.x,
			this.stoneY,
			clickedCoords.z
		)
		this.stoneManager.create(
			clickedPointID,
			clickedPoint,
			color,
			new BABYLON.Vector3()
		)
		this.stoneManager.delete(deadlist)

		if (deadlist?.length) this.onDeath()
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

	undoMove(): void {
		// Undoing move
		this.game?.undoMove()

		// Returning stones back
		returnStonesBack(this.stoneManager)
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
