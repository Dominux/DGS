import {
	MOVE_RESULT_CHECK_INTERVAL_MS,
	RECONNECT_TIMEOUT_MS,
} from '../constants'
import { User } from './models'

export default class WSClient {
	private socket: WebSocket
	messages: MessageQueue<any>

	constructor(addr: string, user: User) {
		this.messages = new MessageQueue()
		this.socket = new WebSocket(addr)

		this.socket.onopen = (_) => {
			this.socket.send(`${user.id}:${user.secure_id}`)
		}
		this.socket.onerror = (e) => {
			console.log(e)
		}
		this.socket.onclose = (e) => {
			console.log(e)
			this.reconnect(addr, user)
		}

		this.socket.onmessage = (e) => {
			this.messages.push(e.data)
		}
	}

	private reconnect(addr: string, user: User) {
		const job = setInterval(() => {
			console.log('trying to reconnect')
			this.socket = new WSClient(addr, user).socket
			clearInterval(job)
		}, RECONNECT_TIMEOUT_MS)
	}

	public sendMsg(msg: string) {
		this.socket.send(msg)
	}

	public async waitForMsg(): Promise<any> {
		let msg = undefined
		while (msg === undefined) {
			await new Promise((resolve) =>
				setTimeout(resolve, MOVE_RESULT_CHECK_INTERVAL_MS)
			)

			msg = this.messages.pop()
		}

		return msg
	}
}

class MessageQueue<T> {
	protected queue: Array<T> = []

	push(msg: T) {
		this.queue.push(msg)
	}

	pop(): T | undefined {
		return this.queue.pop()
	}
}
