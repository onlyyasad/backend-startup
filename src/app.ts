import express, { Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'
import { UserRoutes } from './app/modules/user/user.route'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'

const app = express()

//parser
app.use(express.json())
app.use(cors())

//application routes

app.use('/api/v1', router)

const test = (req: Request, res: Response) => {
  const a = 'Hello World!'
  res.send(a)
}

app.get('/', test)

app.use(globalErrorHandler)

// not found route

app.use(notFound)

export default app
