import Link from 'next/link'
import { Check, Heart, ImagePlus, Music, Palette, Share2, Sparkles } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Footer, Nav } from '@/components/SiteChrome'
import { ThemePreview } from '@/components/ThemePreview'
import { PREMIUM_PRICE, THEMES, formatIDR } from '@/lib/themes'

const freeBenefits = [
  'Tema Gardenia yang elegan',
  'Aktif 30 hari',
  'Edit data kapan saja',
  'Link undangan langsung jadi',
]

const premiumBenefits = [
  'Semua 4 tema + 12 pilihan warna',
  'Aktif selamanya — tidak kadaluarsa',
  'Ganti tema & warna kapan saja',
  'Dukungan prioritas',
]

const faqs = [
  {
    q: 'Apakah benar gratis?',
    a: 'Ya. Undangan gratis langsung jadi dengan tema Gardenia dan aktif 30 hari. Upgrade ke Premium kapan saja kalau kamu mau tema lain atau masa aktif selamanya.',
  },
  {
    q: 'Bagaimana cara membayar Premium?',
    a: 'Lewat halaman pembayaran yang diproses Xendit: QRIS, e-wallet (GoPay, OVO, DANA, ShopeePay), dan transfer virtual bank. Sekali bayar Rp 99.000, berlaku selamanya.',
  },
  {
    q: 'Kalau undangan gratis kadaluarsa, bagaimana?',
    a: 'Link undangan tetap bisa dibuka, tapi tamu akan melihat halaman “undangan berakhir”. Upgrade kapan saja — semua datamu tetap tersimpan.',
  },
  {
    q: 'Bisakah mengubah data setelah undangan jadi?',
    a: 'Bisa, kapan saja lewat halaman kelola. Link undangan tidak berubah, jadi kamu tidak perlu membagikan ulang ke tamu.',
  },
  {
    q: 'Bagaimana tamu melihat undangan?',
    a: 'Cukup buka link — tanpa aplikasi dan tanpa unduhan. Tampilan menyesuaikan tema yang kamu pilih, termasuk di ponsel.',
  },
]

const steps = [
  {
    icon: Heart,
    title: 'Isi data diri',
    desc: 'Nama pasangan, tanggal & lokasi acara, dan cerita singkat kalian — sekitar satu menit.',
  },
  {
    icon: Palette,
    title: 'Pilih tema & warna',
    desc: 'Empat tema dengan 12 pilihan warna, pratinjau langsung di layar — ganti kapan saja.',
  },
  {
    icon: Share2,
    title: 'Bagikan link',
    desc: 'Undangan digitalmu langsung jadi. Kirim link-nya ke tamu lewat WhatsApp atau media apa pun.',
  },
]

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-[var(--ivory)]">
        <Nav />

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="eyebrow">Undangan digital untuk calon pengantin</p>
            <h1 className="font-display mt-5 text-[clamp(2.4rem,5.5vw,3.9rem)] leading-[1.08] tracking-tight">
              Kabarkan hari bahagia{' '}
              <span className="font-script text-[var(--gold)]">dengan indah</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Isi data, pilih tema, bagikan link. Undangan digitalmu siap dalam satu menit —
              ganti foto, tambah musik, dan efek parallax halus, gratis untuk mulai.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/buat" className="btn btn-primary btn-lg">
                Buat undangan gratis
              </Link>
              <Link href="/u/andi-sari" className="btn btn-outline btn-lg">
                Lihat contoh
              </Link>
            </div>
            <p className="mt-8 text-sm text-[var(--muted)]">
              Tanpa daftar akun · Bayar sekali untuk selamanya · QRIS, e-wallet & transfer
            </p>
          </div>

          {/* Mockup kartu undangan */}
          <div className="relative mx-auto h-[480px] w-full max-w-md sm:h-[540px]">
            <div className="absolute left-2 top-10 w-40 rotate-[-10deg] opacity-90 sm:left-0 sm:w-44">
              <ThemePreview theme="gardenia" className="shadow-xl shadow-[var(--ink)]/10" />
            </div>
            <div className="absolute right-2 top-0 w-36 rotate-[8deg] opacity-90 sm:right-4 sm:w-40">
              <ThemePreview theme="bouquet" colorId="blush" className="shadow-xl shadow-[var(--ink)]/10" />
            </div>
            <div className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rotate-2 sm:w-60">
              <ThemePreview theme="botanical" className="shadow-xl shadow-[var(--ink)]/25" />
            </div>
            <div className="absolute -left-1 bottom-24 rounded-full border border-[var(--gold-soft)] bg-[var(--paper)] px-4 py-2 text-xs font-semibold text-[var(--gold)] shadow-lg shadow-[var(--ink)]/5 sm:-left-4">
              {formatIDR(PREMIUM_PRICE)} · sekali bayar
            </div>
            <div className="absolute right-0 top-1/2 rotate-[3deg] rounded-full bg-[var(--berry)] px-4 py-2 text-xs font-semibold text-[#fdf6ee] shadow-lg shadow-[var(--berry)]/30">
              Jadi dalam 1 menit
            </div>
          </div>
        </section>

        {/* Cara kerja */}
        <section className="border-t border-[var(--line)] bg-[var(--paper)]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="eyebrow text-center">Cara kerja</p>
            <h2 className="font-display mt-4 text-center text-[clamp(1.8rem,4vw,2.5rem)] tracking-tight">
              Tiga langkah, satu undangan
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="sig-frame p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-[var(--gold)]">0{i + 1}</span>
                    <s.icon className="size-5 text-[var(--berry)]" aria-hidden />
                  </div>
                  <h3 className="font-display mt-5 text-xl">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fitur */}
        <section className="border-t border-[var(--line)] bg-[var(--paper)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ImagePlus,
                  title: 'Ganti foto mudah',
                  desc: 'Pilih dari galeri preset atau unggah foto sendiri — sampul & galeri momen.',
                },
                {
                  icon: Music,
                  title: 'Musik latar',
                  desc: 'Tambahkan lagu favorit sebagai pengiring undangan, dari preset atau file sendiri.',
                },
                {
                  icon: Sparkles,
                  title: 'Efek parallax halus',
                  desc: 'Sentuhan mikro-parallax saat digulir — indah tanpa membuat ponsel berat.',
                },
                {
                  icon: Palette,
                  title: '12 pilihan warna',
                  desc: 'Setiap tema punya 3 palet warna. Pilih yang paling mewakili hari kalian.',
                },
              ].map((f) => (
                <div key={f.title} className="sig-frame p-6">
                  <f.icon className="size-5 text-[var(--berry)]" aria-hidden />
                  <h3 className="font-display mt-4 text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tema */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="eyebrow text-center">Tema</p>
          <h2 className="font-display mt-4 text-center text-[clamp(1.8rem,4vw,2.5rem)] tracking-tight">
            Empat tema, dua belas warna
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-[var(--muted)]">
            Setiap tema punya 3 palet warna, plus fitur ganti foto, galeri momen, dan musik latar.
            Gratis memakai Gardenia; semua tema terbuka di paket Premium.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {THEMES.map((t) => (
              <Link
                key={t.id}
                href="/buat"
                className="group transition-transform duration-200 hover:-translate-y-1"
              >
                <ThemePreview
                  theme={t.id}
                  className="shadow-lg shadow-[var(--ink)]/5 transition-shadow group-hover:shadow-xl"
                />
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg">{t.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{t.tagline}</p>
                  </div>
                  <span
                    className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      t.premium
                        ? 'border-[var(--gold-soft)] text-[var(--gold)]'
                        : 'border-[var(--line)] bg-[var(--paper)] text-[var(--muted)]'
                    }`}
                  >
                    {t.premium ? 'Premium' : 'Gratis'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Harga */}
        <section className="border-t border-[var(--line)] bg-[var(--paper)]">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="eyebrow text-center">Harga</p>
            <h2 className="font-display mt-4 text-center text-[clamp(1.8rem,4vw,2.5rem)] tracking-tight">
              Mulai gratis, upgrade saat siap
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="sig-frame p-8">
                <p className="font-display text-lg">Gratis</p>
                <p className="font-display mt-3 text-4xl">
                  Rp 0<span className="text-base text-[var(--muted)]"> / 30 hari</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {freeBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href="/buat" className="btn btn-outline mt-8 w-full">
                  Mulai gratis
                </Link>
              </div>

              <div className="relative border-2 border-[var(--gold)] bg-[var(--paper)] p-8">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gold)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fffdf7]">
                  Paling populer
                </span>
                <p className="font-display text-lg">Premium</p>
                <p className="font-display mt-3 text-4xl">
                  {formatIDR(PREMIUM_PRICE)}
                  <span className="text-base text-[var(--muted)]"> / sekali bayar</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {premiumBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--berry)]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href="/buat" className="btn btn-gold mt-8 w-full">
                  Upgrade ke premium
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
          <p className="eyebrow text-center">Tanya jawab</p>
          <h2 className="font-display mt-4 text-center text-[clamp(1.8rem,4vw,2.5rem)] tracking-tight">
            Yang sering ditanyakan
          </h2>
          <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-[var(--gold)] transition-transform duration-200 group-open:rotate-45">◆</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA akhir */}
        <section className="border-t border-[var(--line)] bg-[var(--paper)]">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] tracking-tight">
              Hari bahagiamu sudah dekat
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              Undangan digital yang indah tidak harus rumit. Mulai sekarang, gratis — tinggal
              isi datanya.
            </p>
            <Link href="/buat" className="btn btn-primary btn-lg mt-9">
              Buat undangan gratis
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </Layout>
  )
}
