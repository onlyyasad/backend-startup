import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import AppError from '../errors/appError'
import { ZodError } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'

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

const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Something went wrong!'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
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
