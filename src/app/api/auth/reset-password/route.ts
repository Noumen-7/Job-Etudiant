import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Token et mot de passe requis' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Token invalide ou expiré' }, { status: 400 })
    }

    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10
    const hashed = await bcrypt.hash(password, saltRounds)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExp: null }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
