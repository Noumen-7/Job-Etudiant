import { cookies } from 'next/headers'
import { verifyToken, JWTPayload } from './jwt'

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non authentifié')
  return user
}

export async function requireRole(role: 'ETUDIANT' | 'ENTREPRISE'): Promise<JWTPayload> {
  const user = await requireAuth()
  if (user.role !== role) throw new Error('Accès refusé')
  return user
}
