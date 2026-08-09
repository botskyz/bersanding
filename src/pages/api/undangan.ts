import type { NextApiRequest, NextApiResponse } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { slugFromNames } from '@/lib/invitation'
import { adminCookie } from '@/lib/session'
import { FREE_THEME } from '@/lib/themes'
import { undanganSchema } from '@/lib/validation'

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
  return res.status(201).json({ id: created.id, slug })
}
