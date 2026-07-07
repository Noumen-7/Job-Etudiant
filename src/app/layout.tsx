import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import './globals.css'


const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})


export const metadata: Metadata = {
  title: 'JobEtudiant — Emploi & stages pour étudiants à Madagascar',
  description:
    'La plateforme qui connecte les étudiants malgaches aux entreprises locales pour des stages, CDD et missions freelance.',
}


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <html
      lang="fr"
      suppressHydrationWarning
    >

      <body
        className={`${jakarta.className} antialiased transition-colors duration-300`}
      >

        <Providers>
          {children}
        </Providers>

      </body>

    </html>

  )
}