'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { SectionCard } from '@/components/profile/SectionCard'
import { User, Link2, Mail, Briefcase, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { DefaultCvUpload } from '@/components/profile/DefaultCvUpload'

const DOMAINES = ['Informatique', 'Finance', 'Marketing', 'Commerce', 'Droit', 'Santé', 'Éducation', 'Design', 'Autre']

interface Profil {
  nom: string; prenom: string; telephone: string; description: string
  portfolio: string; linkedin: string; domaine: string; avatarUrl?: string | null
  cvUrl?: string | null
}

const selectClass = 'form-select'
const textareaClass = 'form-textarea resize-none'

export default function ProfilPage() {
  const { user, refetch } = useAuth()
  const [profil, setProfil] = useState<Profil>({ nom:'', prenom:'', telephone:'', description:'', portfolio:'', linkedin:'', domaine:'', avatarUrl: null, cvUrl: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetch('/api/etudiant/profil').then(r => r.json()).then(d => {
      if (d.success && d.data) setProfil(d.data)
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof Profil) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setProfil(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/etudiant/profil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profil),
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) {
      showToast('Profil mis à jour !')
      refetch()
    } else {
      showToast(data.error || 'Erreur lors de la sauvegarde', 'error')
    }
  }

  const displayName = `${profil.prenom} ${profil.nom}`.trim() || 'Mon profil'
  const completionFields = [profil.nom, profil.prenom, profil.domaine, profil.description, profil.telephone, profil.linkedin, profil.avatarUrl, profil.cvUrl]
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-80 skeleton rounded-2xl" />
          <div className="lg:col-span-8 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">Mon profil</h1>
        <p className="text-fg-secondary mt-1">Gérez vos informations visibles par les recruteurs</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="card rounded-2xl p-8 text-center">
              <AvatarUpload
                name={displayName}
                avatarUrl={profil.avatarUrl}
                uploadUrl="/api/etudiant/profil/avatar"
                onUploaded={url => {
                  setProfil(p => ({ ...p, avatarUrl: url }))
                  refetch()
                  showToast('Photo de profil mise à jour')
                }}
                onDeleted={() => {
                  setProfil(p => ({ ...p, avatarUrl: null }))
                  refetch()
                  showToast('Photo de profil supprimée')
                }}
              />
              <div className="mt-6 pt-6 border-t border-border-subtle text-left space-y-3">
                <h3 className="font-bold text-fg text-lg">{displayName}</h3>
                {profil.domaine && (
                  <p className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Briefcase size={14} className="text-emerald-500" />
                    {profil.domaine}
                  </p>
                )}
                {user?.email && (
                  <p className="flex items-center gap-2 text-sm text-fg-secondary truncate">
                    <Mail size={14} className="text-emerald-500 shrink-0" />
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
              <p className="text-sm font-medium text-emerald-100 mb-2">Complétion du profil</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-extrabold">{completion}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <p className="text-xs text-emerald-100/80 mt-3">
                Un profil complet augmente vos chances d&apos;être remarqué par les entreprises.
              </p>
            </div>
          </aside>

          {/* Formulaire */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard title="Informations personnelles" icon={User}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="nom" label="Nom" value={profil.nom} onChange={set('nom')} required />
                <Input id="prenom" label="Prénom" value={profil.prenom} onChange={set('prenom')} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Input id="telephone" label="Téléphone" type="tel" placeholder="+261 34 00 000 00" value={profil.telephone} onChange={set('telephone')} />
                <div>
                  <label className="form-label">Domaine</label>
                  <select value={profil.domaine} onChange={set('domaine')} className={selectClass}>
                    <option value="">Sélectionner un domaine</option>
                    {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label">Description / Bio</label>
                <textarea value={profil.description} onChange={set('description')} rows={5}
                  placeholder="Présentez-vous en quelques lignes..."
                  className={textareaClass} />
              </div>
            </SectionCard>

            <SectionCard title="Liens externes" icon={Link2}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="linkedin" label="LinkedIn" type="url" placeholder="https://linkedin.com/in/..." value={profil.linkedin} onChange={set('linkedin')} />
                <Input id="portfolio" label="Portfolio / GitHub" type="url" placeholder="https://github.com/..." value={profil.portfolio} onChange={set('portfolio')} />
              </div>
            </SectionCard>

            <SectionCard title="CV par défaut" icon={FileText}>
              <DefaultCvUpload
                cvUrl={profil.cvUrl}
                onUploaded={url => {
                  setProfil(p => ({ ...p, cvUrl: url }))
                  showToast('CV par défaut enregistré')
                }}
                onDeleted={() => {
                  setProfil(p => ({ ...p, cvUrl: null }))
                  showToast('CV par défaut supprimé')
                }}
              />
            </SectionCard>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" loading={saving}>Enregistrer les modifications</Button>
            </div>
          </div>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
