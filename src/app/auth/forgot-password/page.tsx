'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <>
        <Alert type="success" className="mb-4">
          Si cet email est enregistré, un lien de réinitialisation vous a été envoyé.
        </Alert>
        <Link href="/auth/login" className="text-sm text-emerald-600 hover:underline">← Retour à la connexion</Link>
      </>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-fg mb-2">Mot de passe oublié</h2>
      <p className="text-sm text-fg-secondary mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="email" label="Adresse email" type="email" required placeholder="vous@exemple.com"
          value={email} onChange={e => setEmail(e.target.value)} />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Envoyer le lien
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/auth/login" className="text-sm text-emerald-600 hover:underline">← Retour à la connexion</Link>
      </div>
    </>
  )
}
