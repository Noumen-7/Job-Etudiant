'use client'
import { useState, useEffect } from 'react'
import { FileText, CheckCircle, XCircle, Clock, ExternalLink, Phone, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { PdfViewerModal } from '@/components/cv/PdfViewerModal'

type Statut = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'

interface Candidature {
  id: string; statut: Statut; createdAt: string; message?: string; cvUrl: string
  etudiant: { nom: string; prenom: string; domaine?: string; telephone?: string; linkedin?: string; portfolio?: string; avatarUrl?: string | null }
  offre: { titre: string; type: string }
}

const statutConfig = {
  EN_ATTENTE: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  ACCEPTE:    { label: 'Accepté',    icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  REFUSE:     { label: 'Refusé',     icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function ReceptionPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Statut | 'ALL'>('ALL')
  const [updating, setUpdating] = useState<string | null>(null)
  const [cvPreview, setCvPreview] = useState<{ url: string; title: string } | null>(null)

  const fetchCandidatures = async () => {
    const res = await fetch('/api/entreprise/candidatures')
    const data = await res.json()
    if (data.success) setCandidatures(data.data)
    setLoading(false)
  }

  useEffect(() => { fetchCandidatures() }, [])

  const updateStatut = async (id: string, statut: Statut) => {
    setUpdating(id)
    await fetch(`/api/entreprise/candidatures/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    setUpdating(null)
    fetchCandidatures()
  }

  const filtered = filter === 'ALL' ? candidatures : candidatures.filter(c => c.statut === filter)

  const counts = {
    ALL: candidatures.length,
    EN_ATTENTE: candidatures.filter(c => c.statut === 'EN_ATTENTE').length,
    ACCEPTE:    candidatures.filter(c => c.statut === 'ACCEPTE').length,
    REFUSE:     candidatures.filter(c => c.statut === 'REFUSE').length,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-fg mb-6">Boîte de réception</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {([['ALL', 'Toutes'], ['EN_ATTENTE', 'En attente'], ['ACCEPTE', 'Acceptées'], ['REFUSE', 'Refusées']] as [Statut | 'ALL', string][]).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === val ? 'bg-emerald-600 text-white' : 'bg-surface text-fg-secondary border border-border hover:bg-muted'
            }`}>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === val ? 'bg-emerald-500 text-white' : 'bg-muted text-fg-secondary'}`}>
              {counts[val]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 skeleton rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p>Aucune candidature</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const cfg = statutConfig[c.statut]
            const Icon = cfg.icon
            const date = new Date(c.createdAt).toLocaleDateString('fr-FR')
            return (
              <div key={c.id} className="card rounded-xl p-5">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="shrink-0">
                    <ProfileAvatar
                      src={c.etudiant.avatarUrl}
                      name={`${c.etudiant.prenom} ${c.etudiant.nom}`}
                      size="lg"
                    />
                  </div>
                  {/* Etudiant info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-fg">{c.etudiant.prenom} {c.etudiant.nom}</h3>
                      {c.etudiant.domaine && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-fg-secondary rounded-full">{c.etudiant.domaine}</span>
                      )}
                    </div>
                    <p className="text-sm text-fg-secondary mt-0.5">
                      Pour : <span className="font-medium">{c.offre.titre}</span> · {c.offre.type}
                    </p>
                    <p className="text-xs text-fg-muted mt-1">Reçu le {date}</p>
                    {c.etudiant.telephone && (
                      <p className="text-xs text-fg-secondary mt-1 flex items-center gap-1">
                        <Phone size={11} className="text-emerald-500" />
                        {c.etudiant.telephone}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2 flex-wrap items-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => setCvPreview({
                          url: c.cvUrl,
                          title: `CV — ${c.etudiant.prenom} ${c.etudiant.nom}`,
                        })}
                      >
                        <Eye size={12} />
                        Voir CV
                      </Button>
                      {c.etudiant.linkedin && (
                        <a href={c.etudiant.linkedin} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink size={11} /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Statut + actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${cfg.color}`}>
                      <Icon size={12} />{cfg.label}
                    </span>
                    {c.statut === 'EN_ATTENTE' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" loading={updating === c.id}
                          onClick={() => updateStatut(c.id, 'REFUSE')}
                          className="text-red-600 border-red-200 hover:bg-red-50">
                          Refuser
                        </Button>
                        <Button size="sm" loading={updating === c.id}
                          onClick={() => updateStatut(c.id, 'ACCEPTE')}>
                          Accepter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {c.message && (
                  <p className="text-sm text-fg-secondary mt-3 pt-3 border-t border-border-subtle italic">"{c.message}"</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {cvPreview && (
        <PdfViewerModal
          open
          url={cvPreview.url}
          title={cvPreview.title}
          onClose={() => setCvPreview(null)}
        />
      )}
    </div>
  )
}
