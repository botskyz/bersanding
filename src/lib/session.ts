import type { NextApiRequest } from 'next'
import type { GetServerSidePropsContext } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'

export const ADMIN_COOKIE = 'sanding_admin'

export const cookieSameSite =
  process.env.NEXT_PUBLIC_IS_PLAYGROUND === 'true' ? 'none' : 'strict'

export function adminCookie(value: string, maxAge = 60 * 60 * 24 * 365): string {
  const partitioned = cookieSameSite === 'none' ? '; Partitioned' : ''
  return `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=${cookieSameSite}${partitioned}; Max-Age=${maxAge}`
}

export function getToken(req: NextApiRequest | GetServerSidePropsContext['req']): string | null {
  return req.cookies[ADMIN_COOKIE] ?? null
}

export async function findMine(token: string) {
  if (!token) return null
  const rows = await db.select().from(undangan).where(eq(undangan.adminToken, token)).limit(1)
  return rows[0] ?? null
}
