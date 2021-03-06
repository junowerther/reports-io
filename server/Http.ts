import "reflect-metadata"
import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import { createConnection } from "typeorm"
import next from "next"

import { Firebase } from "@Providers/Firebase"
import { ErrorServerConnection } from "@Provider:Errors/Server"
import { Routes as UserRouter } from "@Server:Routes/Users"
import { Routes as AuthRouter } from "@Server:Routes/Auth"

const environment = process.env.NODE_ENV !== "production"
const app = next({ dev: environment })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Handle method execution
function Exec() {
  return (Target: { new(): Server }) => {
    new Target()
      .connect()
      .then((status) => status)
      .catch((error) => new ErrorServerConnection(error))
  }
}

@Exec()
export class Server {
  public async connect() {
    try {
      await app.prepare()
      const server = express()
        .use(bodyParser.json({ limit: "2mb" }))
        .use(bodyParser.urlencoded({ extended: true }))

      // User routes
      server.use("/users", UserRouter)
      server.use("/auth", AuthRouter)

      // Bind next handler to express
      server.all("*", (request: Request, response: Response) => {
        return handle(request, response)
      })

      server.listen(port, async (error?: Error) => {
        console.log('------------------------------')
        await createConnection().then(res => console.log('DATABASE:', res.isConnected))
        await Firebase.createConnection().then(res => console.log(res && 'FIREBASE:', true))
        console.log('------------------------------')

        if (error) throw new ErrorServerConnection(error)
      })
    } catch (error) {
      throw new ErrorServerConnection(error)
    }
  }
}
