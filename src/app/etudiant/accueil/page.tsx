'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/providers/LanguageProvider'

import Link from 'next/link'

import {
  Briefcase,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  Bell
} from 'lucide-react'


export default function AccueilPage() {


  const { user, loading } = useAuth()

  const { language } = useLanguage()



  const prenom = user?.etudiant?.prenom || ''



  const quickLinks = [

    {
      href: '/etudiant/metier',
      icon: Briefcase,

      label:
        language === "fr"
          ? "Offres disponibles"
          : "Tolotra misy",

      desc:
        language === "fr"
          ? "Recherchez et postulez"
          : "Mitadiava ary mandefa fangatahana",

      iconBg: 'from-emerald-500 to-teal-500',
    },


    {
      href: '/etudiant/demandes',
      icon: FileText,

      label:
        language === "fr"
          ? "Mes demandes"
          : "Ny fangatahako",

      desc:
        language === "fr"
          ? "Suivez vos candidatures"
          : "Araho ny fangatahanao",

      iconBg: 'from-teal-500 to-cyan-500',
    },


    {
      href: '/etudiant/profil',
      icon: User,

      label:
        language === "fr"
          ? "Mon profil"
          : "Ny mombamomba ahy",

      desc:
        language === "fr"
          ? "Mettez à jour vos infos"
          : "Havaozy ny mombamomba anao",

      iconBg: 'from-lime-500 to-emerald-500',
    },


    {
      href: '/etudiant/notifications',
      icon: Bell,

      label:
        language === "fr"
          ? "Notifications"
          : "Fampahafantarana",

      desc:
        language === "fr"
          ? "Vos dernières réponses"
          : "Valiny farany azonao",

      iconBg: 'from-emerald-600 to-green-600',
    },

  ]





  return (

    <div className="space-y-8">


      {/* Hero */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-8 sm:p-10 text-white shadow-xl shadow-emerald-600/20">


        <div className="absolute inset-0 opacity-20">

          <div className="absolute -top-10 -right-10 w-48 h-48 bg-lime-300 rounded-full blur-3xl" />

          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-300 rounded-full blur-3xl" />

        </div>



        <div className="relative">


          {
            loading

            ?

            <div className="h-9 bg-white/20 rounded-xl w-56 animate-pulse mb-3" />


            :

            <div className="flex items-center gap-2 mb-2">

              <Sparkles size={18} className="text-emerald-200" />


              <span className="text-emerald-100 text-sm font-medium">

                {
                  language === "fr"
                    ? "Espace étudiant"
                    : "Toeran'ny mpianatra"
                }

              </span>


            </div>

          }






          {
            !loading &&

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">


              {
                language === "fr"
                  ? `Bonjour, ${prenom || 'étudiant'}`
                  : `Salama, ${prenom || 'mpianatra'}`
              }


            </h1>

          }






          <p className="text-emerald-100/90 mb-8 max-w-lg text-lg leading-relaxed">


            {
              language === "fr"

              ?

              "Trouvez votre prochain stage ou petit boulot parmi les offres disponibles sur JobEtudiant."

              :

              "Mitadiava stage na asa kely mifanaraka aminao ao amin'ireo tolotra ao amin'ny JobEtudiant."
            }


          </p>







          <Link

            href="/etudiant/metier"

            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:-translate-y-0.5"

          >


            {
              language === "fr"
                ? "Explorer les offres"
                : "Hijery ireo tolotra"
            }


            <ArrowRight size={18}/>


          </Link>




        </div>


      </section>







      {/* Quick links */}

      <section>


        <h2 className="text-lg font-bold text-fg mb-5">


          {
            language === "fr"
              ? "Accès rapide"
              : "Fidirana haingana"
          }


        </h2>





        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


          {
            quickLinks.map(
              ({
                href,
                icon: Icon,
                label,
                desc,
                iconBg
              }) => (


                <Link

                  key={href}

                  href={href}

                  className="card card-hover group flex flex-col gap-4 p-5 rounded-2xl"

                >


                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >

                    <Icon size={20} className="text-white" />

                  </div>



                  <div>

                    <p className="font-bold text-fg">
                      {label}
                    </p>


                    <p className="text-sm text-fg-secondary mt-0.5">
                      {desc}
                    </p>


                  </div>



                </Link>


              )

            )

          }


        </div>


      </section>


    </div>

  )

}