'use client'

import { useLanguage } from '@/providers/LanguageProvider'


export function AuthMobileTitle(){

 const {language}=useLanguage()


 return (

  <p className="text-fg-secondary text-sm">

   {
    language==="fr"
    ? "La plateforme emploi pour les étudiants malgaches"
    : "Sehatra asa ho an'ny mpianatra malagasy"
   }

  </p>

 )

}