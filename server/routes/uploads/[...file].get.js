const TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.csv': 'text/csv',
}

export default defineEventHandler(async (event) => {
  const rel = getRouterParam(event, 'file') || ''
  const result = await readUpload(event, rel)
  if (!result) throw createError({ statusCode: 404, statusMessage: 'File not found' })

  const ext = '.' + (rel.split('.').pop() || '').toLowerCase()
  setHeader(event, 'content-type', result.contentType || TYPES[ext] || 'application/octet-stream')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return result.body
})
