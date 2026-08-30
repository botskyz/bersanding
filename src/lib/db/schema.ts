import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const undangan = pgTable('undangan', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').notNull().unique(),
  adminToken: text('admin_token').notNull().unique(),
  email: text('email').notNull(),
  groomName: text('groom_name').notNull(),
  brideName: text('bride_name').notNull(),
  groomParents: text('groom_parents').notNull(),
  brideParents: text('bride_parents').notNull(),
  akadDate: text('akad_date').notNull(),
  akadTime: text('akad_time').notNull(),
  akadLocation: text('akad_location').notNull(),
  akadAddress: text('akad_address').notNull(),
  resepsiDate: text('resepsi_date').notNull(),
  resepsiTime: text('resepsi_time').notNull(),
  resepsiLocation: text('resepsi_location').notNull(),
  resepsiAddress: text('resepsi_address').notNull(),
  story: text('story').notNull().default(''),
  quote: text('quote').notNull().default(''),
  guestName: text('guest_name').notNull().default('Bapak/Ibu/Saudara/i'),
  theme: text('theme').notNull().default('gardenia'),
  colorId: text('color_id').notNull().default('emerald'),
  coverPhoto: text('cover_photo').notNull().default(''),
  // Foto individual mempelai — terpisah dari coverPhoto/gallery, dipakai
  // khusus untuk kartu profil mempelai (mis. section "Couple" tema Botanical).
  groomPhoto: text('groom_photo').notNull().default(''),
  bridePhoto: text('bride_photo').notNull().default(''),
  gallery: jsonb('gallery').$type<string[]>().notNull().default([]),
  musicUrl: text('music_url').notNull().default(''),
  musicTitle: text('music_title').notNull().default(''),
  package: text('package').notNull().default('free'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const pembayaran = pgTable('pembayaran', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  undanganId: text('undangan_id')
    .notNull()
    .references(() => undangan.id),
  externalId: text('external_id').notNull().unique(),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('PENDING'),
  method: text('method'),
  invoiceUrl: text('invoice_url'),
  requestedTheme: text('requested_theme'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type UndanganRow = typeof undangan.$inferSelect
export type PembayaranRow = typeof pembayaran.$inferSelect
