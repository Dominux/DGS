import { Component } from 'solid-js'
import { useNavigate, useRoutes } from '@solidjs/router'
import { Card, CardActions, IconButton } from '@suid/material'
import { Home } from '@suid/icons-material'

import styles from './App.module.css'
import routes, { fullLocation } from './router'
import { BASENAME } from './constants'

const App: Component = () => {
	const Routes = useRoutes(routes, BASENAME)
	const navigate = useNavigate()

	return (
		<div class={styles.App}>
			<Card
				sx={{
					position: 'absolute',
					top: '1.5%',
					left: '1.5%',
					zIndex: 2,
					width: 'fit-content',
					borderRadius: '33%',
				}}
			>
				<CardActions sx={{ padding: 0 }}>
					<IconButton
						color="primary"
						onClick={() => navigate(fullLocation('/'))}
					>
						<Home fontSize="large" />
					</IconButton>
				</CardActions>
			</Card>

			<Routes />
		</div>
	)
}

export default App
