import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LandingPage } from '@/components/landing/LandingPage'

export default async function HomePage() {
  try {
    const user = await getCurrentUser()
    if (user?.role === 'ETUDIANT') redirect('/etudiant/accueil')
    if (user?.role === 'ENTREPRISE') redirect('/entreprise/dashboard')
  } catch {
    // visiteur non connecté → landing
  }

  return <LandingPage />
}
