'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, Briefcase, Clock, Upload, X, ChevronDown, ChevronUp,
  CheckCircle2, Building2, Filter, RotateCcw, Send, CheckCheck, XCircle,
  FileText, CalendarClock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { getCvDisplayName } from '@/lib/cv.client'
import { formatOffreDateFin, daysUntilExpiry } from '@/lib/offre'
import { cn } from '@/lib/utils'

const DOMAINES = ['Informatique', 'Finance', 'Marketing', 'Commerce', 'Droit', 'Santé', 'Éducation', 'Design', 'Autre']

type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'

const statutCandidatureConfig: Record<StatutCandidature, { label: string; className: string; icon: typeof Clock }> = {
  EN_ATTENTE: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  ACCEPTE: { label: 'Acceptée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  REFUSE: { label: 'Refusée', className: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
}

interface Offre {
  id: string
  titre: string
  description: string
  domaine: string
  type: string
  lieu?: string
  remuneration?: string
  createdAt: string
  dateFin?: string | null
  entreprise: { nom: string; secteur?: string; avatarUrl?: string | null }
}

function OffreCard({ offre, candidatureStatut, onPostuler }: {
  offre: Offre
  candidatureStatut?: StatutCandidature
  onPostuler: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const dejaPostule = Boolean(candidatureStatut)
  const date = new Date(offre.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const joursRestants = daysUntilExpiry(offre)
  const statutCfg = candidatureStatut ? statutCandidatureConfig[candidatureStatut] : null
  const StatutIcon = statutCfg?.icon

  return (
    <article className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
      dejaPostule
        ? 'bg-muted border-border opacity-95'
        : 'card hover:shadow-md hover:border-emerald-200/80 dark:hover:border-emerald-800/50'
    }`}>
      <div className="p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                dejaPostule ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {offre.type}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted text-fg-secondary rounded-lg">
                {offre.domaine}
              </span>
              {dejaPostule && statutCfg && StatutIcon && (
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${statutCfg.className}`}>
                  <StatutIcon size={12} />
                  {statutCfg.label}
                </span>
              )}
            </div>

            <h3 className={`font-bold text-lg leading-snug pr-1 ${dejaPostule ? 'text-fg-secondary' : 'text-fg'}`}>
              {offre.titre}
            </h3>

            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-fg-secondary">
              <Building2 size={14} className="text-emerald-500 shrink-0" />
              <span className="font-medium text-fg truncate">{offre.entreprise.nom}</span>
              {offre.entreprise.secteur && (
                <>
                  <span className="text-fg-muted">·</span>
                  <span className="truncate">{offre.entreprise.secteur}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-fg-muted">
              {offre.lieu && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-500" />
                  {offre.lieu}
                </span>
              )}
              {offre.remuneration && (
                <span className="flex items-center gap-1">
                  <Briefcase size={12} className="text-emerald-500" />
                  {offre.remuneration}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Publiée {date}
              </span>
              <span className={`flex items-center gap-1 ${joursRestants <= 7 ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}`}>
                <CalendarClock size={12} />
                {joursRestants <= 0
                  ? 'Expire aujourd\'hui'
                  : joursRestants === 1
                    ? 'Expire demain'
                    : `Expire le ${formatOffreDateFin(offre)}`}
              </span>
            </div>

            {!expanded && (
              <p className="mt-3 text-sm text-fg-secondary line-clamp-2 leading-relaxed">
                {offre.description}
              </p>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 pt-0.5">
            <ProfileAvatar
              src={offre.entreprise.avatarUrl}
              name={offre.entreprise.nom}
              size="lg"
              className={dejaPostule ? 'ring-stone-200 opacity-80' : 'ring-emerald-100'}
            />
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-sm text-fg-secondary whitespace-pre-line leading-relaxed mb-5">
              {offre.description}
            </p>
            {dejaPostule ? (
              <Button disabled className="gap-2 cursor-not-allowed" variant="secondary">
                <CheckCheck size={16} />
                Candidature déjà envoyée
              </Button>
            ) : (
              <Button onClick={() => onPostuler(offre.id)} className="gap-2">
                <Send size={16} />
                Postuler à cette offre
              </Button>
            )}
          </div>
        )}
      </div>

      <div className={`flex items-center justify-between px-5 sm:px-6 py-3 border-t ${
        dejaPostule ? 'bg-muted/80 border-border' : 'bg-muted/70 border-border-subtle'
      }`}>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-sm font-medium text-fg-secondary hover:text-emerald-700 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Réduire' : 'Voir le détail'}
        </button>
        {!expanded && (
          dejaPostule ? (
            <Button size="sm" disabled className="gap-1.5 cursor-not-allowed" variant="secondary">
              <CheckCheck size={14} />
              Déjà postulé
            </Button>
          ) : (
            <Button size="sm" onClick={() => onPostuler(offre.id)} className="gap-1.5">
              <Send size={14} />
              Postuler
            </Button>
          )
        )}
      </div>
    </article>
  )
}

function PostulerModal({ offreId, offres, onClose, onSuccess }: {
  offreId: string
  offres: Offre[]
  onClose: () => void
  onSuccess: () => void
}) {
  const offre = offres.find(o => o.id === offreId)
  const [defaultCvUrl, setDefaultCvUrl] = useState<string | null>(null)
  const [loadingProfil, setLoadingProfil] = useState(true)
  const [cvMode, setCvMode] = useState<'default' | 'custom'>('default')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/etudiant/profil')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.cvUrl) {
          setDefaultCvUrl(d.data.cvUrl)
          setCvMode('default')
        } else {
          setCvMode('custom')
        }
      })
      .finally(() => setLoadingProfil(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cvMode === 'default' && !defaultCvUrl) {
      setError('Aucun CV par défaut — importez-en un ci-dessous ou ajoutez-en un dans votre profil')
      return
    }
    if (cvMode === 'custom' && !file) {
      setError('Veuillez joindre votre CV')
      return
    }
    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('offreId', offreId)
    fd.append('message', message)
    if (cvMode === 'default') {
      fd.append('useDefaultCv', 'true')
    } else {
      fd.append('cv', file!)
    }

    const res = await fetch('/api/etudiant/candidatures', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)

    if (!data.success) { setError(data.error); return }
    onSuccess()
    onClose()
  }

  return (
    <div className="modal-overlay p-4">
      <div className="modal-panel rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="modal-header items-start p-6">
          <div>
            <h3 className="font-bold text-fg">Postuler à cette offre</h3>
            {offre && (
              <p className="text-sm text-fg-secondary mt-1 line-clamp-1">{offre.titre}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-fg-muted hover:bg-muted">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <Alert type="error">{error}</Alert>}

          <div>
            <label className="form-label">CV *</label>

            {loadingProfil ? (
              <div className="h-24 skeleton rounded-xl border border-border-subtle" />
            ) : (
              <div className="space-y-2">
                {defaultCvUrl && (
                  <label
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                      cvMode === 'default'
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-border hover:border-emerald-200'
                    )}
                  >
                    <input
                      type="radio"
                      name="cvMode"
                      checked={cvMode === 'default'}
                      onChange={() => setCvMode('default')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">Utiliser mon CV par défaut</p>
                      <p className="text-xs text-fg-secondary mt-0.5 flex items-center gap-1 truncate">
                        <FileText size={12} className="text-emerald-500 shrink-0" />
                        {getCvDisplayName(defaultCvUrl)}
                      </p>
                    </div>
                  </label>
                )}

                <label
                  className={cn(
                    'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                    cvMode === 'custom'
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-border hover:border-emerald-200'
                  )}
                >
                  <input
                    type="radio"
                    name="cvMode"
                    checked={cvMode === 'custom'}
                    onChange={() => setCvMode('custom')}
                    className="mt-1 accent-emerald-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-fg">Importer un autre CV</p>
                    <p className="text-xs text-fg-secondary mt-0.5">PDF uniquement, pour cette candidature</p>
                  </div>
                </label>

                {!defaultCvUrl && (
                  <p className="text-xs text-fg-muted px-1">
                    Pas de CV par défaut ?{' '}
                    <Link href="/etudiant/profil" className="text-emerald-600 font-medium hover:underline">
                      Enregistrez-en un dans votre profil
                    </Link>
                  </p>
                )}
              </div>
            )}

            {cvMode === 'custom' && !loadingProfil && (
              <label className="flex flex-col items-center justify-center w-full h-28 mt-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-accent-soft transition-all">
                <Upload size={20} className="text-emerald-500 mb-1.5" />
                <span className="text-sm text-fg-secondary font-medium">
                  {file ? file.name : 'Choisir un fichier PDF'}
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          <div>
            <label className="form-label">Message de motivation (optionnel)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Présentez-vous brièvement..."
              className="form-textarea resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1" loading={loading}>Envoyer</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OffreCardSkeleton() {
  return (
    <div className="card rounded-2xl p-5 sm:p-6 skeleton">
      <div className="flex gap-5">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-lg" />
            <div className="h-6 w-24 bg-muted rounded-lg" />
          </div>
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
        <div className="w-24 h-24 bg-muted rounded-full shrink-0" />
      </div>
    </div>
  )
}

export default function MetierPage() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [candidaturesParOffre, setCandidaturesParOffre] = useState<Record<string, StatutCandidature>>({})
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [domaine, setDomaine] = useState('')
  const [postulerId, setPostulerId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const fetchCandidatures = useCallback(async () => {
    const res = await fetch('/api/etudiant/candidatures')
    const data = await res.json()
    if (data.success) {
      const map: Record<string, StatutCandidature> = {}
      for (const c of data.data as { offreId: string; statut: StatutCandidature }[]) {
        map[c.offreId] = c.statut
      }
      setCandidaturesParOffre(map)
    }
  }, [])

  useEffect(() => { fetchCandidatures() }, [fetchCandidatures])

  // Debounce recherche
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchOffres = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (domaine) params.set('domaine', domaine)
    const res = await fetch(`/api/offres?${params}`)
    const data = await res.json()
    if (data.success) setOffres(data.data)
    setLoading(false)
  }, [search, domaine])

  useEffect(() => { fetchOffres() }, [fetchOffres])

  const hasFilters = searchInput || domaine
  const clearFilters = () => { setSearchInput(''); setDomaine('') }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
          Offres disponibles
        </h1>
        <p className="text-fg-secondary mt-1">
          Parcourez les opportunités publiées par les entreprises partenaires.
        </p>
      </div>

      {/* Filtres */}
      <div className="filter-panel p-4 sm:p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-fg">
          <Filter size={16} className="text-emerald-600" />
          Filtrer les offres
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              placeholder="Mots-clés, titre, description..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-fg placeholder:text-fg-muted"
            />
          </div>
          <select
            value={domaine}
            onChange={e => setDomaine(e.target.value)}
            className="form-select sm:min-w-[200px]"
          >
            <option value="">Tous les domaines</option>
            {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-fg-secondary hover:text-emerald-700 hover:bg-accent-soft rounded-xl border border-border transition-all"
            >
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Compteur résultats */}
      {!loading && (
        <p className="text-sm text-fg-secondary mb-4">
          <span className="font-semibold text-fg">{offres.length}</span>
          {' '}offre{offres.length !== 1 ? 's' : ''} trouvée{offres.length !== 1 ? 's' : ''}
          {hasFilters && ' pour votre recherche'}
        </p>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <OffreCardSkeleton key={i} />)}
        </div>
      ) : offres.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Briefcase size={28} className="text-emerald-500" />
          </div>
          <p className="font-semibold text-fg mb-1">Aucune offre trouvée</p>
          <p className="text-sm text-fg-secondary mb-4">
            {hasFilters ? 'Essayez d\'élargir vos critères de recherche.' : 'Revenez bientôt, de nouvelles offres arrivent régulièrement.'}
          </p>
          {hasFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters} className="gap-1.5">
              <RotateCcw size={14} />
              Effacer les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {offres.map(o => (
            <OffreCard
              key={o.id}
              offre={o}
              candidatureStatut={candidaturesParOffre[o.id]}
              onPostuler={setPostulerId}
            />
          ))}
        </div>
      )}

      {postulerId && (
        <PostulerModal
          offreId={postulerId}
          offres={offres}
          onClose={() => setPostulerId(null)}
          onSuccess={() => {
            if (postulerId) {
              setCandidaturesParOffre(prev => ({ ...prev, [postulerId]: 'EN_ATTENTE' }))
            }
            showToast('Candidature envoyée avec succès !')
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}
