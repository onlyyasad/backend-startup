import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import AppError from '../errors/appError'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'

/**
 * Error Pattern:
 * @param success : string
 * @param message : string
 * @param errorSources: {
 * path: string,
 * message: string
 * }[]
 * @param stack : string Note: only for dev environment, not for production
 */

const globalErrorHandler: ErrorRequestHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Something went wrong!'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]

  const handleZodError = (error: ZodError) => {
    const statusCode = 400

    const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
      return {
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      }
    })
    return {
      statusCode,
      message: 'Zod Validation Error',
      errorSources,
    }
  }

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  })
}

export default globalErrorHandler
