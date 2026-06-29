'use client'
import { useState, useEffect } from 'react'
import {
  FileText, Clock, CheckCircle, XCircle, Building2, Eye,
  Briefcase, MessageSquare, Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PdfViewerModal } from '@/components/cv/PdfViewerModal'

type Statut = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'

interface Candidature {
  id: string
  statut: Statut
  createdAt: string
  message?: string
  cvUrl: string
  offre: { titre: string; type: string; entreprise: { nom: string } }
}

const statutConfig = {
  EN_ATTENTE: { label: 'En attente', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACCEPTE:    { label: 'Acceptée',   icon: CheckCircle, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REFUSE:     { label: 'Refusée',    icon: XCircle, className: 'bg-red-50 text-red-600 border-red-200' },
}

function CandidatureSkeleton() {
  return (
    <div className="card rounded-2xl p-5 skeleton">
      <div className="h-5 w-2/3 bg-muted rounded mb-3" />
      <div className="h-4 w-1/2 bg-muted rounded mb-4" />
      <div className="h-9 w-28 bg-muted rounded-xl" />
    </div>
  )
}

export default function DemandesPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Statut | 'ALL'>('ALL')
  const [cvPreview, setCvPreview] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    fetch('/api/etudiant/candidatures')
      .then(r => r.json())
      .then(d => { if (d.success) setCandidatures(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? candidatures : candidatures.filter(c => c.statut === filter)

  const counts = {
    ALL: candidatures.length,
    EN_ATTENTE: candidatures.filter(c => c.statut === 'EN_ATTENTE').length,
    ACCEPTE: candidatures.filter(c => c.statut === 'ACCEPTE').length,
    REFUSE: candidatures.filter(c => c.statut === 'REFUSE').length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">Mes demandes</h1>
        <p className="text-fg-secondary mt-1">Suivez l&apos;état de vos candidatures et consultez vos CV envoyés.</p>
      </div>

      {/* Stats rapides */}
      {!loading && candidatures.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {([
            ['ALL', 'Total', counts.ALL, 'bg-muted text-fg'],
            ['EN_ATTENTE', 'En attente', counts.EN_ATTENTE, 'bg-amber-50 text-amber-700'],
            ['ACCEPTE', 'Acceptées', counts.ACCEPTE, 'bg-emerald-50 text-emerald-700'],
            ['REFUSE', 'Refusées', counts.REFUSE, 'bg-red-50 text-red-600'],
          ] as const).map(([key, label, count, colorClass]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                filter === key ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-sm' : 'border-border-subtle hover:border-border'
              } ${colorClass.split(' ')[0]}`}
            >
              <p className={`text-2xl font-extrabold ${colorClass.split(' ').slice(1).join(' ')}`}>{count}</p>
              <p className="text-xs font-medium text-fg-secondary mt-0.5">{label}</p>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <CandidatureSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Inbox size={28} className="text-emerald-500" />
          </div>
          <p className="font-semibold text-fg mb-1">
            {filter === 'ALL' ? 'Aucune candidature pour le moment' : 'Aucune candidature dans cette catégorie'}
          </p>
          <p className="text-sm text-fg-secondary">
            {filter === 'ALL'
              ? 'Parcourez les offres disponibles pour postuler.'
              : 'Essayez un autre filtre pour voir vos demandes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const cfg = statutConfig[c.statut]
            const Icon = cfg.icon
            const date = new Date(c.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })

            return (
              <article
                key={c.id}
                className="card rounded-2xl overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                          {c.offre.type}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.className}`}>
                          <Icon size={12} />
                          {cfg.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-fg text-lg leading-snug">{c.offre.titre}</h3>

                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-fg-secondary">
                        <Building2 size={14} className="text-emerald-500 shrink-0" />
                        <span className="font-medium text-fg">{c.offre.entreprise.nom}</span>
                      </div>

                      <p className="text-xs text-fg-muted mt-2 flex items-center gap-1">
                        <Briefcase size={12} />
                        Postulé le {date}
                      </p>
                    </div>
                  </div>

                  {c.message && (
                    <div className="mt-4 p-4 bg-muted rounded-xl border border-border-subtle">
                      <p className="text-xs font-semibold text-fg-secondary mb-1.5 flex items-center gap-1">
                        <MessageSquare size={12} />
                        Votre message
                      </p>
                      <p className="text-sm text-fg-secondary leading-relaxed">{c.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-muted/80 border-t border-border-subtle">
                  <span className="text-xs text-fg-muted flex items-center gap-1">
                    <FileText size={12} />
                    CV joint à la candidature
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5"
                    onClick={() => setCvPreview({
                      url: c.cvUrl,
                      title: `CV — ${c.offre.titre}`,
                    })}
                  >
                    <Eye size={14} />
                    Voir mon CV
                  </Button>
                </div>
              </article>
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
