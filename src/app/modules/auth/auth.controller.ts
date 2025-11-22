import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'
import { AuthService } from './auth.service'
import config from '../../config'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData: TLoginUser = req.body

  const result = await AuthService.loginUserInDB(loginData)
  const { refreshToken, accessToken, needsPasswordChange } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
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

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
}
