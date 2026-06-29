import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role, nom, prenom, nomEntreprise, secteur } = body

    if (!email || !password || !role) {
      return NextResponse.json({ success: false, error: 'Champs requis manquants' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ success: false, error: 'Email déjà utilisé' }, { status: 409 })
    }

    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10
    const hashed = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        ...(role === 'ETUDIANT' ? {
          etudiant: { create: { nom: nom || '', prenom: prenom || '' } }
        } : {
          entreprise: { create: { nom: nomEntreprise || '', secteur: secteur || '' } }
        })
      }
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role as 'ETUDIANT' | 'ENTREPRISE' })
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    await prisma.notification.create({
      data: {
        userId: user.id,
        titre: 'Bienvenue sur JobEtudiant !',
        message: role === 'ETUDIANT'
          ? 'Complétez votre profil et explorez les offres disponibles.'
          : 'Complétez le profil de votre entreprise et publiez votre première offre.',
      },
    })

    return NextResponse.json({ success: true, data: { role: user.role } }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
