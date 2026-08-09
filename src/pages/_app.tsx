import type { AppProps } from 'next/app'
import {
  Fraunces,
  Jost,
  Great_Vibes,
  Playfair_Display,
  Cormorant_Garamond,
  DM_Serif_Display,
} from 'next/font/google'
import '@/styles/global.css'
import { PlaygroundBridge } from '@/components/PlaygroundBridge'

// Self-hosted di build-time oleh next/font. Fraunces + Jost = identitas Sanding;
// Playfair/Cormorant/DM Serif + Great Vibes dipakai per tema undangan.
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' })
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' })

const isPlayground = process.env.NEXT_PUBLIC_IS_PLAYGROUND === 'true'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${fraunces.variable} ${jost.variable} ${greatVibes.variable} ${playfair.variable} ${cormorant.variable} ${dmSerif.variable} font-sans antialiased`}
    >
      <Component {...pageProps} />
      {isPlayground && <PlaygroundBridge />}
    </div>
  )
}
