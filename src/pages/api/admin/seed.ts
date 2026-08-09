import type { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import { seed } from '@/lib/db/seed'

// Production has no shell access, so this is how an operator seeds the
// deployed database after publish: POST here with the SEED_SECRET they
// configured as an env var. Fails closed if SEED_SECRET isn't set.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const expected = process.env.SEED_SECRET
  if (!expected) return res.status(503).json({ error: 'SEED_SECRET is not configured' })

  const provided = req.headers['x-seed-secret']
  const providedBuf = Buffer.from(typeof provided === 'string' ? provided : '')
  const expectedBuf = Buffer.from(expected)
  const match = providedBuf.length === expectedBuf.length && timingSafeEqual(providedBuf, expectedBuf)
  if (!match) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await seed()
    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Seed failed' })
  }
}
