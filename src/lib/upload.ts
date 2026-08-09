// Helper klien untuk upload foto & musik — dipakai komponen PhotoPicker/MusicPicker.
// Foto dikecilkan lewat canvas (max 1600px, JPEG 0.82) agar ringan disimpan & dibuka di ponsel.

export function fileToImageDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
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
    reader.readAsDataURL(file)
  })
}

export function audioToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error('Besar file musik maksimal 4 MB'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}
