import { Component, createSignal, onMount } from 'solid-js'

import styles from './App.module.css'
import Game from './logic/game'
import Scene from './logic/scene'
import GridSphere from './logic/spheres/grid_sphere'

const App: Component = () => {
	// TODO: bind changing grid size
	const [gridSize, _setGridSize] = createSignal(9)

	let canvas: HTMLCanvasElement

	onMount(() => {
		// Creating game
		const scene = new Scene(canvas)
		const game = new Game(gridSize())
		const field = new GridSphere(scene._scene, gridSize(), game)

		// Starting game
		field.allowPuttingStones()
	})

	return (
		<div class={styles.App}>
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default App
