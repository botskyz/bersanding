import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { findMine, getToken } from '@/lib/session'
import { coreSchema } from '@/lib/validation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end()

  const token = getToken(req)
  const u = token ? await findMine(token) : null
  if (!u) return res.status(401).json({ error: 'auth' })

  const { id } = req.query
  if (typeof id !== 'string' || id !== u.id) {
    return res.status(403).json({ error: 'forbidden' })
  }

  const parsed = coreSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid', issues: parsed.error.flatten() })
  }

  await db.update(undangan).set({ ...parsed.data }).where(eq(undangan.id, u.id))
  return res.status(200).json({ ok: true })
}
