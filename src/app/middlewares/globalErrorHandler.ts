import { NextFunction, Request, Response } from 'express'

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500
  const message = 'Something went wrong!'

  res.status(statusCode).json({
    success: false,
    message: error.message || message,
    error,
  })
}

export default globalErrorHandler
