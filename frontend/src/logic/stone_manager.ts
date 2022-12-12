import * as BABYLON from 'babylonjs'

type Stone = {
	id: number
	stone: BABYLON.Mesh
}

export default class StoneManager {
	protected stones: Array<Stone> = []
	readonly stoneSize = 1.6
	readonly height: number

	constructor(readonly scene: BABYLON.Scene, gridSize: number) {
		this.height = (0.2 * this.stoneSize) / gridSize
	}

	create(
		id: number,
		position: BABYLON.Vector3,
		color: BABYLON.Color3,
		rotation: BABYLON.Vector3
	) {
		const diameter = this.height * 3

		// Creating stone
		const stone = BABYLON.MeshBuilder.CreateSphere(`sphere_${id}`, {
			diameterX: diameter,
			diameterY: this.height,
			diameterZ: diameter,
		})

		// Setting right position
		const multiplier = 1 + this.height / 2 - this.height * 0.025
		stone.position = position.scale(multiplier)

		// Creating stone's material
		const material = new BABYLON.PBRMetallicRoughnessMaterial('stone')
		material._albedoColor = color
		stone.material = material

		// Setting stone's rotation
		stone.rotation = rotation

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
}
