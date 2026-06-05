export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'editor'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    for (const k of ['title', 'type', 'size', 'category', 'fileUrl', 'date']) {
      if (typeof b[k] !== 'undefined') patch[k] = b[k]
    }
    if (typeof b.restricted !== 'undefined') patch.restricted = !!b.restricted
    const updated = await patchOne('documents', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('documents', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
