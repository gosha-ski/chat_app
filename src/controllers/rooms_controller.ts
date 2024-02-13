import * as express from "express"
import {passport} from "../middlewares/passport_jwt"
import {pool} from "../utils/postgres_connection"
import * as uniqid from "uniqid"


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
		this.router.get(`${this.path}/:room_id`, this.getRoomById)
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
}

export {RoomsController}