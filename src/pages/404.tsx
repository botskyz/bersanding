import Link from 'next/link'
import { Layout } from '@/components/Layout'

export default function NotFound() {
  return (
    <Layout title="Tidak ditemukan — sharehalo">
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--ivory)] px-5 text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display mt-4 text-3xl tracking-tight">Undangan tidak ditemukan</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
          Link mungkin salah ketik, atau undangan ini sudah tidak tersedia.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/buat" className="btn btn-primary btn-md">
            Buat undangan sendiri
          </Link>
          <Link href="/" className="btn btn-outline btn-md">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </Layout>
  )
}
