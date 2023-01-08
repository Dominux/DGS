import { Component } from 'solid-js'

import styles from './App.module.css'

const ModeChooser: Component = () => {
	return (
		<div class={styles.App}>
			{/* Game Canvas */}
			<canvas ref={canvas} class={styles.canvas}></canvas>
		</div>
	)
}

export default ModeChooser
