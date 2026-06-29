'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 8) { setError('Min. 8 caractères'); return }
    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: form.password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.success) { setError(data.error); return }
    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 2000)
  }

  if (!token) return <Alert type="error">Lien invalide.</Alert>

  return (
    <>
      <h2 className="text-2xl font-bold text-fg mb-6">Nouveau mot de passe</h2>
      {success && <Alert type="success" className="mb-4">Mot de passe mis à jour ! Redirection...</Alert>}
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="password" label="Nouveau mot de passe" type="password" required placeholder="Min. 8 caractères"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <Input id="confirm" label="Confirmer" type="password" required placeholder="••••••••"
            value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Réinitialiser</Button>
        </form>
      )}
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-sm text-emerald-600 hover:underline">← Retour à la connexion</Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
