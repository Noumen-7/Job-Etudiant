import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'

const stats = [
  { value: '2 500+', label: 'Étudiants inscrits' },
  { value: '180+', label: 'Entreprises partenaires' },
  { value: '850+', label: 'Offres publiées' },
  { value: '92%', label: 'Satisfaction' },
]

const features = [
  {
    icon: Search,
    title: 'Recherche intelligente',
    desc: 'Filtrez par domaine, type de contrat et mots-clés pour trouver l\'offre idéale en quelques secondes.',
  },
  {
    icon: Send,
    title: 'Candidature en un clic',
    desc: 'Postulez avec votre CV PDF et un message de motivation, directement depuis la plateforme.',
  },
  {
    icon: Shield,
    title: 'Espace sécurisé',
    desc: 'Vos données et documents sont protégés. Authentification fiable et espace personnel dédié.',
  },
  {
    icon: TrendingUp,
    title: 'Suivi en temps réel',
    desc: 'Suivez l\'état de vos candidatures et recevez des notifications à chaque réponse.',
  },
  {
    icon: Building2,
    title: 'Recrutement simplifié',
    desc: 'Les entreprises publient, gèrent et traitent les candidatures depuis un dashboard clair.',
  },
  {
    icon: Sparkles,
    title: '100% Madagascar',
    desc: 'Une plateforme pensée pour le marché local : stages, CDD, freelance adaptés aux étudiants.',
  },
]

const steps = [
  { num: '01', title: 'Créez votre profil', desc: 'Inscrivez-vous en tant qu\'étudiant ou entreprise en moins de 2 minutes.' },
  { num: '02', title: 'Explorez ou publiez', desc: 'Parcourez les offres ou publiez vos besoins de recrutement.' },
  { num: '03', title: 'Connectez-vous', desc: 'Postulez, recevez des candidatures et lancez votre carrière.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-fg">
              Job<span className="text-emerald-600">Etudiant</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-fg-secondary">
            <a href="#fonctionnalites" className="hover:text-emerald-700 transition-colors">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="hover:text-emerald-700 transition-colors">Comment ça marche</a>
            <a href="#pour-qui" className="hover:text-emerald-700 transition-colors">Pour qui ?</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-fg-secondary hover:text-emerald-700 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30"
            >
              Commencer <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent-soft-fg text-sm font-medium mb-6 border border-border">
              <Sparkles size={14} />
              La référence emploi-étudiant à Madagascar
            </div>
            <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg leading-[1.1] tracking-tight">
              Votre premier pas vers{' '}
              <span className="text-gradient">l&apos;emploi</span>
              {' '}commence ici
            </h1>
            <p className="animate-fade-up delay-200 mt-6 text-lg sm:text-xl text-fg-secondary leading-relaxed max-w-2xl">
              JobEtudiant connecte les talents malgaches aux entreprises qui recrutent.
              Stages, CDD, missions freelance — trouvez votre opportunité ou recrutez les profils de demain.
            </p>
            <div className="animate-fade-up delay-300 mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register?role=etudiant"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              <GraduationCap size={20} />
              Je suis étudiant
            </Link>
            <Link
              href="/auth/register?role=entreprise"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-surface text-accent-soft-fg font-semibold rounded-xl border-2 border-border hover:border-emerald-400 hover:bg-muted transition-all hover:-translate-y-0.5"
            >
                <Building2 size={20} />
                Je recrute
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="animate-fade-up delay-400 hidden lg:block absolute right-0 top-8 w-[420px]">
            <div className="relative animate-float">
              <div className="card rounded-2xl shadow-2xl shadow-emerald-900/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                    <Briefcase size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-fg text-sm">Stage Développeur Web</p>
                    <p className="text-xs text-fg-secondary">Tech Mada · Antananarivo</p>
                  </div>
                  <span className="ml-auto text-xs font-medium px-2 py-1 badge-type">Stage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                    <Briefcase size={20} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-fg text-sm">Assistant Marketing</p>
                    <p className="text-xs text-fg-secondary">Agence Créative · Remote</p>
                  </div>
                  <span className="ml-auto text-xs font-medium px-2 py-1 badge-muted">CDD</span>
                </div>
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['A', 'M', 'R'].map((l, i) => (
                      <div key={l} className={`w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-teal-500' : 'bg-lime-500'}`}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-fg-secondary"><span className="font-semibold text-emerald-600">+24</span> candidatures aujourd&apos;hui</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} /> Candidature acceptée !
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border-subtle bg-surface/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{value}</p>
                <p className="mt-1 text-sm text-fg-secondary font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Fonctionnalités</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">
              Tout ce qu&apos;il faut pour réussir
            </h2>
            <p className="mt-4 text-fg-secondary text-lg">
              Une plateforme complète, simple et moderne pour étudiants et recruteurs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card card-hover rounded-2xl p-6"
              >
                <div className="icon-badge w-12 h-12 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-fg text-lg mb-2">{title}</h3>
                <p className="text-fg-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="py-20 sm:py-28 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Conçu pour vous</h2>
            <p className="mt-4 text-emerald-100/80 text-lg max-w-xl mx-auto">
              Que vous cherchiez votre première expérience ou le talent idéal, JobEtudiant vous accompagne.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-8 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <GraduationCap size={28} className="text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pour les étudiants</h3>
              <ul className="space-y-3 text-emerald-100/90">
                {['Parcourez des centaines d\'offres filtrées par domaine', 'Postulez avec votre CV en PDF', 'Suivez vos candidatures en temps réel', 'Recevez des notifications à chaque réponse'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?role=etudiant" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-emerald-300 hover:text-white transition-colors">
                Créer mon profil étudiant <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-8 card-hover">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-6">
                <Building2 size={28} className="text-teal-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pour les entreprises</h3>
              <ul className="space-y-3 text-emerald-100/90">
                {['Publiez et gérez vos offres facilement', 'Recevez des candidatures qualifiées', 'Consultez les CV directement en ligne', 'Acceptez ou refusez en un clic'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 size={16} className="text-teal-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?role=entreprise" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-teal-300 hover:text-white transition-colors">
                Inscrire mon entreprise <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Simple & rapide</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">
              Comment ça marche ?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-300 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-500/30 mb-6">
                  {num}
                </div>
                <h3 className="font-bold text-fg text-lg mb-2">{title}</h3>
                <p className="text-fg-secondary text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 p-10 sm:p-16 text-center overflow-hidden shadow-2xl shadow-emerald-600/30">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-lime-300 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-50 text-sm font-medium mb-6">
                <Zap size={14} /> Gratuit pour les étudiants
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Prêt à lancer votre carrière ?
              </h2>
              <p className="mt-4 text-emerald-100 text-lg max-w-lg mx-auto">
                Rejoignez des milliers d&apos;étudiants et d&apos;entreprises malgaches sur JobEtudiant dès aujourd&apos;hui.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
                >
                  Créer un compte gratuit <ArrowRight size={18} />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
                >
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <span className="font-bold text-fg">JobEtudiant</span>
            </div>
            <p className="text-sm text-fg-secondary text-center">
              © {new Date().getFullYear()} JobEtudiant — Plateforme emploi pour étudiants malgaches
            </p>
            <div className="flex items-center gap-6 text-sm text-fg-secondary">
              <Link href="/auth/login" className="hover:text-emerald-600 transition-colors">Connexion</Link>
              <Link href="/auth/register" className="hover:text-emerald-600 transition-colors">Inscription</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
