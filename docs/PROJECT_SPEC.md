# Spesifikasi Project Bersanding (sharehalo)

## 1. Ringkasan Proyek
Bersanding (nama brand: **sharehalo**) adalah aplikasi web untuk membuat undangan pernikahan digital yang modern, cepat, dan dapat dibagikan lewat link. Pengguna dapat membuat undangan, memilih tema, menambahkan foto/galeri, musik latar, serta melakukan upgrade ke paket Premium melalui pembayaran Xendit.

**Proposisi nilai:** *"Kabarkan hari bahagia dengan indah — isi data, pilih tema, bagikan link. Undangan digital siap dalam satu menit."*

## 2. Tujuan Utama
- Memudahkan calon pengantin membuat undangan digital tanpa perlu desain manual.
- Menyediakan pengalaman edit yang sederhana melalui halaman kelola.
- Mendukung pembagian link undangan ke tamu secara praktis.
- Menyediakan opsi Premium untuk tema yang lebih lengkap dan masa aktif yang lebih lama.

## 3. Target Pengguna
Calon pasangan pengantin (umumnya di Indonesia) yang ingin membuat undangan digital tanpa jasa desainer atau kemampuan teknis, dengan preferensi budaya religius (teks berbahasa Indonesia, elemen Islami seperti Assalamu'alaikum/QS. Ar-Rum sebagai default pada beberapa tema).

## 4. Fitur Inti
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
- Menggunakan cookie admin (token per-undangan) untuk otorisasi — **bukan** sistem akun email/password tradisional.

### D. Paket Gratis dan Premium
- Paket Gratis: tema yang ditandai `premium: false` (saat ini: Gardenia, Botanical Garden), aktif 30 hari.
- Paket Premium (Rp 99.000 sekali bayar): semua tema terbuka, masa aktif tak terbatas.
- Integrasi pembayaran via Xendit (QRIS, e-wallet, transfer).

### E. Media dan Interaksi
- Upload/preview foto sampul dan galeri.
- Pilihan musik latar dari preset atau URL/data audio.
- Efek parallax dan dekorasi visual.

## 5. Stack Teknologi
- Next.js 15 (Pages Router)
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- Xendit Node SDK
- Zod untuk validasi
- Lucide React untuk ikon
- `next/font/google` untuk manajemen font (di-load terpusat di `src/pages/_app.tsx`)

## 6. Struktur Folder Utama
- `src/pages` : halaman Next.js dan API routes
- `src/components` : komponen UI reusable
- `src/components/themes/{nama-tema}/` : komponen khusus untuk tema ilustrasi (lihat bagian 13)
- `src/lib` : helper, validasi, database, session, integrasi pembayaran
- `src/lib/db` : schema dan konfigurasi database
- `public/theme-{nama-tema}/` : aset gambar untuk tema ilustrasi
- `scripts` : utility untuk seed data
- `docs` : dokumentasi project (file ini + `PANDUAN-TEMA-ILUSTRASI.md`)

## 7. Alur Aplikasi
1. Pengguna membuka halaman `/buat`.
2. Pengguna mengisi data undangan melalui wizard.
3. Sistem membuat data undangan dan menyimpan token admin di cookie.
4. Pengguna diarahkan ke halaman tema dan kemudian ke halaman kelola.
5. Pengguna dapat membagikan link undangan publik ke tamu.
6. Jika ingin upgrade ke Premium, pengguna melakukan pembayaran melalui Xendit.

## 8. Basis Data
Project ini menggunakan PostgreSQL dengan dua tabel utama:
- `undangan` : data utama undangan
- `pembayaran` : data transaksi pembayaran

Skema didefinisikan di `src/lib/db/schema.ts`.

**Field penting di tabel `undangan`:** slug, adminToken, email, groomName, brideName, groomParents, brideParents, akadDate/Time/Location/Address, resepsiDate/Time/Location/Address, story, quote, guestName, theme, colorId, coverPhoto, gallery (array), musicUrl, musicTitle, package ('free'|'premium'), expiresAt.

**Keterbatasan yang diketahui saat ini:**
- Tidak ada field foto individual per mempelai (cuma `coverPhoto` tunggal + array `gallery`). Konvensi sementara kalau tema butuh 2 foto terpisah: foto mempelai pria = `coverPhoto`, foto mempelai wanita = `gallery[0]`.
- Field `quote` awalnya untuk ayat/kutipan religius, `story` untuk cerita cinta personal — beberapa tema ilustrasi bisa me-remap kegunaan field ini secara visual, perlu konsisten saat bikin tema baru.

## 9. Environment Variables
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

## 10. Step-by-Step Setup Lokal
### Langkah 1: Persyaratan
- Node.js 20+
- npm
- PostgreSQL berjalan dan siap dipakai

### Langkah 2: Install Dependensi
```bash
npm install
```

### Langkah 3: Siapkan File Environment
Buat file `.env.local` berdasarkan contoh di bagian 9, sesuaikan nilai untuk environment lokal.

### Langkah 4: Buat Database PostgreSQL
```sql
CREATE DATABASE app;
```

### Langkah 5: Jalankan Migrasi Schema
```bash
npx drizzle-kit push
```

Alternatif lewat endpoint admin:
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
Aplikasi berjalan di http://localhost:8080

### Langkah 8: Verifikasi
- Halaman utama di `/`
- Wizard pembuatan undangan di `/buat`
- Halaman tema di `/tema`
- Halaman kelola setelah undangan dibuat
- Halaman publik undangan di `/u/[slug]`

## 11. Perintah Pengembangan
```bash
npm run dev        # menjalankan development server
npm run build      # build production
npm run start      # menjalankan build hasil produksi
npm run check      # cek TypeScript
npm run seed       # menjalankan seed data
```

## 12. Catatan Deployment
- Dockerfile sudah disediakan untuk deployment container.
- Aplikasi production tidak menjalankan migrasi otomatis saat startup; migrasi harus dijalankan melalui endpoint admin dengan secret yang benar.
- Untuk environment produksi (misal Vercel), pastikan `DATABASE_URL` (pakai Postgres online, bukan `127.0.0.1`), `XENDIT_SECRET_KEY`, dan `XENDIT_WEBHOOK_TOKEN` sudah diatur dengan aman lewat dashboard environment variables.

---

## 13. Sistem Tema

Ada **dua jenis tema** yang berjalan berdampingan lewat satu titik percabangan di `src/components/Invitation.tsx`:

### 13.a Tema CSS-variable (generik)
Satu template dipakai bersama, tampilan diatur lewat CSS custom property (`--t-bg`, `--t-accent`, `--t-gold`, dst) yang didefinisikan di `src/styles/global.css` per `.theme-{id}` dan `[data-variant='...']`. Contoh: Gardenia, Buket, Anggrek, Sakura.

### 13.b Tema ilustrasi (custom, berbasis aset gambar)
Komponen React terpisah per section, pakai gambar asli sebagai latar/dekorasi, tidak terikat sistem warna generik. Contoh: **Botanical Garden**.

Struktur folder & komponen, teknik CSS yang sudah terbukti jalan (full-bleed, cara menempatkan teks aman di dalam ilustrasi dekoratif, dll), serta checklist lengkap untuk menambah tema ilustrasi baru — semua didokumentasikan terpisah di **`docs/PANDUAN-TEMA-ILUSTRASI.md`**.

Semua tema (kedua jenis) didaftarkan di satu tempat: `src/lib/themes.ts` (array `THEMES`), yang otomatis dipakai oleh halaman pemilihan tema (`/tema`) dan kartu preview (`ThemePreview.tsx`).

## 14. Brand Guidelines (sharehalo)

| Elemen | Nilai |
|---|---|
| Logo | wordmark "sharehalo" (biru, huruf kecil semua, aksen kursif di "halo") |
| Warna krem/latar | `#FFF6E3` |
| Warna gold | `#CFB32B` |
| Warna biru (primary/CTA) | `#006AFE` |
| Warna oranye (aksen sekunder) | `#FE6F26` |
| Warna teks/ink | `#1A1A2E` |
| Font body & display (brand) | Bricolage Grotesque |
| Font tema undangan | bervariasi per tema (Cormorant, Playfair, Fraunces, dll — terpisah dari font brand) |

> Warna & font di atas untuk **UI situs** (landing page, tombol, form) — BUKAN untuk isi undangan itu sendiri, yang punya palet sendiri per tema (lihat bagian 13).

## 15. Pertanyaan Terbuka / Belum Diputuskan
- [ ] Apakah perlu field foto individual per mempelai di database (lihat bagian 8)?
- [ ] Apakah perlu fitur RSVP/konfirmasi kehadiran tamu? (belum ada di kode saat ini)
- [ ] Apakah tema ilustrasi baru akan reuse struktur 7-section yang sama (Cover, Events, Couple, Story, Quote, Gallery, Closing) atau ada yang butuh section berbeda?
- [ ] Kebijakan lisensi komersial untuk aset ilustrasi pihak ketiga.

---

## 16. Template Prompt — Permintaan Tema/Fitur Baru

Bagian ini untuk dipakai **langsung sebagai prompt** ke Claude (atau siapa pun yang mengerjakan) supaya konteks yang dibutuhkan selalu lengkap sejak awal, tidak perlu tanya-jawab bolak-balik dari nol.

### 16.a Template: Tema ilustrasi baru

```
Saya mau tambah tema ilustrasi baru untuk sharehalo bernama "{NAMA_TEMA}".

Konteks project:
- Baca dulu docs/PANDUAN-TEMA-ILUSTRASI.md untuk konvensi struktur folder & komponen
  yang sudah dipakai (contoh: tema Botanical Garden).
- Ikuti pola folder: public/theme-{nama-tema-kebab-case}/page-{n}/
- Ikuti pola komponen: src/components/themes/{nama-tema-kebab-case}/
  {Nama}Cover.tsx, {Nama}Events.tsx, {Nama}Couple.tsx, {Nama}Story.tsx,
  {Nama}Quote.tsx, {Nama}Gallery.tsx, {Nama}Closing.tsx, {Nama}Invitation.tsx

Yang saya siapkan:
- [ ] File aset mockup (referensi visual tiap section)
- [ ] File aset visual terpisah (PNG/SVG per elemen)
- [ ] Font yang mau dipakai (nama font Google Fonts / kalau custom, filenya)
- [ ] Palet warna (hex code) kalau ada

Status tema: [ ] Gratis  [ ] Premium

Mulai dari section Cover dulu, baru lanjut satu-satu ke section berikutnya setelah
saya konfirmasi tiap section sudah sesuai mockup.
```

### 16.b Template: Perubahan/fitur di luar tema (data, halaman, dll)

```
Saya mau {JELASKAN PERUBAHAN}.

Konteks yang relevan:
- File/halaman yang kemungkinan terkait: {sebutkan kalau tahu, misal
  src/pages/kelola.tsx, src/lib/db/schema.ts, dst}
- Apakah ini perlu perubahan skema database? [ ] Ya [ ] Tidak [ ] Tidak yakin
- Apakah ini spesifik untuk satu tema tertentu, atau semua tema? {jawab}

Saya akan kirim isi file terkait kalau diminta — jangan menebak struktur kode yang
belum pernah dilihat.
```

### 16.c Kebiasaan kerja yang perlu diikuti (supaya tidak ada insiden seperti sebelumnya)

- **Commit sesering mungkin** setelah satu section/fitur selesai dan sudah dites di browser — jangan menumpuk banyak perubahan belum ter-commit.
- **Hindari operasi folder massal** (`mv`/`mkdir` dengan banyak path sekaligus, apalagi pakai `{a,b,c}` brace expansion) — riwayat project ini pernah kena masalah serius karena ini. Kalau perlu pindah banyak file, lakukan **satu per satu** dan pakai `git mv` (bukan `mv` biasa) supaya git tetap melacak histori dan lebih mudah di-rollback kalau salah.
- Sebelum reorganisasi struktur folder apa pun, pastikan dulu semua perubahan sebelumnya **sudah ter-commit**.

## 17. Ringkasan Pengembangan
Project ini cocok untuk dipakai sebagai platform sederhana untuk undangan digital wedding. Fokus utama aplikasi adalah pengalaman pembuatan undangan yang cepat, halaman publik yang cantik, dan manajemen konten yang mudah — dengan sistem tema yang bisa terus berkembang (lihat bagian 13 dan 16).
