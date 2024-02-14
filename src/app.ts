import * as express from "express"
import * as bodyParser from "body-parser"
import * as http from "http"
import * as ws from "ws"
import {defineWebSocketServer} from "./websockets/define_websocket_server"

class App{
	app
	port
	httpServer
	wsServer
	constructor(controllers: any[], port: number){
		this.app = express()
		this.port = port
		this.initMiddlewares()
		this.initControllers(controllers)
		this.httpServer = http.createServer(this.app)

		this.wsServer = new ws.WebSocketServer({
			server: this.httpServer
		})

		this.initWsServer()
	}

	initControllers(controllers:any[]){
		for(let i=0; i<controllers.length; i++){
			this.app.use("/", controllers[i].router)
		}
	}

	initMiddlewares(){
		this.app.use(bodyParser.json())
	}

	initWsServer(){
		this.wsServer.on("connection", defineWebSocketServer)
	}

	listen(){
		this.httpServer.listen(this.port, ()=>{
			console.log(`server works on port ${this.port}`)
		})
	}
}

export {App}