'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Etudiant { id: string; nom: string; prenom: string; domaine?: string; avatarUrl?: string | null }
interface Entreprise { id: string; nom: string; secteur?: string; avatarUrl?: string | null }

export interface AuthUser {
  id: string
  email: string
  role: 'ETUDIANT' | 'ENTREPRISE'
  etudiant?: Etudiant | null
  entreprise?: Entreprise | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getRouteSegment(pathname: string) {
  if (pathname.startsWith('/auth')) return 'auth'
  if (pathname.startsWith('/etudiant')) return 'etudiant'
  if (pathname.startsWith('/entreprise')) return 'entreprise'
  return 'other'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isInitialMount = useRef(true)
  const lastSegment = useRef<string | null>(null)

  const fetchUser = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true)
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) setUser(data.data)
      else setUser(null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Resynchronise l'état auth quand on change de zone (auth / étudiant / entreprise)
  useEffect(() => {
    const segment = getRouteSegment(pathname)
    const segmentChanged = lastSegment.current !== segment
    lastSegment.current = segment

    const silent = !isInitialMount.current
    isInitialMount.current = false

    if (segmentChanged) {
      fetchUser({ silent })
    }
  }, [pathname, fetchUser])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    router.push('/auth/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, logout, refetch: () => fetchUser({ silent: true }) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
