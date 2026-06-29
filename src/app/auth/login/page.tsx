'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { refetch } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.success) { setError(data.error); return }

    await refetch()
    router.push(data.data.role === 'ETUDIANT' ? '/etudiant/accueil' : '/entreprise/dashboard')
  }

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-emerald-600 transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Retour à l&apos;accueil
      </Link>

      <h2 className="text-2xl font-extrabold text-fg mb-6 tracking-tight">Connexion</h2>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email" label="Adresse email" type="email" required
          placeholder="vous@exemple.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Input
          id="password" label="Mot de passe" type="password" required
          placeholder="••••••••"
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-sm text-emerald-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Se connecter
        </Button>
      </form>
      <p className="text-center text-sm text-fg-secondary mt-6">
        Pas encore de compte ?{' '}
        <Link href="/auth/register" className="text-emerald-600 font-medium hover:underline">S&apos;inscrire</Link>
      </p>
    </>
  )
}
