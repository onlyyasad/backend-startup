import express, { Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/config/modules/student/student.route'

const app = express()

//parser
app.use(express.json())
app.use(cors())

//application routes

app.use('/api/v1/students', StudentRoutes)

app.get('/', (req: Request, res: Response) => {
  const a = 'Hello World!'
  res.send(a)
})

export default app
