import config from '../../config'
import AppError from '../../errors/appError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import { status as httpStatus } from 'http-status'
import { JwtPayload, SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils'
import jwt from 'jsonwebtoken'

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
    payload.password,
    user.password,
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect.')
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const changePasswordInDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData.id)
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
    payload.oldPassword,
    user.password,
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect.')
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    { id: userData.id, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshTokenInDB = async (token: string) => {
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to access this resource.',
    )
  }

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload

  const { id, iat } = decoded

  const user = await User.isUserExistsByCustomId(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.')
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted.')
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked.')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChange(iat as number, user.passwordChangedAt)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to access this resource.',
    )
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  )

  return {
    accessToken,
  }
}

export const AuthService = {
  loginUserInDB,
  changePasswordInDB,
  refreshTokenInDB,
}
