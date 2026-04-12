import 'dotenv/config'
import pkg from 'resend';
const { Resend } = pkg;

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(toEmail, token) {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'FreelanceHub <onboarding@rexcloud.my.id>',
      to: toEmail,
      subject: 'Verifikasi Email FreelanceHub',
      html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Verifikasi Email Kamu</h2>
        <p>Klik tombol di bawah untuk mengaktifkan akun FreelanceHub kamu:</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;
          background:#4f8ef7;color:white;border-radius:8px;
          text-decoration:none;font-weight:600">
          Verifikasi Email
        </a>
        <p style="color:#888;font-size:13px;margin-top:16px">
          Link berlaku selama 24 jam. Abaikan email ini jika kamu tidak mendaftar.
        </p>
      </div>
    `
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(error.message || 'Failed to send email')
    }

    console.log('Email sent OK:', data)
  } catch (err) {
    console.error('Resend error:', err)
    throw err;
  }
}