import { Component, onMount } from 'solid-js'

import styles from './App.module.css'
import GridSpherePlayground from './logic/spheres/grid_sphere'

const App: Component = () => {
	let canvas: HTMLCanvasElement
	onMount(() => {
		GridSpherePlayground.createScene(canvas)
	})

	return (
		<div class={styles.App}>
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default App
