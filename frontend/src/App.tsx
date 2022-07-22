import { Component, onMount } from 'solid-js'

import styles from './App.module.css'
import Playground from './sphere'

const App: Component = () => {
	let canvas: HTMLCanvasElement
	onMount(() => {
		Playground.createScene(canvas)
	})

	return (
		<div class={styles.App}>
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default App
