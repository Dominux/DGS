import * as BABYLON from 'babylonjs'
import { FIELD_Y } from '../constants'

export type CreateStoneScheme = {
	id: number
	position: BABYLON.Vector3
	color: BABYLON.Color3
	rotation: BABYLON.Vector3
}

type Stone = {
	id: number
	stone: BABYLON.Mesh
}

export default class StoneManager {
	protected stones: Array<Stone> = []
	readonly stoneSize = 1.6
	readonly height: number
	readonly multiplier: number

	constructor(readonly scene: BABYLON.Scene, gridSize: number, k: number) {
		this.height = (0.2 * this.stoneSize * k) / gridSize
		this.multiplier = 1 + this.height / 2 - this.height * 0.025
	}

	create(stoneSchema: CreateStoneScheme) {
		const id = stoneSchema.id

		const diameter = this.height * 3

		// Creating stone
		const stone = BABYLON.MeshBuilder.CreateSphere(`sphere_${id}`, {
			diameterX: diameter,
			diameterY: this.height,
			diameterZ: diameter,
		})

		// Setting right position
		stoneSchema.position.y -= FIELD_Y
		stone.position = stoneSchema.position.scale(this.multiplier)
		stone.position.y += FIELD_Y

		// Creating stone's material
		const material = new BABYLON.PBRMetallicRoughnessMaterial('stone')
		material._albedoColor = stoneSchema.color
		stone.material = material

		// Setting stone's rotation
		stone.rotation = stoneSchema.rotation

		this.stones.push({ id, stone })
	}

	delete(indexes: Array<number>) {
		const newStones = []

		for (const stone of this.stones) {
			if (indexes.includes(stone.id)) {
				stone.stone.dispose()
			} else {
				newStones.push(stone)
			}
		}

		this.stones = newStones
	}

	clear() {
		this.stones.forEach((stone) => stone.stone.dispose())
		this.stones = []
	}
}
