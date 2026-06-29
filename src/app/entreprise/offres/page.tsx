'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users, ToggleLeft, ToggleRight, X, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { getDefaultDateFinInputValue, formatOffreDateFin, isOffreExpired } from '@/lib/offre'

const DOMAINES = ['Informatique', 'Finance', 'Marketing', 'Commerce', 'Droit', 'Santé', 'Éducation', 'Design', 'Autre']
const TYPES = ['Stage', 'CDD', 'CDI', 'Freelance', 'Alternance', 'Bénévolat']

interface Offre {
  id: string; titre: string; description: string; domaine: string; type: string
  lieu?: string; remuneration?: string; isActive: boolean; createdAt: string
  dateFin?: string | null
  _count: { candidatures: number }
}

const emptyForm = {
  titre: '', description: '', domaine: '', type: 'Stage', lieu: '', remuneration: '',
  dateFin: getDefaultDateFinInputValue(30),
}

function toFormDate(dateFin?: string | null, createdAt?: string): string {
  if (dateFin) return new Date(dateFin).toISOString().split('T')[0]
  if (createdAt) {
    const d = new Date(createdAt)
    d.setDate(d.getDate() + 90)
    return d.toISOString().split('T')[0]
  }
  return getDefaultDateFinInputValue(30)
}

function OffreModal({ offre, onClose, onSave }: { offre: Partial<Offre> | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState(offre?.id ? {
    titre: offre.titre || '', description: offre.description || '', domaine: offre.domaine || '',
    type: offre.type || 'Stage', lieu: offre.lieu || '', remuneration: offre.remuneration || '',
    dateFin: toFormDate(offre.dateFin, offre.createdAt),
  } : emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const url = offre?.id ? `/api/entreprise/offres/${offre.id}` : '/api/entreprise/offres'
    const method = offre?.id ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (!data.success) { setError(data.error); return }
    onSave(); onClose()
  }

  return (
    <div className="modal-overlay p-4">
      <div className="modal-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="modal-header sticky top-0">
          <h3 className="font-semibold text-fg">{offre?.id ? 'Modifier l\'offre' : 'Nouvelle offre'}</h3>
          <button onClick={onClose}><X size={20} className="text-fg-muted" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <Alert type="error">{error}</Alert>}
          <Input id="titre" label="Titre du poste *" required value={form.titre} onChange={set('titre')} placeholder="Ex: Développeur web junior" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Domaine *</label>
              <select value={form.domaine} onChange={set('domaine')} required
                className="form-select">
                <option value="">Choisir...</option>
                {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Type *</label>
              <select value={form.type} onChange={set('type')}
                className="form-select">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea value={form.description} onChange={set('description')} rows={5} required
              placeholder="Décrivez le poste, les missions, les compétences requises..."
              className="form-textarea" />
          </div>
          <div>
            <label className="form-label">Date de fin *</label>
            <input
              type="date"
              value={form.dateFin}
              onChange={set('dateFin')}
              required
              min={getDefaultDateFinInputValue(0)}
              className="form-select"
            />
            <p className="text-xs text-fg-muted mt-1">L&apos;offre ne sera plus visible après cette date.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="lieu" label="Lieu" value={form.lieu} onChange={set('lieu')} placeholder="Antananarivo" />
            <Input id="remuneration" label="Rémunération" value={form.remuneration} onChange={set('remuneration')} placeholder="Ex: 200 000 MGA" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1" loading={loading}>{offre?.id ? 'Modifier' : 'Publier'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [entrepriseProfil, setEntrepriseProfil] = useState<{ nom: string; avatarUrl?: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; offre: Partial<Offre> | null }>({ open: false, offre: null })

  const fetchOffres = async () => {
    const [offresRes, profilRes] = await Promise.all([
      fetch('/api/entreprise/offres'),
      fetch('/api/entreprise/profil'),
    ])
    const [offresData, profilData] = await Promise.all([offresRes.json(), profilRes.json()])
    if (offresData.success) setOffres(offresData.data)
    if (profilData.success) setEntrepriseProfil({ nom: profilData.data.nom, avatarUrl: profilData.data.avatarUrl })
    setLoading(false)
  }

  useEffect(() => { fetchOffres() }, [])

  const toggleActive = async (offre: Offre) => {
    await fetch(`/api/entreprise/offres/${offre.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...offre, isActive: !offre.isActive }),
    })
    fetchOffres()
  }

  const deleteOffre = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return
    await fetch(`/api/entreprise/offres/${id}`, { method: 'DELETE' })
    fetchOffres()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-fg">Mes offres</h1>
        <Button onClick={() => setModal({ open: true, offre: null })}>
          <Plus size={16} className="mr-1.5" /> Nouvelle offre
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
      ) : offres.length === 0 ? (
        <div className="empty-state">
          <p className="mb-4">Aucune offre publiée</p>
          <Button onClick={() => setModal({ open: true, offre: null })}>Publier ma première offre</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {offres.map(o => {
            const expired = isOffreExpired(o)
            return (
            <div key={o.id} className={`card rounded-xl p-5 ${!o.isActive || expired ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start gap-4">
                {entrepriseProfil && (
                  <div className="shrink-0 pt-0.5">
                    <ProfileAvatar
                      src={entrepriseProfil.avatarUrl}
                      name={entrepriseProfil.nom}
                      size="lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-accent-soft text-accent-soft-fg rounded-full font-medium">{o.type}</span>
                    <span className="text-xs text-fg-muted">{o.domaine}</span>
                    {!o.isActive && <span className="text-xs px-2 py-0.5 bg-muted text-fg-secondary rounded-full">Inactif</span>}
                    {expired && <span className="text-xs px-2 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-full">Expirée</span>}
                  </div>
                  <h3 className="font-semibold text-fg">{o.titre}</h3>
                  {o.lieu && <p className="text-sm text-fg-secondary mt-0.5">{o.lieu}</p>}
                  <p className="text-xs text-fg-muted mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <CalendarClock size={11} />
                      Fin : {formatOffreDateFin(o)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {o._count.candidatures} candidature{o._count.candidatures > 1 ? 's' : ''}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(o)} className="p-2 text-fg-muted hover:text-emerald-600 transition-colors" title={o.isActive ? 'Désactiver' : 'Activer'}>
                    {o.isActive ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                  </button>
                  <button onClick={() => setModal({ open: true, offre: o })} className="p-2 text-fg-muted hover:text-emerald-600 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteOffre(o.id)} className="p-2 text-fg-muted hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}

      {modal.open && (
        <OffreModal offre={modal.offre} onClose={() => setModal({ open: false, offre: null })} onSave={fetchOffres} />
      )}
    </div>
  )
}
