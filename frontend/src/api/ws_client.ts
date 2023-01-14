import { User } from './models'

export default class WSClient {
	private socket: WebSocket

	constructor(addr: string, user: User, onMsg: Function) {
		this.socket = new WebSocket(addr)

		this.socket.onopen = (_) => {
			this.socket.send(`${user.id}:${user.secureId}`)
		}

		this.onMessage(onMsg)
	}

	private onMessage(onMessage: Function) {
		this.socket.onmessage = (e) => onMessage(e.data)
	}

	public sendMsg(msg: string) {
		this.socket.send(msg)
	}
}
