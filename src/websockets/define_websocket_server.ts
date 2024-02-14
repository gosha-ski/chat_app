import * as ws from "ws"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
import {CustomWebSocket} from "../interfaces/custom_webSocket"
import {WebSocket} from "ws"
import * as http from "http"
import {pool} from "../utils/postgres_connection"


let CONNECTIONS: any[] = []

async function defineWebSocketServer(socket:WebSocket , request: http.IncomingMessage){
	let customWebSocket = await initSocket(socket, request)
	if(customWebSocket){
		sendLastMessages(customWebSocket)
		customWebSocket.socket.on("message", handleMessage(customWebSocket))
	}else{
		socket.close()
	}
}

async function initSocket(socket: WebSocket, request: http.IncomingMessage){
try{
	let token  = request.headers.authtoken as string
	let user:any
	if(token){
   		user = jwt.verify(token, "SECRET_KEY")
	}
	let url = request.url as string
	let room_id = url.split("/")[2]
	let room_user = (await pool.query(`SELECT * FROM rooms_users WHERE room_id='${room_id}' AND user_id='${user.user_id}'`)).rows[0]
	if(room_user){
		let customWebSocket: CustomWebSocket = {
			socket_id: uniqid(),
			room_id: room_id,
			user_id: user.user_id,
			socket: socket
		}

		CONNECTIONS.push(customWebSocket)

		return customWebSocket
	}
	return false

}catch(err){
	console.log(err)
}
}


function handleMessage(socket:CustomWebSocket){
	return function(data:any){
		for(let i=0; i<CONNECTIONS.length; i++){
			if(CONNECTIONS[i].room_id == socket.room_id){
				if(CONNECTIONS[i].socket_id != socket.socket_id){
					CONNECTIONS[i].socket.send(data.toString())
					pool.query(`INSERT INTO messages (message_id, user_id, room_id, data) VALUES
						('${uniqid()}', '${socket.user_id}', '${socket.room_id}', '${data.toString()}')`)
				}
			}
		}

	}

}


async function sendLastMessages(socket: CustomWebSocket){
	let messages = (await pool.query(`SELECT * FROM messages WHERE room_id='${socket.room_id}' LIMIT 10`)).rows
	for(let i=0; i<messages.length; i++){
		//console.log(messages[i])
		socket.socket.send(`${messages[i].user_id}:${messages[i].data}`)
	}
	//socket.socket.send(messages)
}


export {defineWebSocketServer}