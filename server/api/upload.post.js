// Files are sent as base64 JSON (not multipart) so uploads work identically in
// the Nuxt dev server, on a Node server, and on Cloudflare (edge).
const OK = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.pdf', '.xlsx', '.docx', '.csv']
const MIME_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/csv': '.csv',
}

export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'editor'])

  const body = await readBody(event)
  const dataUrl = body?.dataUrl
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'No file data received.' })
  }

  const m = dataUrl.match(/^data:([^;]*);base64,(.*)$/s)
  const mime = m ? m[1] : body.type || ''
  const base64 = m ? m[2] : dataUrl

  let ext = (body.name && body.name.includes('.') ? '.' + body.name.split('.').pop() : '').toLowerCase()
  if (!ext && mime) ext = MIME_EXT[mime] || ''
  if (!OK.includes(ext)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Unsupported file type. Images must be JPG, PNG, WebP or GIF (iPhone HEIC photos need converting first); documents must be PDF, XLSX, DOCX or CSV.',
    })
  }

  // Plain loop, not Uint8Array.from(..., cb): the callback form runs one call
  // per byte, which overruns the edge runtime's CPU budget on large files.
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  if (!bytes.length) throw createError({ statusCode: 400, statusMessage: 'Empty file.' })
  if (bytes.length > 25 * 1024 * 1024) throw createError({ statusCode: 413, statusMessage: 'File too large (max 25MB).' })

  const name = `${uid()}${ext}`
  const stored = await saveUpload(event, name, bytes, mime || '')

  return { url: `/uploads/${stored}`, name: body.name || stored, size: bytes.length, type: mime }
})
