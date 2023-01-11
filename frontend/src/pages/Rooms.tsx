import { Component, onMount } from 'solid-js'
import { checkAuth } from '../auth'

const RoomsPage: Component = () => {
	onMount(() => {
		checkAuth()
	})

	return <h1>Rooms</h1>
}

export default RoomsPage
