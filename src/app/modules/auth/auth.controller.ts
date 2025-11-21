import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'
import { AuthService } from './auth.service'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData: TLoginUser = req.body

  const result = await AuthService.loginUserInDB(loginData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
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

export const AuthControllers = {
  loginUser,
  changePassword,
}
