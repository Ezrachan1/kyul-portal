export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    await requireUser(event, ['admin', 'editor'])
    return await listAll('dataRoomRequests')
  }

  if (event.method === 'POST') {
    // Public — an investor requests data-room access.
    const b = await readBody(event)
    const email = String(b.email || '').trim()
    if (!b.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Name and a valid email are required.' })
    }
    const item = {
      id: uid(),
      name: String(b.name).slice(0, 200),
      email,
      org: String(b.org || '').slice(0, 200),
      message: String(b.message || '').slice(0, 2000),
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    await insert('dataRoomRequests', item)
    return { ok: true, id: item.id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
