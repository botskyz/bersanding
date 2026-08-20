# PRD & Spesifikasi Produk — sharehalo

**Undangan Digital Pernikahan**
Versi dokumen: 1.0 · Terakhir diperbarui: berdasarkan progres pengembangan sampai saat ini

---

## 1. Ringkasan Produk

**sharehalo** adalah platform pembuatan undangan pernikahan digital. Pengguna mengisi
data (nama mempelai, tanggal, lokasi acara, dll), memilih tema visual, lalu mendapat
tautan undangan siap dibagikan — tanpa perlu membuat akun.

**Proposisi nilai utama:** *"Kabarkan hari bahagia dengan indah — isi data, pilih
tema, bagikan link. Undangan digital siap dalam satu menit."*

---

## 2. Target Pengguna

Calon pasangan pengantin (umumnya di Indonesia) yang ingin membuat undangan digital
tanpa perlu jasa desainer atau kemampuan teknis, dengan preferensi budaya religius
(teks undangan berbahasa Indonesia, elemen Islami seperti Assalamu'alaikum/QS. Ar-Rum
sebagai default).

---

## 3. Model Bisnis

| Paket | Harga | Akses tema |
|---|---|---|
| Gratis | Rp 0 | Tema yang ditandai `premium: false` saja (saat ini: Gardenia, Botanical Garden) |
| Premium | Rp 99.000 sekali bayar | Semua tema terbuka selamanya |

- Pembayaran lewat **Xendit** (QRIS, e-wallet, transfer).
- Tanpa sistem akun/login konvensional — akses ke halaman kelola undangan
  menggunakan **token admin per-undangan** (bukan email+password).

---

## 4. Fitur Inti (berdasarkan halaman & API yang sudah ada)

| Fitur | Halaman/Endpoint terkait |
|---|---|
| Landing page | `/` |
| Form buat undangan | `/buat` |
| Pilih tema & warna | `/tema` |
| Kelola undangan (lihat/edit data, ganti foto) | `/kelola` |
| Upgrade ke Premium | `/bayar` |
| Halaman undangan publik | `/u/[slug]` |
| Ganti tema/warna | `POST /api/undangan/[id]/theme` |
| Ganti foto/media | `POST /api/undangan/[id]/media` |
| Update data undangan | `POST /api/undangan/[id]` |
| Buat undangan baru | `POST /api/undangan` |
| Pembayaran | `POST /api/payments`, webhook di `/api/webhooks/xendit` |
| Migrasi & seed database (admin) | `/api/admin/migrate`, `/api/admin/seed` |

**Konten yang bisa diisi per undangan:** nama & orang tua kedua mempelai, tanggal/
waktu/lokasi/alamat Akad dan Resepsi, cerita cinta (`story`), kutipan/ayat (`quote`),
nama tamu (untuk personalisasi "Kepada Yth."), tema + varian warna, foto sampul,
galeri foto (array), musik latar.

---

## 5. Tech Stack

- **Framework:** Next.js 15 (Pages Router), React 19, TypeScript
- **Styling:** Tailwind CSS + CSS custom properties untuk sistem tema
- **Database:** PostgreSQL, diakses lewat Drizzle ORM (`drizzle-kit push` untuk migrasi)
- **Pembayaran:** Xendit (`xendit-node`)
- **Autentikasi:** Token admin per-undangan lewat cookie (`src/lib/session.ts`), bukan
  sistem akun tradisional
- **Font:** `next/font/google`, di-load terpusat di `src/pages/_app.tsx`
- **Hosting:** Vercel (target deployment)
- **Deteksi paket:** `bcryptjs`, `zod` (validasi), `jose` (JWT/token), `lucide-react`
  (ikon)

---

## 6. Struktur Data Inti (tabel `undangan`, ringkas)

```
slug, adminToken, email,
groomName, brideName, groomParents, brideParents,
akadDate, akadTime, akadLocation, akadAddress,
resepsiDate, resepsiTime, resepsiLocation, resepsiAddress,
story, quote, guestName,
theme, colorId,
coverPhoto, gallery (array),
musicUrl, musicTitle,
package ('free' | 'premium'), expiresAt,
createdAt, updatedAt
```

**Keterbatasan yang diketahui saat ini:**
- Tidak ada field foto individual per mempelai (cuma `coverPhoto` tunggal + array
  `gallery`) — kalau desain tema butuh 2 foto terpisah, konvensi sementara: foto
  mempelai pria = `coverPhoto`, foto mempelai wanita = `gallery[0]`.
- Field `quote` awalnya dimaksudkan untuk ayat/kutipan religius, `story` untuk cerita
  cinta personal. Tema ilustrasi (misal Botanical Garden) kadang me-remap kegunaan
  field ini secara visual (lihat dokumen tema terkait) — perlu diperhatikan supaya
  konsisten kalau bikin tema baru.
- Undangan paket gratis punya `expiresAt` (kedaluwarsa); paket premium tidak.

---

## 7. Sistem Tema

Ada **dua jenis tema** yang berjalan berdampingan lewat satu titik percabangan di
`src/components/Invitation.tsx`:

### 7.1 Tema CSS-variable (generik)
Satu template dipakai bersama, tampilan diatur lewat CSS custom property
(`--t-bg`, `--t-accent`, `--t-gold`, dst) yang didefinisikan di
`src/styles/global.css` per `.theme-{id}` dan `[data-variant='...']`.
Contoh: Gardenia, Buket, Anggrek, Sakura.

### 7.2 Tema ilustrasi (custom, berbasis aset gambar)
Komponen React terpisah per section, pakai gambar asli sebagai latar/dekorasi, tidak
terikat sistem warna generik. Contoh: **Botanical Garden**.

Struktur folder & komponen, teknik CSS yang sudah terbukti jalan (full-bleed, cara
menempatkan teks aman di dalam ilustrasi dekoratif, dll), serta checklist lengkap
untuk menambah tema ilustrasi baru — semua didokumentasikan terpisah di:

📄 **`PANDUAN-TEMA-ILUSTRASI.md`** (di root project)

Semua tema (kedua jenis) didaftarkan di satu tempat: `src/lib/themes.ts`
(array `THEMES`), yang otomatis dipakai oleh halaman pemilihan tema (`/tema`) dan
kartu preview (`ThemePreview.tsx`).

---

## 8. Brand Guidelines (sharehalo)

| Elemen | Nilai |
|---|---|
| Logo | wordmark "sharehalo" (biru, huruf kecil semua, aksen kursif di "halo") |
| Warna krem/latar | `#FFF6E3` |
| Warna gold | `#CFB32B` |
| Warna biru (primary/CTA) | `#006AFE` |
| Warna oranye (aksen sekunder) | `#FE6F26` |
| Warna teks/ink | `#1A1A2E` |
| Font body & display (brand) | Bricolage Grotesque |
| Font tema undangan | bervariasi per tema (Cormorant, Playfair, Fraunces, dll —
  terpisah dari font brand, jangan tertukar) |

> Catatan: warna & font di atas untuk **UI situs** (landing page, tombol, form) —
> BUKAN untuk isi undangan itu sendiri, yang punya palet sendiri per tema (lihat
> bagian 7).

---

## 9. Non-Functional Requirements

- **Mobile-first**: mayoritas pengguna membuka undangan lewat HP; semua desain tema
  wajib dites di viewport mobile dulu (~375–430px) sebelum desktop.
- **Tanpa akun**: proteksi akses ke `/kelola` mengandalkan token admin, bukan
  email/password — jangan tambahkan asumsi sistem login tradisional tanpa didiskusikan.
- **Environment variables** (`.env`, jangan pernah commit ke git): `DATABASE_URL`,
  `XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`, `MIGRATE_SECRET`, `SEED_SECRET`,
  `NEXT_PUBLIC_IS_PLAYGROUND`.
- **Copyright/lisensi aset gambar**: aset ilustrasi tema (contoh: Botanical Garden)
  berasal dari file desain pihak lain — pastikan lisensinya sesuai untuk pemakaian
  komersial sebelum go-live.

---

## 10. Pertanyaan Terbuka / Belum Diputuskan

- [ ] Apakah perlu field foto individual per mempelai di database (lihat bagian 6)?
- [ ] Apakah perlu fitur RSVP/konfirmasi kehadiran tamu? (belum terlihat ada di kode
      saat ini)
- [ ] Apakah tema ilustrasi lain akan reuse struktur 7-section yang sama (Cover,
      Events, Couple, Story, Quote, Gallery, Closing) atau ada tema yang butuh
      section berbeda?
- [ ] Kebijakan lisensi komersial untuk aset ilustrasi pihak ketiga.

---

## 11. Template Prompt — Permintaan Tema/Fitur Baru

Bagian ini untuk dipakai **langsung sebagai prompt** ke Claude (atau siapa pun yang
mengerjakan) supaya konteks yang dibutuhkan selalu lengkap sejak awal, tidak perlu
tanya-jawab bolak-balik dari nol.

### 11.a Template: Tema ilustrasi baru

```
Saya mau tambah tema ilustrasi baru untuk sharehalo bernama "{NAMA_TEMA}".

Konteks project:
- Baca dulu PANDUAN-TEMA-ILUSTRASI.md di root project untuk konvensi struktur
  folder & komponen yang sudah dipakai (contoh: tema Botanical Garden).
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

### 11.b Template: Perubahan/fitur di luar tema (data, halaman, dll)

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

### 11.c Kebiasaan kerja yang perlu diikuti (supaya tidak ada insiden seperti kemarin)

- **Commit sesering mungkin** setelah satu section/fitur selesai dan sudah dites di
  browser — jangan menumpuk banyak perubahan belum ter-commit.
- **Hindari operasi folder massal** (`mv`/`mkdir` dengan banyak path sekaligus,
  apalagi pakai `{a,b,c}` brace expansion) — riwayat project ini pernah kena masalah
  serius karena ini. Kalau perlu pindah banyak file, lakukan **satu per satu** dan
  pakai `git mv` (bukan `mv` biasa) supaya git tetap melacak histori dan lebih mudah
  di-rollback kalau salah.
- Sebelum reorganisasi struktur folder apa pun, pastikan dulu semua perubahan
  sebelumnya **sudah ter-commit**.
