# Spesifikasi Project Bersanding

## 1. Ringkasan Proyek
Bersanding adalah aplikasi web untuk membuat undangan pernikahan digital yang modern, cepat, dan dapat dibagikan lewat link. Pengguna dapat membuat undangan, memilih tema, menambahkan foto/galeri, musik latar, serta melakukan upgrade ke paket Premium melalui pembayaran Xendit.

## 2. Tujuan Utama
- Memudahkan calon pengantin membuat undangan digital tanpa perlu desain manual.
- Menyediakan pengalaman edit yang sederhana melalui halaman kelola.
- Mendukung pembagian link undangan ke tamu secara praktis.
- Menyediakan opsi Premium untuk tema yang lebih lengkap dan masa aktif yang lebih lama.

## 3. Fitur Inti
### A. Pembuatan Undangan
- Wizard multi-step untuk mengisi data pasangan, acara, cerita, sapaan tamu, serta media.
- Generasi slug undangan otomatis berdasarkan nama pasangan.
- Penyimpanan data ke database PostgreSQL.

### B. Halaman Undangan Publik
- Halaman publik per undangan dengan route `/u/[slug]`.
- Menampilkan data acara, foto, musik, tema, dan detail pasangan.

### C. Kelola Undangan
- Halaman kelola untuk edit konten undangan.
- Mengubah data inti, foto, galeri, tema, dan status pembayaran.
- Menggunakan cookie admin untuk otorisasi sederhana.

### D. Paket Gratis dan Premium
- Paket Gratis: tema Gardenia, aktif 30 hari, fitur dasar.
- Paket Premium: semua tema, warna lebih banyak, dan masa aktif tak terbatas.
- Integrasi pembayaran via Xendit.

### E. Media dan Interaksi
- Upload/preview foto sampul dan galeri.
- Pilihan musik latar dari preset atau URL/data audio.
- Efek parallax dan dekorasi visual.

## 4. Stack Teknologi
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- Xendit Node SDK
- Zod untuk validasi
- Lucide React untuk ikon

## 5. Struktur Folder Utama
- `src/pages` : halaman Next.js dan API routes
- `src/components` : komponen UI reusable
- `src/lib` : helper, validasi, database, session, integrasi pembayaran
- `src/lib/db` : schema dan konfigurasi database
- `scripts` : utility untuk seed data
- `docs` : dokumentasi project

## 6. Alur Aplikasi
1. Pengguna membuka halaman `/buat`.
2. Pengguna mengisi data undangan melalui wizard.
3. Sistem membuat data undangan dan menyimpan token admin di cookie.
4. Pengguna diarahkan ke halaman tema dan kemudian ke halaman kelola.
5. Pengguna dapat membagikan link undangan publik ke tamu.
6. Jika ingin upgrade ke Premium, pengguna melakukan pembayaran melalui Xendit.

## 7. Basis Data
Project ini menggunakan PostgreSQL dengan dua tabel utama:
- `undangan` : data utama undangan
- `pembayaran` : data transaksi pembayaran

Skema didefinisikan di `src/lib/db/schema.ts`.

## 8. Environment Variables
Buat file `.env.local` di root project dengan variabel berikut:

```env
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/app
XENDIT_SECRET_KEY=your_xendit_secret_key
XENDIT_WEBHOOK_TOKEN=your_webhook_token
MIGRATE_SECRET=your_migration_secret
SEED_SECRET=your_seed_secret
NEXT_PUBLIC_IS_PLAYGROUND=false
```

### Penjelasan singkat
- `DATABASE_URL` : koneksi PostgreSQL.
- `XENDIT_SECRET_KEY` : diperlukan agar fitur pembayaran bisa dibuat.
- `XENDIT_WEBHOOK_TOKEN` : digunakan untuk memvalidasi webhook Xendit.
- `MIGRATE_SECRET` : dipakai saat memanggil endpoint migrasi.
- `SEED_SECRET` : dipakai saat menjalankan seeding admin.
- `NEXT_PUBLIC_IS_PLAYGROUND` : opsional, untuk mode playground.

> Jika `XENDIT_SECRET_KEY` belum diatur, fitur pembayaran akan muncul sebagai tidak aktif atau gagal pada runtime.

## 9. Step-by-Step Setup Lokal
### Langkah 1: Persyaratan
Pastikan perangkat sudah punya:
- Node.js 20+
- npm
- PostgreSQL berjalan dan siap dipakai

### Langkah 2: Install Dependensi
```bash
npm install
```

### Langkah 3: Siapkan File Environment
Buat file `.env.local` berdasarkan contoh di atas, lalu sesuaikan nilai sesuai environment lokal.

### Langkah 4: Buat Database PostgreSQL
Buat database yang sesuai dengan `DATABASE_URL`, misalnya:
```sql
CREATE DATABASE app;
```

### Langkah 5: Jalankan Migrasi Schema
Gunakan perintah berikut:
```bash
npx drizzle-kit push
```

Alternatif jika ingin lewat endpoint admin:
```bash
curl -X POST http://localhost:8080/api/admin/migrate \
  -H "x-migrate-secret: your_migration_secret"
```

### Langkah 6: Jalankan Seed Data (opsional)
```bash
npm run seed
```

### Langkah 7: Jalankan Aplikasi
```bash
npm run dev
```

Aplikasi akan berjalan di:
- http://localhost:8080

### Langkah 8: Verifikasi
Cek fitur berikut:
- Halaman utama di `/`
- Wizard pembuatan undangan di `/buat`
- Halaman tema di `/tema`
- Halaman kelola setelah undangan dibuat
- Halaman publik undangan di `/u/[slug]`

## 10. Perintah Pengembangan
```bash
npm run dev        # menjalankan development server
npm run build      # build production
npm run start      # menjalankan build hasil produksi
npm run check      # cek TypeScript
npm run seed       # menjalankan seed data
```

## 11. Catatan Deployment
- Dockerfile sudah disediakan untuk deployment container.
- Aplikasi production tidak menjalankan migrasi otomatis saat startup; migrasi harus dijalankan melalui endpoint admin dengan secret yang benar.
- Untuk environment produksi, pastikan `DATABASE_URL`, `XENDIT_SECRET_KEY`, dan `XENDIT_WEBHOOK_TOKEN` sudah diatur dengan aman.

## 12. Ringkasan Pengembangan
Project ini cocok untuk dipakai sebagai platform sederhana untuk undangan digital wedding. Fokus utama aplikasi adalah pengalaman pembuatan undangan yang cepat, halaman publik yang cantik, dan manajemen konten yang mudah.
