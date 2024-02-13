import {passport} from "../middlewares/passport_set"
import * as express from "express"
import {pool} from "../utils/postgres_connection"
import * as uniqid from "uniqid"

import * as jwt from "jsonwebtoken"
import {TokenData, DataInTokenJWT} from "../interfaces/token_interfaces"
import {User} from "../interfaces/user_interface"
import {createToken} from "../additional_functions/create_token"
import {createCookie} from "../additional_functions/create_cookie"


class AuthController{
	router = express.Router()
	path = "/auth"

	constructor(){
		this.initRoutes()
	}

	initRoutes(){
		this.router.post(`${this.path}/login`,  
			passport.authenticate('local', { failureRedirect: '/login', session: false }),
			this.login)

		this.router.post(`${this.path}/register`, this.register)
	}

	login(request: express.Request, response: express.Response){
		let user = request.user as User
		let token = createToken(user)
		response.setHeader("Set-Cookie", createCookie(token))
		response.send("successful logging in")

	}

	register(request: express.Request, response: express.Response){
		let userData:User = request.body.userData
		pool.query(`SELECT * FROM users WHERE email='${userData.email}'`).then(data=>{
			if(data.rows[0]){
				response.send("user already registed")
			}else{
				let id = uniqid()
				let email = userData.email
				let name = userData.name
				let password = userData.password 
			
				pool.query(`INSERT INTO users (id, email, name, password) VALUES
				 ('${id}', '${email}', '${name}', '${password}')` ).then(data=>{
				 	 response.send("user successful registed")
					})
			}
		})
	}
}

export {AuthController}