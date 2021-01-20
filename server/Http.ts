import express, { Request, Response } from "express"
import { ErrorServerConnection } from "@Provider:Errors/Server"
import next from "next"

const environment = process.env.NODE_ENV !== "production"
const app = next({ dev: environment })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Handle method execution
function Exec() {
  return (Target: { new (): Server }) => {
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

      // Bind next handler to express
      server.all("*", (request: Request, response: Response) => {
        return handle(request, response)
      })

      server.listen(port, (error?: Error) => {
        if (error) throw new ErrorServerConnection(error)
      })
    } catch (error) {
      throw new ErrorServerConnection(error)
    }
  }
}