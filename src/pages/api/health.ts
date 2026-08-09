import type { NextApiRequest, NextApiResponse } from 'next'

// Next Pages Router API route: src/pages/api/*.ts default-exports a handler.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true, ts: Date.now() })
}

// Example POST handler with validation:
// import { z } from 'zod'
// const Body = z.object({ name: z.string() })
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
//   const parsed = Body.safeParse(req.body)
//   if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
//   return res.status(200).json({ received: parsed.data })
// }
