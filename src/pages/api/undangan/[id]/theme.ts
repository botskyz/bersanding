import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { findMine, getToken } from '@/lib/session'
import { THEMES } from '@/lib/themes'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = getToken(req)
  const u = token ? await findMine(token) : null
  if (!u) return res.status(401).json({ error: 'auth' })
  const { id } = req.query
  if (typeof id !== 'string' || id !== u.id) {
    return res.status(403).json({ error: 'forbidden' })
  }
  const parsed = z
    .object({ theme: z.string().min(1), colorId: z.string().optional() })
    .safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  const theme = THEMES.find((t) => t.id === parsed.data.theme)
  if (!theme) return res.status(400).json({ error: 'invalid' })
  if (theme.premium && u.package !== 'premium') {
    return res.status(403).json({ error: 'premium-required' })
  }
  // Selalu simpan varian yang valid untuk tema tersebut (fallback ke varian pertama).
  const colorId =
    parsed.data.colorId && theme.variants.some((v) => v.id === parsed.data.colorId)
      ? parsed.data.colorId
      : theme.variants[0].id
  await db.update(undangan).set({ theme: theme.id, colorId }).where(eq(undangan.id, u.id))
  return res.status(200).json({ ok: true })
}
