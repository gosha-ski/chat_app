import * as express from "express"
import {passport} from "../middlewares/passport_jwt"
import {pool} from "../utils/postgres_connection"
import * as uniqid from "uniqid"
import {User} from "../interfaces/user_interface"
import {checkUserInRoom} from "../additional_functions/check_user_in_room"


class RoomsController{
	router = express.Router()
	path = "/rooms"

	constructor(){
		this.initRoutes()
	}

	initRoutes(){
		this.router.get(this.path, 
			passport.authenticate("jwt", {session: false}),
			this.getAllRooms)
		this.router.get(`${this.path}/:room_id`, 
			passport.authenticate("jwt", {session: false}),
			this.initActionWithRoom)
		this.router.post(this.path, 
			passport.authenticate("jwt", {session: false}),
			this.createRoom)
	}

	getAllRooms(request: express.Request, response: express.Response){
		pool.query(`SELECT * FROM rooms`).then(data=>{
			response.send(data.rows)
		})
		
	}

	getRoomById(request: express.Request, response: express.Response){}

	createRoom(request: express.Request, response: express.Response){
		let roomData = request.body.roomData

		pool.query(`INSERT INTO rooms (room_id, room_name) VALUES ('${uniqid()}', '${roomData.name}')`).then(data=>{
			response.send("room created")
		})

	}

	initActionWithRoom(request: express.Request, response: express.Response){
		let action = request.query.action
		let params = request.params
		let user: User = request.user as User
		//console.log(action)

		if(action == "join_room"){
			checkUserInRoom(user.id, params.room_id).then(room_user=>{
				//console.log(room_user)
				if(!room_user){
					pool.query(`INSERT INTO rooms_users (room_id, user_id) VALUES ('${params.room_id}', '${user.id}')`)
					.then(data=>{
						response.send("ok join")
					})
				}else{
					response.send("already joined")
				}
			})
		}else if(action=="leave_room"){
			checkUserInRoom(user.id, params.room_id).then(room_user=>{
				//console.log(room_user)
				if(room_user){
					pool.query(`DELETE FROM rooms_users WHERE room_id='${params.room_id}' AND user_id='${user.id}'`)
					.then(data=>{
						response.send("ok left")
					})
				}else{
					response.send("already left")
				}
			})

		}else{
			response.send("unknownn action")
		}

	}
}

export {RoomsController}