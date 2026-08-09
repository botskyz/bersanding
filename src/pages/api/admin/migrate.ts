import type { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import { execFile } from 'child_process'
import { promisify } from 'util'

const run = promisify(execFile)

let migrating = false

// Production has no shell access, so this is how the schema reaches the deployed
// database: POST here with the MIGRATE_SECRET configured as an env var. This is
// deliberately NOT on the container's startup path — running it there made every
// cold start pay for a schema diff, let a momentary database failure stop the app
// from booting at all, and raced when Cloud Run brought up several instances at
// once. Fails closed if MIGRATE_SECRET isn't set.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const expected = process.env.MIGRATE_SECRET
  if (!expected) return res.status(503).json({ error: 'MIGRATE_SECRET is not configured' })

  const provided = req.headers['x-migrate-secret']
  const providedBuf = Buffer.from(typeof provided === 'string' ? provided : '')
  const expectedBuf = Buffer.from(expected)
  const match = providedBuf.length === expectedBuf.length && timingSafeEqual(providedBuf, expectedBuf)
  if (!match) return res.status(401).json({ error: 'Unauthorized' })

  if (migrating) return res.status(409).json({ error: 'Migration already in progress' })

  migrating = true
  try {
    const { stdout } = await run('npx', ['drizzle-kit', 'push'], { cwd: process.cwd() })
    return res.status(200).json({ ok: true, output: stdout })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Migration failed' })
  } finally {
    migrating = false
  }
}
