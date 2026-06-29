'use client'
import { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-stone-50 rounded-xl" />}>
      <RegisterForm />
    </Suspense>
  )
}
