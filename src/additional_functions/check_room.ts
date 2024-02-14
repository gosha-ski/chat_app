import {pool} from "../utils/postgres_connection"

async function checkRoom(room_id:any){
	let room = (await pool.query(`SELECT * FROM rooms WHERE room_id='${room_id}'`)).rows[0]
	//console.log(room)
	return room
}

export {checkRoom}