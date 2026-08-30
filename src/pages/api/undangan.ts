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
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1a1a2e;">
            <p>Halo,</p>
            <p>Undangan <strong>${data.groomName} &amp; ${data.brideName}</strong> sudah berhasil dibuat di sharehalo.</p>
            <p>Simpan link berikut baik-baik — dari sini kamu bisa mengubah data, foto, musik, tema, dan melihat status pembayaran kapan saja:</p>
            <p style="margin: 24px 0;">
              <a href="${kelolaUrl}" style="background:#006afe;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">
                Buka halaman kelola
              </a>
            </p>
            <p style="font-size: 13px; color: #6b6b76;">Atau salin link ini: ${kelolaUrl}</p>
            <p style="margin-top: 32px; font-size: 13px; color: #6b6b76;">— sharehalo</p>
          </div>
        `,
      })
    } catch (err) {
      console.error('Gagal mengirim email link kelola:', err)
    }
  }

  return res.status(201).json({ id: created.id, slug })
}
