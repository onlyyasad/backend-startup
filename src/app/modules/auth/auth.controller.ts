import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'
import { AuthService } from './auth.service'
import config from '../../config'
import AppError from '../../errors/appError'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData: TLoginUser = req.body

  const result = await AuthService.loginUserInDB(loginData)
  const { refreshToken, accessToken, needsPasswordChange } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const { ...passwordData } = req.body
  const result = await AuthService.changePasswordInDB(user, passwordData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.refreshTokenInDB(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.id
  const result = await AuthService.forgetPasswordInDB(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      'If a user with that email exists, a password reset link has been sent.',
    data: result,
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to access this resource.',
    )
  }
  const result = await AuthService.resetPasswordInDB(req.body, token)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been reset successfully',
    data: result,
  })
})

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
}
