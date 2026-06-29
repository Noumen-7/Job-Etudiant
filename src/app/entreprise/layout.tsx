import { ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'

export default function EntrepriseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
