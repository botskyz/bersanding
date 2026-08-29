import { z } from 'zod'

const dateRe = /^\d{4}-\d{2}-\d{2}$/
// Terima: "09:00" (jam tunggal), "09:00-11:00" (rentang), atau "09:00-selesai"
const timeRe = /^([01]\d|2[0-3]):[0-5]\d(-(([01]\d|2[0-3]):[0-5]\d|selesai))?$/

// Foto (URL atau data-url hasil upload) dan musik (URL atau data-url audio).
// Data-url dibatasi agar kolom DB tidak membengkak.
export const imageRef = z
  .string()
  .max(1_200_000, 'Foto terlalu besar — pilih foto yang lebih kecil')
  .refine((s) => s === '' || s.startsWith('data:image/') || /^https?:\/\//.test(s), 'URL foto tidak valid')

export const audioRef = z
  .string()
  .max(9_000_000, 'Musik terlalu besar — maksimal 6 MB')
  .refine((s) => s === '' || s.startsWith('data:audio/') || /^https?:\/\//.test(s), 'URL musik tidak valid')

export const mediaSchema = z.object({
  coverPhoto: imageRef.optional(),
  gallery: z.array(imageRef).max(6, 'Maksimal 6 foto galeri').optional(),
  musicUrl: audioRef.optional(),
  musicTitle: z.string().trim().max(100, 'Judul musik maksimal 100 huruf').optional(),
})

// Data inti undangan — dipakai untuk edit (tanpa media, agar media tidak terhapus).
export const coreSchema = z.object({
  groomName: z.string().trim().min(2, 'Nama minimal 2 huruf'),
  brideName: z.string().trim().min(2, 'Nama minimal 2 huruf'),
  groomParents: z.string().trim().min(3, 'Tulis nama orang tua (contoh: Bapak A & Ibu B)'),
  brideParents: z.string().trim().min(3, 'Tulis nama orang tua (contoh: Bapak A & Ibu B)'),
  akadDate: z.string().regex(dateRe, 'Tanggal tidak valid'),
  akadTime: z.string().regex(timeRe, 'Jam tidak valid (contoh: 09:00 atau 09:00-11:00)'),
  akadLocation: z.string().trim().min(2, 'Tulis nama tempat'),
  akadAddress: z.string().trim().min(3, 'Tulis alamat lengkap'),
  resepsiDate: z.string().regex(dateRe, 'Tanggal tidak valid'),
  resepsiTime: z.string().regex(timeRe, 'Jam tidak valid (contoh: 11:00 atau 11:00-selesai)'),
  resepsiLocation: z.string().trim().min(2, 'Tulis nama tempat'),
  resepsiAddress: z.string().trim().min(3, 'Tulis alamat lengkap'),
  story: z.string().trim().max(600, 'Maksimal 600 huruf').optional().default(''),
  quote: z.string().trim().max(200, 'Maksimal 200 huruf').optional().default(''),
  guestName: z
    .string()
    .trim()
    .min(2, 'Tulis sapaan tamu')
    .default('Bapak/Ibu/Saudara/i'),
  email: z.string().trim().email('Email tidak valid'),
})

// Skema lengkap — dipakai saat membuat undangan (termasuk foto & musik).
export const undanganSchema = coreSchema.extend({
  coverPhoto: imageRef.default(''),
  gallery: z.array(imageRef).max(6, 'Maksimal 6 foto galeri').default([]),
  musicUrl: audioRef.default(''),
  musicTitle: z.string().trim().max(100).default(''),
})

export type UndanganInput = z.infer<typeof undanganSchema>
export type CoreInput = z.infer<typeof coreSchema>
