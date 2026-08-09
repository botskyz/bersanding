import type { NextApiRequest, NextApiResponse } from 'next'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { pembayaran } from '@/lib/db/schema'
import { findMine, getToken } from '@/lib/session'
import { PREMIUM_PRICE } from '@/lib/themes'
import { Invoice } from '@/lib/xendit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = getToken(req)
  const u = token ? await findMine(token) : null
  if (!u) return res.status(401).json({ error: 'auth' })

  const parsed = z.object({ undanganId: z.string().min(1), theme: z.string().optional() }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  if (parsed.data.undanganId !== u.id) return res.status(403).json({ error: 'forbidden' })
  if (u.package === 'premium') return res.status(400).json({ error: 'already-premium' })

  const latest = await db
    .select()
    .from(pembayaran)
    .where(eq(pembayaran.undanganId, u.id))
    .orderBy(desc(pembayaran.createdAt))
    .limit(1)
  const pending = latest[0] && latest[0].status === 'PENDING' ? latest[0] : null
  if (pending?.invoiceUrl) return res.status(200).json({ invoiceUrl: pending.invoiceUrl })

  const origin = `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}`
  const externalId = `sanding-${crypto.randomUUID()}`

  try {
    const invoice = await Invoice.createInvoice({
      data: {
        externalId,
        amount: PREMIUM_PRICE,
        currency: 'IDR',
        description: `Undangan premium — ${u.groomName} & ${u.brideName}`,
        invoiceDuration: 86400,
        customer: { givenNames: u.groomName, email: u.email },
        successRedirectUrl: `${origin}/kelola?paid=1`,
        failureRedirectUrl: `${origin}/kelola?payment=failed`,
      },
    })
    await db.insert(pembayaran).values({
      undanganId: u.id,
      externalId,
      amount: PREMIUM_PRICE,
      status: 'PENDING',
      invoiceUrl: invoice.invoiceUrl,
      requestedTheme: parsed.data.theme ?? null,
    })
    return res.status(200).json({ invoiceUrl: invoice.invoiceUrl })
  } catch (err) {
    console.error('[xendit] create invoice failed:', err)
    return res.status(502).json({ error: 'xendit' })
  }
}
