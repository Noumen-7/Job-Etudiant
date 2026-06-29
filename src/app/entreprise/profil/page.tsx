'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { SectionCard } from '@/components/profile/SectionCard'
import { Building2, Globe, Phone, MapPin, Mail, Briefcase } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const SECTEURS = ['Informatique', 'Finance & Banque', 'Commerce', 'Industrie', 'Santé', 'Éducation', 'Agriculture', 'Tourisme', 'Télécommunications', 'Autre']

interface Profil {
  nom: string; secteur: string; description: string; site: string; telephone: string; adresse: string; avatarUrl?: string | null
}

const selectClass = 'form-select'
const textareaClass = 'form-textarea resize-none'

export default function ProfilEntreprisePage() {
  const { user, refetch } = useAuth()
  const [profil, setProfil] = useState<Profil>({ nom: '', secteur: '', description: '', site: '', telephone: '', adresse: '', avatarUrl: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetch('/api/entreprise/profil').then(r => r.json()).then(d => {
      if (d.success && d.data) setProfil({
        nom: d.data.nom || '',
        secteur: d.data.secteur || '',
        description: d.data.description || '',
        site: d.data.site || '',
        telephone: d.data.telephone || '',
        adresse: d.data.adresse || '',
        avatarUrl: d.data.avatarUrl || null,
      })
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: keyof Profil) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setProfil(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/entreprise/profil', {
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

  const completionFields = [profil.nom, profil.secteur, profil.description, profil.telephone, profil.adresse, profil.site, profil.avatarUrl]
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">Profil entreprise</h1>
        <p className="text-fg-secondary mt-1">Présentez votre entreprise aux futurs candidats</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-6">
            <div className="card rounded-2xl p-8 text-center">
              <AvatarUpload
                name={profil.nom || 'Entreprise'}
                avatarUrl={profil.avatarUrl}
                uploadUrl="/api/entreprise/profil/avatar"
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
                <h3 className="font-bold text-fg text-lg">{profil.nom || 'Mon entreprise'}</h3>
                {profil.secteur && (
                  <p className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Briefcase size={14} className="text-emerald-500" />
                    {profil.secteur}
                  </p>
                )}
                {profil.adresse && (
                  <p className="flex items-center gap-2 text-sm text-fg-secondary">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                    {profil.adresse}
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
                Un profil complet inspire confiance aux candidats qui consultent vos offres.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            <SectionCard title="Informations générales" icon={Building2}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input id="nom" label="Nom de l'entreprise *" required value={profil.nom} onChange={set('nom')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Secteur d&apos;activité</label>
                  <select value={profil.secteur} onChange={set('secteur')} className={selectClass}>
                    <option value="">Sélectionner un secteur</option>
                    {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="form-label">Description</label>
                <textarea value={profil.description} onChange={set('description')} rows={5}
                  placeholder="Présentez votre entreprise, votre mission, votre culture..."
                  className={textareaClass} />
              </div>
            </SectionCard>

            <div className="grid sm:grid-cols-2 gap-6">
              <SectionCard title="Coordonnées" icon={Phone}>
                <div className="space-y-4">
                  <Input id="telephone" label="Téléphone" type="tel" placeholder="+261 20 00 000 00"
                    value={profil.telephone} onChange={set('telephone')} />
                  <Input id="adresse" label="Adresse" placeholder="Antananarivo, Madagascar"
                    value={profil.adresse} onChange={set('adresse')} />
                </div>
              </SectionCard>

              <SectionCard title="Présence web" icon={Globe}>
                <p className="text-sm text-fg-secondary mb-4">
                  Votre site web sera visible par les candidats intéressés par vos offres.
                </p>
                <Input id="site" label="Site web" type="url" placeholder="https://www.monentreprise.mg"
                  value={profil.site} onChange={set('site')} />
              </SectionCard>
            </div>

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
