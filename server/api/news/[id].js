export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (event.method === 'GET') {
    const item = await findOne('news', (a) => a.id === id || a.slug === id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return item
  }

  await requireUser(event, ['admin', 'editor'])

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    for (const k of ['title', 'category', 'date', 'author', 'entity', 'excerpt']) {
      if (typeof b[k] !== 'undefined') patch[k] = b[k]
    }
    if (typeof b.readingTime !== 'undefined') patch.readingTime = Number(b.readingTime) || 3
    if (typeof b.featured !== 'undefined') patch.featured = !!b.featured
    if (typeof b.published !== 'undefined') patch.published = !!b.published
    if (Array.isArray(b.body)) patch.body = b.body
    const updated = await patchOne('news', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('news', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
