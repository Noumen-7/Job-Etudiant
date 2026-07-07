'use client'

import { useLanguage } from '@/providers/LanguageProvider'

export function AuthPresentation() {

  const { language } = useLanguage()


  return (
    <>

      <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">

        {
          language === "fr"
            ? "Votre avenir professionnel commence ici"
            : "Ny hoavinao amin'ny asa dia manomboka eto"
        }

      </h2>


      <p className="text-emerald-100/80 text-lg leading-relaxed max-w-md">

        {
          language === "fr"

          ?

          "Rejoignez la communauté qui connecte les étudiants malgaches aux meilleures opportunités d'emploi, stages et missions."

          :

          "Midira amin'ny sehatra mampifandray ireo mpianatra malagasy amin'ireo asa, stage ary tetikasa tsara indrindra."
        }

      </p>


      <div className="flex gap-6 pt-4">

        <div>

          <p className="text-2xl font-bold">
            2 500+
          </p>

          <p className="text-sm text-emerald-200/70">

            {
              language === "fr"
                ? "Étudiants"
                : "Mpianatra"
            }

          </p>

        </div>


        <div className="w-px bg-white/20" />


        <div>

          <p className="text-2xl font-bold">
            180+
          </p>

          <p className="text-sm text-emerald-200/70">

            {
              language === "fr"
                ? "Entreprises"
                : "Orinasa"
            }

          </p>

        </div>


      </div>


    </>
  )
}