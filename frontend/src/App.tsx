import { Component, createSignal, onMount } from 'solid-js'

import styles from './App.module.css'
import Scene from './logic/scene'
import GridSphere from './logic/spheres/grid_sphere'

const App: Component = () => {
	// TODO: bind changing grid size
	const [gridSize, _setGridSize] = createSignal(7)

	let canvas: HTMLCanvasElement

	onMount(() => {
		const scene = new Scene(canvas)
		new GridSphere(scene._scene, gridSize())
	})

	return (
		<div class={styles.App}>
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default App
