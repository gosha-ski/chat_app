import {AuthController} from "./controllers/auth_controller"
import {App} from "./app"

let app = new App([ new AuthController()], 4000)
app.listen()
