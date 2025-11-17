import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/appError'
import { status as httpStatus } from 'http-status'

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    console.log('Auth Header:', token)

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access this resource.',
      )
    }
    next()
  })
}

export default auth
