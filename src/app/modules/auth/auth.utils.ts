import jwt, { SignOptions } from 'jsonwebtoken'

export const createToken = (
  jwtPayload: { id: string; role: string },
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => {
  const token = jwt.sign(jwtPayload, secret, {
    expiresIn,
  })

  return token
}
