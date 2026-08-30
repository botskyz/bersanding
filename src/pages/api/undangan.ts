import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { slugFromNames } from '@/lib/invitation'
import { adminCookie } from '@/lib/session'
import { FREE_THEME } from '@/lib/themes'
import { undanganSchema } from '@/lib/validation'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const parsed = undanganSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid', issues: parsed.error.flatten() })
  }
  const data = parsed.data
  const adminToken = crypto.randomUUID()
  let slug = ''
  for (let i = 0; i < 5; i++) {
    const candidate = slugFromNames(
      data.groomName,
      data.brideName,
      Math.random().toString(36).slice(2, 7),
    )
    const exists = await db
      .select({ id: undangan.id })
      .from(undangan)
      .where(eq(undangan.slug, candidate))
      .limit(1)
    if (exists.length === 0) {
      slug = candidate
      break
    }
  }
  if (!slug) return res.status(500).json({ error: 'slug' })
  const [created] = await db
    .insert(undangan)
    .values({
      ...data,
      slug,
      adminToken,
      theme: FREE_THEME,
      package: 'free',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning({ id: undangan.id })
  res.setHeader('Set-Cookie', adminCookie(adminToken))

  // Kirim link kelola ke email — best-effort, kegagalan kirim email TIDAK
  // membatalkan pembuatan undangan (undangan tetap dibuat walau email gagal).
  if (resend) {
    try {
      const proto = (req.headers['x-forwarded-proto'] as string) || 'http'
      const host = req.headers.host
      const kelolaUrl = `${proto}://${host}/kelola?token=${adminToken}`
      await resend.emails.send({
        from: 'sharehalo <onboarding@resend.dev>',
        to: data.email,
        subject: `Link kelola undangan ${data.groomName} & ${data.brideName} — sharehalo`,
        html: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Berhasil Dibuat</title>
</head>
<body style="margin:0; padding:0; background-color:#f7f7f7; font-family:Arial, Helvetica, sans-serif; color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7; padding:40px 20px;">
    <tr>
      <td align="center">
        <!-- Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 20px 40px; text-align:center;">
              <h1 style="margin:0; font-size:26px; color:#222222; font-weight:600;">
                sharehalo
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:20px 40px 40px 40px; font-size:16px; line-height:1.7; color:#555555;">
              <p style="margin-top:0;">
                Halo,
              </p>
              <p>
                Undangan pernikahan <strong>${data.groomName} &amp; ${data.brideName}</strong> telah berhasil dibuat di
                <strong>sharehalo</strong>. ✨
              </p>
              <p>
                Simpan tautan berikut dengan baik. Melalui halaman ini, Anda dapat mengelola
                undangan kapan saja, termasuk mengubah data, foto, musik, tema, serta melihat
                status pembayaran.
              </p>
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:30px auto;">
                <tr>
                  <td align="center"
                    style="border-radius:8px; background-color:#222222;">
                    <a href="${kelolaUrl}"
                      style="display:inline-block; padding:14px 28px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none;">
                      Buka Halaman Kelola Undangan
                    </a>
                  </td>
                </tr>
              </table>
              <p>
                Atau salin dan simpan tautan berikut:
              </p>
              <!-- Link Box -->
              <div style="padding:16px; background-color:#f5f5f5; border-radius:8px; word-break:break-all; font-size:13px; line-height:1.6;">
                <a href="${kelolaUrl}"
                  style="color:#555555; text-decoration:underline;">
                  ${kelolaUrl}
                </a>
              </div>
              <p style="margin-top:28px;">
                Sebaiknya simpan tautan ini agar Anda dapat kembali mengakses halaman
                pengelolaan undangan kapan saja.
              </p>
              <p>
                Terima kasih telah menggunakan <strong>sharehalo</strong>. 🤍
              </p>
              <p style="margin-top:32px; margin-bottom:0;">
                Salam hangat,<br>
                <strong>sharehalo</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px; text-align:center; background-color:#fafafa; font-size:12px; color:#999999;">
              © ${new Date().getFullYear()} sharehalo. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      })
    } catch (err) {
      console.error('Gagal mengirim email link kelola:', err)
    }
  }

  return res.status(201).json({ id: created.id, slug })
}
