import * as BABYLON from 'babylonjs'
import { OBJFileLoader } from 'babylonjs-loaders'

type Stone = {
	id: number
	stone: BABYLON.Mesh
}

export default class StoneManager {
	protected stones: Array<Stone> = []
	protected model
	readonly stoneSize = 1.6

	constructor(readonly scene: BABYLON.Scene, readonly gridSize: number) {
		// this.model = OBJFileLoader.
	}

	create(id: number, position: BABYLON.Vector3, color: BABYLON.Color3) {
		const diameter = (0.5 * this.stoneSize) / this.gridSize
		const stone = BABYLON.MeshBuilder.CreateCylinder('cyl', {
			diameter,
			height: diameter / 2,
		})
		stone.position = position

		// Creating stone's material
		const material = new BABYLON.PBRMetallicRoughnessMaterial('stone')
		material._albedoColor = color
		stone.material = material

		const path = new BABYLON.Path3D([new BABYLON.Vector3(0, 0, 0), position])
		const orientation = BABYLON.Vector3.RotationFromAxis(
			path.getBinormalAt(0),
			path.getTangentAt(0),
			path.getNormalAt(0)
		)
		stone.rotation = orientation

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
