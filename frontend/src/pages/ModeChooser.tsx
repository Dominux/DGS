import { Component, children, JSX } from 'solid-js'
import { Card, CardContent, Stack } from '@suid/material'
import { A } from '@solidjs/router'

type ModeCardProps = {
	children: JSX.Element
}

const ModeCard: Component<ModeCardProps> = (props) => {
	return (
		<Card>
			<CardContent>{children(() => props.children)()}</CardContent>
		</Card>
	)
}

const ModeChooser: Component = () => {
	return (
		<Stack direction={'row'} spacing={4}>
			<ModeCard>
				<A href="/game/singleplayer">SinglePlayer</A>
			</ModeCard>
			<ModeCard>
				<A href="/game/multiplayer">MultiPlayer</A>
			</ModeCard>
		</Stack>
	)
}

export default ModeChooser
