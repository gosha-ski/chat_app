import {pool} from "../utils/postgres_connection"
import {checkRoom} from "./check_room"

async function checkUserInRoom(user_id:any, room_id:any){
	let room_user = (await pool.query(`SELECT * FROM rooms_users WHERE user_id='${user_id}' AND room_id='${room_id}'`)).rows[0]
	return room_user
}

export {checkUserInRoom}