import { Component } from 'solid-js'
import { useRoutes } from '@solidjs/router'

import styles from './App.module.css'
import routes from './router'
import { PREFIX_PATH } from './constants'

const App: Component = () => {
	const Routes = useRoutes(routes, PREFIX_PATH)

	return (
		<div class={styles.App}>
			<Routes />
		</div>
	)
}

export default App
