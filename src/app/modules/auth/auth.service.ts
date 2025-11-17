import AppError from '../../errors/appError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'
import bcrypt from 'bcrypt'

const loginUserInDB = async (payload: TLoginUser) => {
  const isUserExists = await User.findOne({ id: payload?.id })
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.')
  }

  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted.')
  }

  if (isUserExists.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked.')
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists.password,
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect.')
  }

  console.log(isUserExists)
}

export const AuthService = {
  loginUserInDB,
}
