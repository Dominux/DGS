import { Component, For } from 'solid-js'
import { Button, Card, CardActions, Stack, Typography } from '@suid/material'

import styles from '../App.module.css'

export type ModeCardProps = {
	label: string
	onClick: Function
}

const ModeCard: Component<ModeCardProps> = (props) => {
	return (
		<Card>
			<CardActions>
				<Button onClick={() => props.onClick()} sx={{ padding: '10%' }}>
					<Typography fontSize={54}>{props.label}</Typography>
				</Button>
			</CardActions>
		</Card>
	)
}

export type ModeChooserProps = {
	modes: Array<ModeCardProps>
}

const ModeChooser: Component<ModeChooserProps> = (props) => {
	return (
		<div class={styles.mode_chooser}>
			<Stack direction={'row'} spacing={6}>
				<For each={props.modes}>
					{(mode) => (
						<ModeCard label={mode.label} onClick={mode.onClick}></ModeCard>
					)}
				</For>
			</Stack>
		</div>
	)
}

export default ModeChooser
