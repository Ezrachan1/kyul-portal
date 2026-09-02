// Uploads a File via base64 JSON to /api/upload and returns the served URL.
//
// Photos go through uploadImage(), which decodes, downscales and re-encodes in
// the browser first. Phone cameras produce 5–15MB HEIC/JPEG files: sending those
// raw was slow, blew past the edge runtime's CPU budget in production, and HEIC
// (the iPhone default) was rejected outright. Normalising here means the server
// always receives a small, web-safe image and visitors never download a 12MB photo.
export function useUpload() {
  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = () => reject(new Error('Could not read the file.'))
      fr.readAsDataURL(file)
    })
  }

  async function upload(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error('File too large (max 25MB).')
    const dataUrl = await toDataUrl(file)
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: { name: file.name, type: file.type, dataUrl },
    })
    return res.url
  }

  // Decode to a bitmap. createImageBitmap honours EXIF orientation and, on
  // Safari, decodes HEIC natively; the <img> path covers older browsers.
  async function decode(file) {
    try {
      if (typeof createImageBitmap === 'function') {
        return await createImageBitmap(file, { imageOrientation: 'from-image' })
      }
    } catch {
      /* fall through to the <img> decoder */
    }
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return img
    } catch {
      throw new Error(
        'This image format could not be read by your browser (iPhone HEIC photos often need converting). Please save it as JPEG or PNG and try again.',
      )
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const canEncode = (type) => {
    try {
      const c = document.createElement('canvas')
      c.width = c.height = 1
      return c.toDataURL(type).startsWith(`data:${type}`)
    } catch {
      return false
    }
  }

  /**
   * Normalise an image for the web, then upload it.
   * maxEdge caps the longest side; quality is the encoder quality (0-1).
   */
  async function uploadImage(file, { maxEdge = 1920, quality = 0.82 } = {}) {
    if (!/^image\//.test(file.type || '') && !/\.(jpe?g|png|webp|gif|heic|heif|avif|tiff?|bmp)$/i.test(file.name || '')) {
      throw new Error('Please choose an image file.')
    }
    // Guard before decoding: a huge file can exhaust memory on a phone.
    if (file.size > 40 * 1024 * 1024) throw new Error('That image is very large (max 40MB). Please choose a smaller file.')

    const bitmap = await decode(file)
    const sw = bitmap.width || bitmap.naturalWidth
    const sh = bitmap.height || bitmap.naturalHeight
    if (!sw || !sh) throw new Error('That image could not be read. Please try a different file.')

    const scale = Math.min(1, maxEdge / Math.max(sw, sh))
    const w = Math.max(1, Math.round(sw * scale))
    const h = Math.max(1, Math.round(sh * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'

    // WebP keeps transparency and is much smaller; JPEG needs an opaque ground.
    const type = canEncode('image/webp') ? 'image/webp' : 'image/jpeg'
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
    }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process that image. Please try another file.'))), type, quality)
    })

    const base = (file.name || 'photo').replace(/\.[^.]+$/, '') || 'photo'
    const ext = type === 'image/webp' ? '.webp' : '.jpg'
    const out = new File([blob], `${base}${ext}`, { type })
    return await upload(out)
  }

  return { upload, uploadImage }
}
