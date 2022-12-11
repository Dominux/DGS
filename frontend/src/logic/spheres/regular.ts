import * as BABYLON from 'babylonjs'

import { SPHERE_RADIUS } from '../../constants'
import Game from '../game'
import StoneManager from '../stone_manager'
import { Field } from './interface'

export type Coordinates = {
	x: number
	y: number
}

export default class RegularField implements Field {
	readonly _field: BABYLON.Mesh
	protected pointsManager: PointsCoordinatesManager
	protected stoneManager: StoneManager
	protected game: Game | undefined
	protected sphereRadius = SPHERE_RADIUS
	private onEnvMove: Function | undefined
	private onDeath: Function | undefined
	private onError: Function | undefined
	private activePointID: number | null = null
	private activePoint: BABYLON.Vector3 | undefined
	private canPutStone = false
	private circleRadius
	private circleAmount
	private circlePosition
	private gridRatio

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		const fieldSize = 1
		const textureSize = 512
		this.pointsManager = new PointsCoordinatesManager(gridSize, 0.1)

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

		const textureSizedPoints = this.pointsManager.getMultipliedOn(textureSize)
		for (const row of textureSizedPoints) {
			// rows
			textureContext.beginPath()
			textureContext.moveTo(row[0].x, row[0].y)

			const [lastCol] = row.slice(-1)
			textureContext.lineTo(lastCol.x, lastCol.y)
			textureContext.stroke()

			// cols
			textureContext.beginPath()
			textureContext.moveTo(row[0].y, row[0].x)

			textureContext.lineTo(lastCol.y, lastCol.x)
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
			height: fieldSize * 0.05,
			width: fieldSize,
			depth: fieldSize,
			faceUV: faceUV,
		})
		this._field.position.y = 0.05
		this._field.material = mat

		this.stoneManager = new StoneManager(scene, gridSize)
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

		this._field.enablePointerMoveEvents = true

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

		// Starting the game process
		this.game?.start()

		// Allowing putting stones
		this.allowPuttingStones()
	}

	/**
	 * Delete sphere
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
						pointerInfo.pickInfo?.pickedMesh === this._field &&
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
				const y = (col / size_minus_1 - 0.5) * contextFraction + 0.5

				return { x, y }
			})
		})
	}

	getMultipliedOn(multiplier: number): Array<Array<Coordinates>> {
		return this.pointsCoords.map((row) =>
			row.map((col) => {
				return { x: col.x * multiplier, y: col.y * multiplier }
			})
		)
	}
}
