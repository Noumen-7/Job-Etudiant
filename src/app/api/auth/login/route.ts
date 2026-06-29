import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Identifiants incorrects' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Identifiants incorrects' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role as 'ETUDIANT' | 'ENTREPRISE' })
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentWelcome = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        titre: 'Bon retour sur JobEtudiant',
        createdAt: { gte: since },
      },
    })

    if (!recentWelcome) {
      const unreadCandidatures = user.role === 'ETUDIANT'
        ? await prisma.candidature.count({
            where: {
              etudiant: { userId: user.id },
              statut: 'EN_ATTENTE',
            },
          })
        : await prisma.candidature.count({
            where: {
              offre: { entreprise: { userId: user.id } },
              statut: 'EN_ATTENTE',
            },
          })

      const message = user.role === 'ETUDIANT'
        ? unreadCandidatures > 0
          ? `Vous avez ${unreadCandidatures} candidature${unreadCandidatures > 1 ? 's' : ''} en cours. Consultez vos demandes.`
          : 'Découvrez les nouvelles offres disponibles pour vous.'
        : unreadCandidatures > 0
          ? `${unreadCandidatures} candidature${unreadCandidatures > 1 ? 's' : ''} en attente de votre réponse.`
          : 'Publiez une offre ou consultez votre tableau de bord.'

      await prisma.notification.create({
        data: {
          userId: user.id,
          titre: 'Bon retour sur JobEtudiant',
          message,
        },
      })
    }

    return NextResponse.json({ success: true, data: { role: user.role } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
