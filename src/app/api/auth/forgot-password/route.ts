import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendResetPasswordEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: false, error: 'Email requis' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: true })

    const token = crypto.randomBytes(32).toString('hex')
    const exp = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExp: exp }
    })

    await sendResetPasswordEmail(email, token)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
