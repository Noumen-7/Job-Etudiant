'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/providers/LanguageProvider'

import {
  GraduationCap,
  Building2,
  ArrowLeft
} from 'lucide-react'


type Role = 'ETUDIANT' | 'ENTREPRISE'


function parseRole(value: string | null): Role | null {

  if (!value) return null

  const v = value.toUpperCase()

  if (v === 'ETUDIANT' || v === 'ENTREPRISE')
    return v

  if (value.toLowerCase() === 'etudiant')
    return 'ETUDIANT'

  if (value.toLowerCase() === 'entreprise')
    return 'ENTREPRISE'

  return null
}



export default function RegisterForm() {


  const router = useRouter()

  const searchParams = useSearchParams()

  const { refetch } = useAuth()


  const {
    language,
    changeLanguage
  } = useLanguage()



  const [role, setRole] =
    useState<Role>('ETUDIANT')


  const [form, setForm] = useState({

    email: '',
    password: '',
    confirm: '',
    nom: '',
    prenom: '',
    nomEntreprise: '',
    secteur: ''

  })


  const [error, setError] = useState('')

  const [loading, setLoading] =
    useState(false)





  useEffect(() => {

    const fromUrl =
      parseRole(searchParams.get('role'))

    if (fromUrl)
      setRole(fromUrl)

  }, [searchParams])





  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({
        ...f,
        [k]: e.target.value
      }))





  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setError('')


    if (form.password !== form.confirm) {

      setError(
        language === "fr"
          ? "Les mots de passe ne correspondent pas"
          : "Tsy mitovy ny teny miafina"
      )

      return
    }



    if (form.password.length < 8) {

      setError(
        language === "fr"
          ? "Le mot de passe doit contenir au moins 8 caractères"
          : "Ny teny miafina dia tokony hanana litera 8 farafahakeliny"
      )

      return
    }




    setLoading(true)



    const res = await fetch('/api/auth/register', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        ...form,
        role
      }),

    })



    const data = await res.json()


    setLoading(false)



    if (!data.success) {

      setError(data.error)

      return

    }



    await refetch()


    router.push(
      data.data.role === 'ETUDIANT'
        ? '/etudiant/accueil'
        : '/entreprise/dashboard'
    )


  }






  return (

    <>

      {/* Langue */}

      <div className="flex justify-end mb-4">

        <button

          type="button"

          onClick={() =>
            changeLanguage(
              language === "fr"
                ? "mg"
                : "fr"
            )
          }

          className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition"

        >

          {
            language === "fr"
              ? "🇫🇷 FR"
              : "🇲🇬 MG"
          }

        </button>

      </div>






      <Link

        href="/"

        className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-emerald-600 transition-colors mb-5"

      >

        <ArrowLeft size={16}/>


        {
          language === "fr"
            ? "Retour à l'accueil"
            : "Hiverina any amin'ny fandraisana"
        }


      </Link>






      <h2 className="text-2xl font-extrabold text-fg mb-6 tracking-tight">


        {
          language === "fr"
            ? "Créer un compte"
            : "Mamorona kaonty"
        }


      </h2>






      <div className="flex gap-2 mb-6 p-1 bg-accent-soft rounded-xl border border-border-subtle">


        {(['ETUDIANT','ENTREPRISE'] as Role[]).map(r => (


          <button

            key={r}

            type="button"

            onClick={() => setRole(r)}

            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              role === r
              ? 'bg-surface text-accent-soft-fg shadow-sm ring-1 ring-emerald-200'
              : 'text-fg-secondary hover:text-emerald-700'
            }`}

          >


            {
              r === 'ETUDIANT'
                ?

                <>
                  <GraduationCap size={16}/>

                  {
                    language === "fr"
                      ? "Étudiant"
                      : "Mpianatra"
                  }

                </>

                :

                <>
                  <Building2 size={16}/>

                  {
                    language === "fr"
                      ? "Entreprise"
                      : "Orinasa"
                  }

                </>

            }


          </button>


        ))}


      </div>






      {error &&

        <Alert type="error" className="mb-4">

          {error}

        </Alert>

      }







      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >



        {
          role === 'ETUDIANT'

          ?

          <div className="grid grid-cols-2 gap-3">


            <Input

              id="nom"

              label={
                language==="fr"
                ? "Nom"
                : "Anarana"
              }

              required

              placeholder="Rakoto"

              value={form.nom}

              onChange={set('nom')}

            />



            <Input

              id="prenom"

              label={
                language==="fr"
                ? "Prénom"
                : "Fanampin'anarana"
              }

              required

              placeholder="Aina"

              value={form.prenom}

              onChange={set('prenom')}

            />

          </div>


          :


          <>

          <Input

            id="nomEntreprise"

            label={
              language==="fr"
              ? "Nom de l'entreprise"
              : "Anaran'ny orinasa"
            }

            required

            placeholder="Tech Madagascar"

            value={form.nomEntreprise}

            onChange={set('nomEntreprise')}

          />



          <Input

            id="secteur"

            label={
              language==="fr"
              ? "Secteur d'activité"
              : "Sehatry ny asa"
            }

            placeholder="Informatique, Finance..."

            value={form.secteur}

            onChange={set('secteur')}

          />

          </>


        }




        <Input

          id="email"

          label={
            language==="fr"
            ? "Adresse email"
            : "Adiresy mailaka"
          }

          type="email"

          required

          placeholder="vous@exemple.com"

          value={form.email}

          onChange={set('email')}

        />




        <Input

          id="password"

          label={
            language==="fr"
            ? "Mot de passe"
            : "Teny miafina"
          }

          type="password"

          required

          placeholder="Min. 8 caractères"

          value={form.password}

          onChange={set('password')}

        />





        <Input

          id="confirm"

          label={
            language==="fr"
            ? "Confirmer le mot de passe"
            : "Hamafiso ny teny miafina"
          }

          type="password"

          required

          placeholder="••••••••"

          value={form.confirm}

          onChange={set('confirm')}

        />






        <Button

          type="submit"

          className="w-full"

          size="lg"

          loading={loading}

        >

          {
            language==="fr"
            ? "Créer mon compte"
            : "Mamorona kaontiko"
          }

        </Button>




      </form>







      <p className="text-center text-sm text-fg-secondary mt-6">


        {
          language==="fr"
          ? "Déjà inscrit ? "
          : "Efa manana kaonty ? "
        }



        <Link

          href="/auth/login"

          className="text-emerald-600 font-medium hover:underline"

        >

          {
            language==="fr"
            ? "Se connecter"
            : "Hiditra"
          }

        </Link>



      </p>



    </>

  )

}