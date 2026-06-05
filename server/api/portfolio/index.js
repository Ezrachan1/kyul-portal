export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const entity = getQuery(event).entity
    let list = await listAll('portfolio')
    if (entity) list = list.filter((p) => p.entity === entity)
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  if (event.method === 'POST') {
    await requireUser(event, ['admin', 'editor'])
    const b = await readBody(event)
    if (!b.name) throw createError({ statusCode: 400, statusMessage: 'Project / item name is required.' })
    const item = {
      id: uid(),
      entity: b.entity || 'engineering',
      name: String(b.name).slice(0, 200),
      client: String(b.client || '').slice(0, 200),
      location: String(b.location || '').slice(0, 160),
      value: String(b.value || '').slice(0, 80),
      year: String(b.year || '').slice(0, 40),
      scope: String(b.scope || '').slice(0, 400),
      sector: String(b.sector || '').slice(0, 80),
      status: String(b.status || '').slice(0, 60),
      order: Number(b.order) || 0,
      createdAt: new Date().toISOString(),
    }
    await insert('portfolio', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
