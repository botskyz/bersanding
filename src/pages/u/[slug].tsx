import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { Invitation } from '@/components/Invitation'
import { Layout } from '@/components/Layout'
import { db } from '@/lib/db'
import { undangan } from '@/lib/db/schema'
import { isExpired } from '@/lib/invitation'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = typeof ctx.params?.slug === 'string' ? ctx.params.slug : ''
  const [row] = await db.select().from(undangan).where(eq(undangan.slug, slug)).limit(1)
  if (!row) return { notFound: true }
  return {
    props: {
      und: JSON.parse(JSON.stringify(row)),
      expired: isExpired(row),
    },
  }
}

interface UndProps {
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
  akadDate: string
  akadTime: string
  akadLocation: string
  akadAddress: string
  resepsiDate: string
  resepsiTime: string
  resepsiLocation: string
  resepsiAddress: string
  story: string
  quote: string
  guestName: string
  theme: string
  colorId: string
  coverPhoto: string
  gallery: string[]
  musicUrl: string
  musicTitle: string
}

export default function U({ und, expired }: { und: UndProps; expired: boolean }) {
  if (expired) {
    return (
      <Layout title="Undangan berakhir — Sanding">
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--ivory)] px-5 text-center">
          <p className="eyebrow">Undangan digital</p>
          <h1 className="font-display mt-4 text-3xl tracking-tight">Undangan ini telah berakhir</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            Masa aktif undangan gratis sudah habis. Pemilik undangan bisa mengaktifkannya kembali
            dengan upgrade Premium.
          </p>
          <Link href="/" className="btn btn-primary btn-md mt-8">
            Buat undanganmu sendiri
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${und.groomName} & ${und.brideName} — Undangan Pernikahan`}>
      <Invitation und={und} />
    </Layout>
  )
}
