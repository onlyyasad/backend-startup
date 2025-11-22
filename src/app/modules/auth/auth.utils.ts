import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

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

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload
}
