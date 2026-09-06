// Helper klien untuk upload foto & musik — dipakai komponen PhotoPicker/MusicPicker.
// Foto dikecilkan lewat canvas (max 1600px, JPEG 0.82) agar ringan disimpan & dibuka di ponsel.

function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase()
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    /\.hei[cf]$/i.test(file.name)
  )
}

async function normalizeToDecodableFile(file: File): Promise<File> {
  if (!isHeicFile(file)) return file

  // Import dinamis: biar bundle awal tidak ikut bawa heic2any kalau tidak dipakai
  const heic2any = (await import('heic2any')).default

  try {
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
    const blob = Array.isArray(converted) ? converted[0] : converted
    return new File(
      [blob],
      file.name.replace(/\.hei[cf]$/i, '.jpg'),
      { type: 'image/jpeg' }
    )
  } catch {
    throw new Error('Gagal memproses foto HEIC. Coba ubah dulu ke JPG/PNG.')
  }
}

export async function fileToImageDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  const normalizedFile = await normalizeToDecodableFile(file)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('File bukan gambar yang valid'))
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(img.width * scale))
          canvas.height = Math.max(1, Math.round(img.height * scale))
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas tidak tersedia')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Gagal mengolah gambar'))
        }
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(normalizedFile)
  })
}

export function audioToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 6 * 1024 * 1024) {
      reject(new Error('Besar file musik maksimal 6 MB'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}
