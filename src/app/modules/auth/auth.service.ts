import { TLoginUser } from './auth.interface'

const loginUserInDB = async (payload: TLoginUser) => {
  // Implementation for user login
  console.log('Logging', payload)
}

export const AuthService = {
  loginUserInDB,
}
