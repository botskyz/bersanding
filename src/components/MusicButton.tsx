import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'

export function MusicButton({ url, title }: { url: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!url) return
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0.55
    audio.preload = 'none'
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setFailed(true)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    audioRef.current = audio
    // Coba putar otomatis — browser boleh menolak tanpa interaksi; tombol tetap tersedia.
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [url])

  if (!url || failed) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else audio.play().catch(() => {})
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Hentikan musik' : 'Putar musik'}
      title={playing ? 'Hentikan musik' : `Putar musik — ${title}`}
      className={`inv-music ${playing ? 'inv-music-on' : 'inv-music-pulse'}`}
    >
      <span className="inv-music-disc" aria-hidden />
      {playing ? <Pause className="size-5" /> : <Music className="size-5" />}
    </button>
  )
}
