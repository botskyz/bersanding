import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { adminCookie, findMine } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const parsed = z.object({ token: z.string().trim().min(8) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })

  const u = await findMine(parsed.data.token)
  if (!u) return res.status(404).json({ error: 'not-found' })

  res.setHeader('Set-Cookie', adminCookie(parsed.data.token))
  return res.status(200).json({ ok: true })
}
