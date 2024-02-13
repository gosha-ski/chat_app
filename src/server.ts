import {AuthController} from "./controllers/auth_controller"
import {RoomsController} from "./controllers/rooms_controller"
import {App} from "./app"

let app = new App([ new AuthController(), new RoomsController()], 4000)
app.listen()
