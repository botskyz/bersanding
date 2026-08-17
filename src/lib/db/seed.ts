import { eq } from 'drizzle-orm'
import { db } from './index'
import { undangan, pembayaran } from './schema'
import { COVER_PRESETS, GALLERY_PRESETS, MUSIC_PRESETS } from '../photos'

// Contoh undangan agar produk terlihat hidup pada kunjungan pertama.
// Upsert per slug/externalId — aman dijalankan berulang.
async function seedUndangan(row: typeof undangan.$inferInsert) {
  const exists = await db
    .select({ id: undangan.id })
    .from(undangan)
    .where(eq(undangan.slug, row.slug!))
    .limit(1)
  if (exists.length > 0) {
    await db.update(undangan).set({ ...row }).where(eq(undangan.id, exists[0].id))
    return exists[0].id
  }
  const [created] = await db.insert(undangan).values(row).returning({ id: undangan.id })
  return created?.id ?? null
}

async function seedPayment(row: typeof pembayaran.$inferInsert) {
  const exists = await db
    .select({ id: pembayaran.id })
    .from(pembayaran)
    .where(eq(pembayaran.externalId, row.externalId!))
    .limit(1)
  if (exists.length > 0) {
    await db
      .update(pembayaran)
      .set({ status: row.status, method: row.method, requestedTheme: row.requestedTheme, paidAt: row.paidAt })
      .where(eq(pembayaran.id, exists[0].id))
    return
  }
  await db.insert(pembayaran).values(row)
}

export async function seed() {
  // Contoh premium — Botanical Garden, foto sampul & galeri, musik
  const andiSari = await seedUndangan({
    slug: 'andi-sari',
    adminToken: 'sample-andi-sari',
    email: 'sari.dewi@example.com',
    groomName: 'Andi Pratama',
    brideName: 'Sari Dewi',
    groomParents: 'Bapak Hendra Pratama & Ibu Ratna Wulandari',
    brideParents: 'Bapak Budi Santoso & Ibu Maya Anggraini',
    akadDate: '2026-11-14',
    akadTime: '09:00',
    akadLocation: 'Masjid Agung Al-Falah',
    akadAddress: 'Jl. Diponegoro No. 12, Bandung',
    resepsiDate: '2026-11-14',
    resepsiTime: '11:00',
    resepsiLocation: 'Gedung Sangkuriang',
    resepsiAddress: 'Jl. Asia Afrika No. 55, Bandung',
    story:
      'Kami dipertemukan di sebuah acara relawan pada 2019. Dari obrolan singkat soal kopi, tumbuh persahabatan, lalu cinta yang kami pelihara hingga hari ini.',
    quote:
      '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya." — QS. Ar-Rum: 21',
    guestName: 'Bapak/Ibu/Saudara/i',
    theme: 'botanical',
    colorId: 'botanical-classic',
    coverPhoto: COVER_PRESETS[0].url,
    gallery: GALLERY_PRESETS.slice(0, 4).map((p) => p.url),
    musicUrl: MUSIC_PRESETS[1].url,
    musicTitle: MUSIC_PRESETS[1].title,
    package: 'premium',
  })
  if (andiSari) {
    await seedPayment({
      undanganId: andiSari,
      externalId: 'sharehalo-seed-andi-sari',
      amount: 99000,
      status: 'PAID',
      method: 'QRIS',
      invoiceUrl: 'https://checkout.xendit.co/web/sharehalo-seed',
      requestedTheme: 'botanical',
      paidAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    })
  }

  // Contoh gratis — Gardenia Midnight, masih aktif 20 hari lagi
  await seedUndangan({
    slug: 'reza-nadia',
    adminToken: 'sample-reza-nadia',
    email: 'nadia.putri@example.com',
    groomName: 'Reza Maulana',
    brideName: 'Nadia Putri',
    groomParents: 'Bapak Irfan Maulana & Ibu Siti Aisyah',
    brideParents: 'Bapak Dedi Kurniawan & Ibu Lina Marlina',
    akadDate: '2026-09-26',
    akadTime: '08:00',
    akadLocation: 'Masjid Jami Al-Hidayah',
    akadAddress: 'Jl. Cempaka Putih No. 8, Yogyakarta',
    resepsiDate: '2026-09-27',
    resepsiTime: '10:00',
    resepsiLocation: 'Pendopo Agung Taman Sari',
    resepsiAddress: 'Jl. Taman Sari No. 21, Yogyakarta',
    story:
      'Kami bertemu di kereta jurusan Yogyakarta, duduk bersebelahan tanpa sengaja. Tiga jam perjalanan terasa singkat, dan sejak itu kami tidak pernah berhenti mengobrol.',
    quote: '"Sebaik-baik manusia adalah yang paling bermanfaat bagi sesamanya."',
    guestName: 'Bapak/Ibu/Saudara/i',
    theme: 'gardenia',
    colorId: 'midnight',
    coverPhoto: COVER_PRESETS[2].url,
    gallery: [GALLERY_PRESETS[1].url, GALLERY_PRESETS[2].url, GALLERY_PRESETS[5].url],
    musicUrl: MUSIC_PRESETS[0].url,
    musicTitle: MUSIC_PRESETS[0].title,
    package: 'free',
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  })
}
