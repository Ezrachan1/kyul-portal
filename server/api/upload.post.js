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
  if (!OK.includes(ext)) throw createError({ statusCode: 400, statusMessage: 'Unsupported file type.' })

  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  if (!bytes.length) throw createError({ statusCode: 400, statusMessage: 'Empty file.' })
  if (bytes.length > 25 * 1024 * 1024) throw createError({ statusCode: 413, statusMessage: 'File too large (max 25MB).' })

  const name = `${uid()}${ext}`
  const stored = await saveUpload(event, name, bytes, mime || '')

  return { url: `/uploads/${stored}`, name: body.name || stored, size: bytes.length, type: mime }
})
