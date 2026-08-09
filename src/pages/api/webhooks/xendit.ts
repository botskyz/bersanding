import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pembayaran, undangan } from '@/lib/db/schema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (req.headers['x-callback-token'] !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return res.status(401).end('Unauthorized')
  }

  const body = req.body ?? {}
  const externalId = typeof body.external_id === 'string' ? body.external_id : null
  const status = typeof body.status === 'string' ? body.status : null
  if (!externalId || !status) return res.status(400).end('Bad Request')

  const [pay] = await db
    .select()
    .from(pembayaran)
    .where(eq(pembayaran.externalId, externalId))
    .limit(1)
  if (!pay) return res.status(404).end('Not Found')

  if (status === 'PAID' || status === 'SETTLED') {
    await db
      .update(pembayaran)
      .set({ status: 'PAID', paidAt: body.paid_at ? new Date(body.paid_at) : new Date() })
      .where(eq(pembayaran.id, pay.id))
    const patch: { package: string; expiresAt: null; theme?: string } = {
      package: 'premium',
      expiresAt: null,
    }
    if (pay.requestedTheme) patch.theme = pay.requestedTheme
    await db.update(undangan).set(patch).where(eq(undangan.id, pay.undanganId))
  } else if (status === 'EXPIRED') {
    await db.update(pembayaran).set({ status: 'EXPIRED' }).where(eq(pembayaran.id, pay.id))
  }

  return res.status(200).end('OK')
}
