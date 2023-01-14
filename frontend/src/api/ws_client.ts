import { User } from './models'

export default class WSClient {
	private socket: WebSocket
	messages: MessageQueue<any>

	constructor(addr: string, user: User, onMsg: Function) {
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
		}

		this.onMessage(onMsg)
	}

	private onMessage(onMessage: Function) {
		this.socket.onmessage = (e) => {
			this.messages.push(e.data)
			onMessage()
		}
	}

	public sendMsg(msg: string) {
		this.socket.send(msg)
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
