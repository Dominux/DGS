import { Route, Routes } from '@solidjs/router'
import { Component, onMount } from 'solid-js'

import styles from './App.module.css'
import { SPHERE_RADIUS } from './constants'
import GameManager from './logic/game_manager'
import ModeChooser from './pages/ModeChooser'

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

			<div class={styles.UI}>
				<h1>LMAO</h1>
				<Routes>
					<Route path="/" component={ModeChooser} />
					<Route path="/game/singleplayer" element={<div>Lmao</div>} />
					<Route path="/game/multiplayer" element={<div>Lmao</div>} />
				</Routes>
			</div>
		</div>
	)
}

export default App
