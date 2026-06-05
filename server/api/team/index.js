export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const entity = getQuery(event).entity
    let list = await listAll('team')
    if (entity) list = list.filter((m) => m.entity === entity)
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  if (event.method === 'POST') {
    await requireUser(event, ['admin', 'editor'])
    const b = await readBody(event)
    const initials =
      b.initials ||
      String(b.name || b.title || '?')
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    const item = {
      id: uid(),
      entity: b.entity || 'group',
      name: String(b.name || '').slice(0, 160),
      title: String(b.title || '').slice(0, 160),
      initials,
      bio: String(b.bio || '').slice(0, 1200),
      photo: b.photo || '',
      order: Number(b.order) || 0,
      createdAt: new Date().toISOString(),
    }
    await insert('team', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
