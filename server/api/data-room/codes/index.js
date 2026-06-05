const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const genCode = () =>
  'KYUL-IR-' + Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')

export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin'])

  if (event.method === 'GET') {
    return await listAll('dataRoomCodes')
  }

  if (event.method === 'POST') {
    const b = await readBody(event)
    const codes = await listAll('dataRoomCodes')
    let code = String(b.code || '').trim().toUpperCase()
    if (!code) {
      do {
        code = genCode()
      } while (codes.some((c) => c.code === code))
    } else if (codes.some((c) => c.code === code)) {
      throw createError({ statusCode: 409, statusMessage: 'That code already exists.' })
    }
    const item = {
      id: uid(),
      code,
      label: String(b.label || 'Investor access').slice(0, 160),
      active: true,
      createdAt: new Date().toISOString(),
    }
    await insert('dataRoomCodes', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
