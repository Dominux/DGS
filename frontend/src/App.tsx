import { Component, onMount } from 'solid-js'

import styles from './App.module.css'
import { SPHERE_RADIUS } from './constants'
import GameManager from './logic/game_manager'

const App: Component = () => {
	onMount(() => {
		// Creating game
		setTimeout(() => new GameManager(canvas, SPHERE_RADIUS), 0)
	})

	let canvas: HTMLCanvasElement

	return (
		<div class={styles.App}>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default App
