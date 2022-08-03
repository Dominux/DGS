import { Component, Show } from 'solid-js'

import IconButton from '@suid/material/IconButton'
import KeyboardDoubleArrowRightRounded from '@suid/icons-material/KeyboardDoubleArrowRightRounded'
import KeyboardDoubleArrowLeftRounded from '@suid/icons-material/KeyboardDoubleArrowLeftRounded'

export type ShowHideButtonProps = {
	isShowed: boolean
	onClick: Function
	class?: string
}

const ShowHideButton: Component<ShowHideButtonProps> = (props) => {
	return (
		<>
			<div class={props.class}>
				<IconButton component="span" onClick={() => props.onClick()}>
					<Show when={props.isShowed}>
						<KeyboardDoubleArrowRightRounded />
					</Show>
					<Show when={!props.isShowed}>
						<KeyboardDoubleArrowLeftRounded />
					</Show>
				</IconButton>
			</div>
		</>
	)
}

export default ShowHideButton
