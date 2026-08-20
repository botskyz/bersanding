# Panduan Menambah Tema Ilustrasi Baru — sharehalo

Dokumen ini menjelaskan pola yang dipakai untuk membangun tema **Botanical Garden**,
supaya menambah tema ilustrasi baru berikutnya (misal "Tropical Sunset", "Minimalist
Line Art", dll) tinggal **ganti aset gambar + font**, tanpa perlu merancang ulang
struktur dari nol.

---

## 1. Dua jenis sistem tema di project ini

| | Tema CSS-variable (Gardenia, Buket, Anggrek, Sakura) | Tema ilustrasi (Botanical Garden) |
|---|---|---|
| Cara kerja | Satu template `Invitation.tsx` yang sama, warna & font diganti lewat CSS variable (`--t-bg`, `--t-accent`, dst) | Komponen React terpisah per section, pakai gambar PNG asli sebagai background/dekorasi |
| Cocok untuk | Variasi warna dari desain yang sama | Desain custom dengan ilustrasi/mockup unik per section |
| Lokasi kode | `src/styles/global.css` (`.theme-{id}`, `[data-variant='...']`) | `src/components/Botanical*.tsx` + `src/components/BotanicalInvitation.tsx` |

Panduan ini fokus ke **tema ilustrasi** (tipe kedua), karena itu yang butuh proses
paling banyak. Kalau cuma mau bikin variasi warna baru dari template yang sudah ada,
cukup tambah 1 objek baru di array `variants` pada tema terkait di `themes.ts`.

---

## 2. Struktur folder aset gambar

Setiap tema ilustrasi baru punya folder sendiri di `public/`, dan **nama sub-foldernya
harus sama persis dengan nama komponennya** (lihat bagian 3) — bukan "page-1",
"page-2", dst. Ini supaya siapa pun langsung tahu folder mana untuk komponen mana,
tanpa perlu menghafal pemetaan nomor halaman ke section.

```
public/theme-{nama-tema}/
  cover/     -> aset untuk {Nama}Cover.tsx
  events/    -> aset untuk {Nama}Events.tsx
  couple/    -> aset untuk {Nama}Couple.tsx
  story/     -> aset untuk {Nama}Story.tsx
  quote/     -> aset untuk {Nama}Quote.tsx
  gallery/   -> aset untuk {Nama}Gallery.tsx
  closing/   -> aset untuk {Nama}Closing.tsx
  shared/    -> aset yang dipakai LEBIH DARI SATU section (lihat catatan di bawah)
```

**Aturan penamaan file:** pakai nama deskriptif dalam bahasa Inggris singkat
(`arch.png`, `floral-left.png`, `hummingbird.png`), bukan nama asli dari file desain
(`BG-lv-1.png`). Ini supaya kode React lebih gampang dibaca.

> 💡 **Aset yang dipakai berulang di beberapa section** (contoh: gambar awan yang
> muncul baik di section Pembuka maupun section Kisah) taruh di folder `shared/`,
> BUKAN digandakan atau ditaruh di folder salah satu section saja. Kalau sebuah aset
> ditaruh di folder section tertentu padahal dipakai section lain juga, itu tanda
> harus dipindah ke `shared/`.

> ⚠️ **Jebakan umum:** kalau save gambar dari browser/Finder, kadang nama file jadi
> dobel ekstensi (`arch.png.png`). Selalu cek dengan `ls -la` sebelum lanjut.

---

## 3. Struktur komponen React

Satu tema ilustrasi terdiri dari beberapa komponen, satu per section:

```
src/components/
  {Nama}Cover.tsx       -> Sampul + tombol "Buka Undangan"
  {Nama}Events.tsx      -> Akad Nikah / Resepsi + Countdown
  {Nama}Couple.tsx      -> Kartu profil mempelai
  {Nama}Story.tsx        -> Kisah/kutipan
  {Nama}Quote.tsx        -> Tagline/quote singkat
  {Nama}Gallery.tsx      -> Galeri foto
  {Nama}Closing.tsx      -> Penutup + doa
  {Nama}Invitation.tsx   -> Perakit semua section di atas jadi satu halaman
```

Semua komponen di atas menerima props data undangan (`groomName`, `brideName`,
`akadDate`, dst) — **bukan** styling/tema, supaya reusable untuk data undangan mana pun.

---

## 4. Teknik-teknik kunci (sudah battle-tested)

### 4.1 Full-bleed (gambar nempel ke tepi layar)

Section di `Invitation.tsx` dibungkus `<div className="mx-auto max-w-xl px-5 pb-14">`,
jadi ada padding `px-5` di semua section. Supaya gambar section tertentu nempel ke
tepi layar (bukan ada jarak putih di kiri-kanan), pakai:

```tsx
<section className="relative -mx-5 ...">
```

`-mx-5` menegasikan `px-5` dari parent, sehingga section ini melebar sampai tepi
"kartu" undangan (bukan tepi layar desktop asli — penting untuk device besar/desktop,
lihat 4.2).

### 4.2 Jangan pakai `w-screen` untuk full-bleed

Trik lama `left-1/2 right-1/2 -mx-[50vw] w-screen` **JANGAN dipakai** — ini akan
membuat gambar melebar mengikuti lebar layar desktop sungguhan (bisa 1920px+),
padahal desain ini dibuat untuk lebar mobile (~390px) dan seharusnya tetap terkunci
di lebar kartu (`max-w-xl` dari parent) walau dibuka di desktop. Pakai `-mx-5` saja
(lihat 4.1).

### 4.3 Cari "zona aman" untuk teks di dalam gambar dekoratif (arch, frame, dll)

Kalau ada teks yang harus muncul DI DALAM sebuah ilustrasi (misal di dalam lengkung),
jangan menebak posisi dengan persen secara visual. Analisis pixel alpha channel
gambarnya dulu:

```python
from PIL import Image
im = Image.open('nama-file.png').convert('RGBA')
w, h = im.size
cx = w // 2
for y in range(0, h, 10):
    a = im.getpixel((cx, y))[3]
    print(y, 'opaque' if a > 20 else 'clear')
```

Ini kasih tahu persis di pixel berapa area jadi transparan (aman untuk teks). Kalau
elemen dekoratif melebar ke pinggir (bukan cuma di tengah), cek juga beberapa kolom
`x` berbeda (lihat contoh di riwayat chat: analisis `Border_Frame.png`).

### 4.4 Teks dengan panjang tidak terduga → selalu pakai `clamp()`

Data seperti nama pasangan atau cerita cinta panjangnya tidak bisa diprediksi. Supaya
tidak overflow/nabrak elemen dekoratif di sekitarnya:

```tsx
className="text-[clamp(1.3rem,6vw,2rem)]"
```

Format: `clamp(minimum, ukuran-relatif-terhadap-layar, maksimum)`.

### 4.5 Foto individual per mempelai

Skema database saat ini **tidak punya** field foto terpisah untuk mempelai pria/wanita
(cuma `coverPhoto` tunggal + array `gallery`). Kalau desain butuh 2 foto individual,
konvensi yang dipakai:
- Foto mempelai pria → `und.coverPhoto`
- Foto mempelai wanita → `und.gallery[0]` (fallback ke `coverPhoto` kalau gallery kosong)

Kalau mau field foto terpisah yang proper, perlu tambah kolom baru di
`src/lib/db/schema.ts` (migration terpisah, di luar scope styling).

### 4.6 Animasi masuk + berulang (contoh: kolibri terbang)

Pola untuk elemen yang animasi sekali saat pertama terlihat (scroll), lalu lanjut
animasi berulang:

1. Tambah `@keyframes` + class di `global.css` (contoh: `hb-fly-in`, `hb-bob`).
2. Komponen React pakai `IntersectionObserver` + `useState<'idle'|'flying'|'bobbing'>`.
3. **Penting:** kalau elemen juga butuh positioning pakai `transform` (misal
   `-translate-y-1/2` untuk center vertikal), JANGAN gabung dengan animasi yang juga
   pakai `transform` — keduanya akan saling menimpa. Pakai `margin` untuk positioning
   statis, sisakan `transform` khusus untuk animasi.

---

## 5. Checklist menambah tema ilustrasi baru

- [ ] Siapkan aset gambar, taruh di `public/theme-{nama}/{nama-section}/`
      (nama folder = nama section, sama seperti nama file komponennya — lihat bagian 2)
- [ ] Cek dimensi & alpha channel tiap aset penting (lihat 4.3) sebelum mulai coding
- [ ] Buat komponen per section (`{Nama}Cover.tsx`, dst — lihat bagian 3)
- [ ] Rakit semua section di `{Nama}Invitation.tsx`
- [ ] Di `src/components/Invitation.tsx`, tambah percabangan:
      ```tsx
      if (und.theme === 'nama-tema') {
        return <NamaInvitation und={und} />
      }
      ```
- [ ] Daftarkan tema baru di `src/lib/themes.ts` (tambah objek baru ke array `THEMES`,
      tentukan `premium: true/false`)
- [ ] Tambah CSS variable pendukung di `src/styles/global.css`:
      `.theme-{nama} { --t-bg: ...; --t-accent: ...; }` dan
      `[data-variant='{nama}-classic'] { ... }` — ini dipakai oleh `ThemePreview`
      (kartu pilihan tema di halaman `/tema`), bukan oleh komponen ilustrasi itu sendiri
- [ ] (Opsional, testing) update `src/lib/db/seed.ts` — set salah satu data contoh
      pakai `theme: 'nama-tema'`, lalu `npm run seed`

---

## 6. Ganti font untuk tema baru

Font di-load sekali di `src/pages/_app.tsx` lewat `next/font/google`, lalu dipakai
via CSS variable.

1. Import font Google Fonts yang mau dipakai:
   ```tsx
   import { Nama_Font } from 'next/font/google'
   const namaFont = Nama_Font({ subsets: ['latin'], variable: '--font-nama' })
   ```
2. Tambahkan `${namaFont.variable}` ke `className` di wrapper `<div>` pada `App()`.
3. Pakai `var(--font-nama)` di CSS/Tailwind arbitrary value tempat font itu dibutuhkan,
   misalnya di komponen tema baru:
   ```tsx
   className="font-['var(--font-nama)']"
   ```
   atau tambahkan sebagai utility baru di `global.css` kalau dipakai berulang kali.

**Catatan:** kalau font lama (misal `Fraunces`) masih dipakai tema LAIN (dicek dulu —
`Fraunces` dipakai tema Orchid di `global.css`), jangan hapus importnya dari `_app.tsx`,
cukup tambah font baru di sampingnya.

---

## 7. Kesalahan umum yang sudah pernah ditemui (biar tidak terulang)

| Gejala | Penyebab | Solusi |
|---|---|---|
| Gambar 404 | Nama file dobel ekstensi (`file.png.png`) saat save dari browser | Cek `ls -la`, rename kalau perlu |
| Class CSS baru tidak muncul walau file sudah benar | Cache build Next.js/Tailwind basi | `rm -rf .next` lalu `npm run dev` lagi |
| Elemen kelihatan "masih besar" padahal CSS sudah benar (`max-width` dsb sudah kecil) | Screenshot dari layar Retina/HiDPI (2x-3x scaling), bukan bug CSS | Cek lewat DevTools → tab Computed, bukan cuma keliatan dari screenshot |
| Section melebar penuh di desktop, padahal di mobile pas | Pakai `w-screen`/`50vw` trick, bukan `-mx-5` | Ganti ke teknik 4.1/4.2 |
| Teks nabrak elemen dekoratif | Posisi teks ditebak pakai persen tanpa cek aset | Analisis alpha channel dulu (lihat 4.3) |
| Kolibri/elemen animasi "loncat" posisi saat animasi jalan | `transform` dipakai bareng untuk positioning DAN animasi | Pisahkan: `margin` untuk posisi statis, `transform` khusus animasi |
