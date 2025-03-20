import { NextFunction, Request, Response } from 'express'
import { status as httpStatus } from 'http-status'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = httpStatus.NOT_FOUND
  const message = 'API Not Found'

  res.status(statusCode).json({
    success: false,
    message: message,
    error: '',
  })
}

export default notFound
