import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>>
  client: ReturnType<typeof postgres>
}

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL ?? 'postgres://postgres@127.0.0.1:5432/app')
export const db = globalForDb.db ?? drizzle(client, { schema })
if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
  globalForDb.db = db
}
