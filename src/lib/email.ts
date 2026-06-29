import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - JobEtudiant',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">JobEtudiant</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous (valable 1 heure) :</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `,
  })
}

export async function sendNotificationEmail(email: string, titre: string, message: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `${titre} - JobEtudiant`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">JobEtudiant</h2>
        <h3>${titre}</h3>
        <p>${message}</p>
      </div>
    `,
  })
}
