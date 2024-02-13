import {Pool} from "pg"

const pool = new Pool({
  user: "postgres_user",
  host: 'localhost',
  database: 'ws_app_db',
  password: 'kadet0400',
  port: 5432,
})

export{pool}