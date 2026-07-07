'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Eye,
  Briefcase,
  MessageSquare,
  Inbox,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PdfViewerModal } from '@/components/cv/PdfViewerModal'
import { useLanguage } from '@/providers/LanguageProvider'


type Statut = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'


interface Candidature {
  id: string
  statut: Statut
  createdAt: string
  message?: string
  cvUrl: string

  offre: {
    titre: string
    type: string
    entreprise: {
      nom: string
    }
  }
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


  const {
    language
  } = useLanguage()


  const fr = language === "fr"



  const statutConfig = {

    EN_ATTENTE: {
      label: fr ? 'En attente' : 'Miandry',
      icon: Clock,
      className:
        'bg-amber-50 text-amber-700 border-amber-200'
    },


    ACCEPTE: {
      label: fr ? 'Acceptée' : 'Voaray',
      icon: CheckCircle,
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200'
    },


    REFUSE: {
      label: fr ? 'Refusée' : 'Nolavina',
      icon: XCircle,
      className:
        'bg-red-50 text-red-600 border-red-200'
    }

  }



  const [candidatures, setCandidatures] =
    useState<Candidature[]>([])


  const [loading, setLoading] =
    useState(true)



  const [filter, setFilter] =
    useState<Statut | 'ALL'>('ALL')



  const [cvPreview, setCvPreview] =
    useState<{
      url:string
      title:string
    } | null>(null)



  useEffect(() => {

    fetch('/api/etudiant/candidatures')

      .then(r => r.json())

      .then(d => {

        if(d.success){

          setCandidatures(d.data)

        }

      })

      .finally(()=>setLoading(false))


  },[])





  const filtered =
    filter === 'ALL'
    ?
    candidatures
    :
    candidatures.filter(
      c=>c.statut===filter
    )




  const counts = {

    ALL:candidatures.length,

    EN_ATTENTE:
      candidatures.filter(
        c=>c.statut==="EN_ATTENTE"
      ).length,


    ACCEPTE:
      candidatures.filter(
        c=>c.statut==="ACCEPTE"
      ).length,


    REFUSE:
      candidatures.filter(
        c=>c.statut==="REFUSE"
      ).length

  }



return (

<div className="max-w-4xl mx-auto">


<div className="mb-8">


<h1 className="
text-2xl sm:text-3xl
font-extrabold text-fg
tracking-tight">

{
fr
?
"Mes demandes"
:
"Ny fangatahana nataoko"
}

</h1>



<p className="
text-fg-secondary mt-1">


{
fr
?
"Suivez l'état de vos candidatures et consultez vos CV envoyés."
:
"Araho ny toetry ny fangatahanao ary jereo ireo CV nalefanao."
}


</p>



</div>





{
!loading && candidatures.length > 0 && (

<div className="
grid grid-cols-2
sm:grid-cols-4
gap-3 mb-6">


{
([
['ALL', fr?'Total':'Fitambarany', counts.ALL],
['EN_ATTENTE', fr?'En attente':'Miandry', counts.EN_ATTENTE],
['ACCEPTE', fr?'Acceptées':'Voaray', counts.ACCEPTE],
['REFUSE', fr?'Refusées':'Nolavina', counts.REFUSE]

] as const)

.map(
([
key,
label,
count
])=>(


<button

key={key}

onClick={()=>setFilter(key)}

className={`
rounded-2xl border p-4
text-left transition-all

${
filter===key
?
'border-emerald-300 ring-2 ring-emerald-100'
:
'border-border-subtle'
}

`}

>


<p className="
text-2xl font-extrabold
text-fg">

{count}

</p>


<p className="
text-xs text-fg-secondary">

{label}

</p>


</button>


))


}


</div>


)

}





{
loading ?


<div className="space-y-4">

{
[1,2,3].map(
i=><CandidatureSkeleton key={i}/>
)
}

</div>


:


filtered.length===0 ?



<div className="empty-state">


<div className="
w-16 h-16 mx-auto mb-4
rounded-2xl bg-emerald-50
flex items-center justify-center">

<Inbox size={28}
className="text-emerald-500"/>

</div>



<p className="
font-semibold text-fg mb-1">


{
filter==="ALL"
?
(
fr
?
"Aucune candidature pour le moment"
:
"Tsy mbola misy fangatahana"
)

:

(
fr
?
"Aucune candidature dans cette catégorie"
:
"Tsy misy fangatahana amin'ity sokajy ity"
)

}



</p>



<p className="
text-sm text-fg-secondary">


{
filter==="ALL"

?

(
fr
?
"Parcourez les offres disponibles pour postuler."
:
"Jereo ireo tolotra misy ary mangataha asa."
)

:

(
fr
?
"Essayez un autre filtre."
:
"Andramo sokajy hafa."
)

}


</p>


</div>



:


<div className="space-y-4">


{
filtered.map(c=>{


const cfg =
statutConfig[c.statut]


const Icon =
cfg.icon



const date =
new Date(c.createdAt)
.toLocaleDateString(
fr?'fr-FR':'mg-MG',
{
day:'numeric',
month:'long',
year:'numeric'
}
)




return (

<article
key={c.id}
className="
card rounded-2xl overflow-hidden"
>


<div className="
p-5 sm:p-6">


<div className="
flex flex-col sm:flex-row
justify-between gap-4">


<div>


<div className="
flex gap-2 mb-2">


<span className="
text-xs font-semibold
px-2.5 py-1
bg-emerald-100
text-emerald-800
rounded-lg">

{c.offre.type}

</span>



<span className={`
flex items-center gap-1
text-xs font-semibold
px-2.5 py-1
rounded-lg border
${cfg.className}
`}>

<Icon size={12}/>

{cfg.label}

</span>



</div>




<h3 className="
font-bold text-fg text-lg">

{c.offre.titre}

</h3>




<div className="
flex items-center gap-1.5
mt-2 text-sm text-fg-secondary">


<Building2 size={14}/>


<span className="font-medium text-fg">

{c.offre.entreprise.nom}

</span>


</div>




<p className="
text-xs text-fg-muted mt-2">

<Briefcase size={12}
className="inline mr-1"/>


{
fr
?
`Postulé le ${date}`
:
`Nangataka tamin'ny ${date}`
}


</p>



</div>



</div>






{
c.message && (

<div className="
mt-4 p-4 bg-muted
rounded-xl">


<p className="
text-xs font-semibold
text-fg-secondary mb-1">

<MessageSquare
size={12}
className="inline mr-1"/>


{
fr
?
"Votre message"
:
"Hafatrao"
}


</p>



<p className="
text-sm text-fg-secondary">

{c.message}

</p>


</div>

)

}



</div>






<div className="
flex justify-between
px-5 py-3
bg-muted/80
border-t">


<span className="
text-xs text-fg-muted">


<FileText
size={12}
className="inline mr-1"/>


{
fr
?
"CV joint à la candidature"
:
"CV nalefa miaraka amin'ny fangatahana"
}


</span>



<Button

size="sm"

variant="secondary"

onClick={()=>setCvPreview({

url:c.cvUrl,

title:`CV — ${c.offre.titre}`

})}

>


<Eye size={14}/>


{
fr
?
"Voir mon CV"
:
"Hijery ny CV"
}


</Button>



</div>



</article>

)

})


}


</div>



}



{
cvPreview && (

<PdfViewerModal

open

url={cvPreview.url}

title={cvPreview.title}

onClose={()=>setCvPreview(null)}

/>

)

}



</div>

)

}