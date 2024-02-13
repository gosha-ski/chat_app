import * as passport from "passport"
let LocalStrategy = require('passport-local').Strategy;
import {pool} from "../utils/postgres_connection"

passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
   function(email:string, password:string, done:any) {
    pool.query(`SELECT * FROM users WHERE email='${email}'`).then((data:any)=>{
    	let user = data.rows[0]
    	if(!user){ 
    		return done(null, false)
    	}else{
    		return done(null, user)
    	}
    })
  }
));


export {passport}

