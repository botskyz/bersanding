import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { findMine, getToken } from '@/lib/session'
import { mediaSchema } from '@/lib/validation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = getToken(req)
  const u = token ? await findMine(token) : null
  if (!u) return res.status(401).json({ error: 'auth' })

  const { id } = req.query
  if (typeof id !== 'string' || id !== u.id) {
    return res.status(403).json({ error: 'forbidden' })
  }

  const parsed = mediaSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid', issues: parsed.error.flatten() })
  }

  const patch: Record<string, unknown> = {}
  if (parsed.data.coverPhoto !== undefined) patch.coverPhoto = parsed.data.coverPhoto
  if (parsed.data.gallery !== undefined) patch.gallery = parsed.data.gallery
  if (parsed.data.musicUrl !== undefined) patch.musicUrl = parsed.data.musicUrl
  if (parsed.data.musicTitle !== undefined) patch.musicTitle = parsed.data.musicTitle
  if (Object.keys(patch).length === 0) return res.status(400).json({ error: 'empty' })

  await db.update(undangan).set(patch as typeof undangan.$inferInsert).where(eq(undangan.id, u.id))
  return res.status(200).json({ ok: true })
}
