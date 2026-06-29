import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  role: 'ETUDIANT' | 'ENTREPRISE'
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload
}
