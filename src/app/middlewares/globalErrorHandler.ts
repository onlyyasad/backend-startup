import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import AppError from '../errors/appError'
import { ZodError } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'

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
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  } else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  } else if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  } else if (error instanceof Error) {
    message = error.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  })
}

export default globalErrorHandler
