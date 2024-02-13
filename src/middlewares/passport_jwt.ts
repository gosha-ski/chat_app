import * as express from "express"
import * as bodyParser from "body-parser"
import {pool} from "../utils/postgres_connection"
import * as passport from "passport"
import * as jwt from "jsonwebtoken"

let JwtStrategy = require('passport-jwt').Strategy

let opts:any={}

function extra(request:any){
	//console.log(request.headers.authtoken)
	return request.headers.authtoken
}

opts.jwtFromRequest = extra
opts.secretOrKey = "SECRET_KEY"
opts.ignoreExpiration = true

passport.use(new JwtStrategy(opts, function(jwt_payload:any, done:any){
	let user_id = jwt_payload.user_id
	pool.query(`SELECT * FROM users WHERE id='${user_id}'`).then((data:any)=>{
		let user = data.rows[0]
		if(user){
			return done(null, user)
		}else{
			return done(null, false)
		}
	})
}))


export {passport}