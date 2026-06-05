export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'editor'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    for (const k of ['name', 'title', 'initials', 'bio', 'photo', 'entity']) {
      if (typeof b[k] !== 'undefined') patch[k] = b[k]
    }
    if (typeof b.order !== 'undefined') patch.order = Number(b.order) || 0
    const updated = await patchOne('team', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('team', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
