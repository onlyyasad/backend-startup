import AppError from '../../errors/appError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'

const loginUserInDB = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload.id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.')
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted.')
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked.')
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect.')
  }

  console.log(user)
}

export const AuthService = {
  loginUserInDB,
}
