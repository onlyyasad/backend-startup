import { NextFunction, Request, Response } from 'express'
import AppError from '../errors/appError'

const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.statusCode || 500
  const message = 'Something went wrong!'

  res.status(statusCode).json({
    success: false,
    message: error.message || message,
    error,
  })
}

export default globalErrorHandler
