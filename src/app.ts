import express, { Application } from 'express'
import userRouters from './routes/users.routes'
import 'express-async-errors'
import { handleErrors } from './error/error'

const app: Application = express()
app.use(express.json())

app.use(userRouters)

app.use(handleErrors)

export default app