import {WebSocket} from "ws"

interface CustomWebSocket{
	socket_id: string
	socket: WebSocket,
	room_id: string,
	user_id: string

}

export {CustomWebSocket}