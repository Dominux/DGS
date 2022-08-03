import { Component } from 'solid-js'

import ListItem from '@suid/material/ListItem'
import { blueGrey, red } from '@suid/material/colors'

import styles from '../App.module.css'

export type PlayersBarItemProps = {
	color: string
	score: number
	isTurn: boolean
	class?: string
}

const PlayersBarItem: Component<PlayersBarItemProps> = (props) => {
	return (
		<>
			<ListItem disablePadding>
				<div
					class={`${styles.playersBarItem} ${props.class}`}
					style={{
						'background-color': props.isTurn ? red[300] : blueGrey[100],
					}}
				>
					<h3 class={styles.score}>{props.score}</h3>
					<div>
						<div
							class={styles.stoneAvatar}
							style={{ 'background-color': props.color }}
						></div>
					</div>
				</div>
			</ListItem>
		</>
	)
}

export default PlayersBarItem
