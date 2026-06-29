import { ReactNode } from 'react'
import { GraduationCap } from 'lucide-react'
import { AuthThemeToggle } from '@/components/layout/AuthThemeToggle'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg relative">
      <AuthThemeToggle />
      <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-bold text-2xl">JobEtudiant</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">
            Votre avenir professionnel commence ici
          </h2>
          <p className="text-emerald-100/80 text-lg leading-relaxed max-w-md">
            Rejoignez la communauté qui connecte les étudiants malgaches aux meilleures opportunités d&apos;emploi, stages et missions.
          </p>
          <div className="flex gap-6 pt-4">
            <div>
              <p className="text-2xl font-bold">2 500+</p>
              <p className="text-sm text-emerald-200/70">Étudiants</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold">180+</p>
              <p className="text-sm text-emerald-200/70">Entreprises</p>
            </div>
          </div>
        </div>
        <p className="relative text-sm text-emerald-200/50">© JobEtudiant — Madagascar</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-bold text-2xl text-fg">Job<span className="text-emerald-600">Etudiant</span></span>
            </div>
            <p className="text-fg-secondary text-sm">La plateforme emploi pour les étudiants malgaches</p>
          </div>
          <div className="card rounded-2xl shadow-xl shadow-emerald-900/5 dark:shadow-black/20 p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
