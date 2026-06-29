'use client'
import { useState, useEffect } from 'react'
import { Briefcase, Users, Clock, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Stats {
  totalOffres: number; offresActives: number; totalCandidatures: number
  enAttente: number; acceptees: number; refusees: number
}

function StatCard({ icon: Icon, label, value, gradient }: { icon: React.ElementType; label: string; value: number; gradient: string }) {
  return (
    <div className="card card-hover rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-fg-secondary font-medium">{label}</span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-fg">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => {
      if (d.success) setStats(d.data)
    }).finally(() => setLoading(false))
  }, [])

  const nomEntreprise = user?.entreprise?.nom || 'votre entreprise'

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-8 text-white shadow-xl shadow-emerald-900/20">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-48 h-48 bg-lime-300 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-emerald-200 text-sm font-medium mb-1">Espace entreprise</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Bonjour, {nomEntreprise}</h1>
          <p className="text-emerald-100/80 mt-2">Voici un aperçu de votre activité sur JobEtudiant.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 skeleton rounded-2xl border border-border-subtle" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={Briefcase} label="Total offres" value={stats.totalOffres} gradient="from-emerald-500 to-emerald-600" />
          <StatCard icon={TrendingUp} label="Offres actives" value={stats.offresActives} gradient="from-teal-500 to-teal-600" />
          <StatCard icon={Users} label="Candidatures reçues" value={stats.totalCandidatures} gradient="from-lime-500 to-emerald-500" />
          <StatCard icon={Clock} label="En attente" value={stats.enAttente} gradient="from-amber-400 to-orange-400" />
          <StatCard icon={CheckCircle} label="Acceptées" value={stats.acceptees} gradient="from-green-500 to-emerald-500" />
          <StatCard icon={XCircle} label="Refusées" value={stats.refusees} gradient="from-red-400 to-red-500" />
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-fg mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/entreprise/offres"
            className="card-hover flex items-center gap-4 p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
            <div className="p-3 bg-white/15 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Gérer mes offres</p>
              <p className="text-sm text-emerald-100">Ajouter, modifier, supprimer</p>
            </div>
            <ArrowRight size={20} className="text-emerald-200" />
          </Link>
          <Link href="/entreprise/reception"
            className="card card-hover flex items-center gap-4 p-6 rounded-2xl">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Users size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-fg">Voir les candidatures</p>
              {stats && stats.enAttente > 0 ? (
                <p className="text-sm text-emerald-600 font-semibold">{stats.enAttente} en attente de réponse</p>
              ) : (
                <p className="text-sm text-fg-secondary">Consulter la boîte de réception</p>
              )}
            </div>
            <ArrowRight size={20} className="text-fg-muted" />
          </Link>
        </div>
      </div>
    </div>
  )
}
