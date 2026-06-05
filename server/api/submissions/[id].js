export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'editor'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    if (b.status && ['new', 'read', 'in-progress', 'closed'].includes(b.status)) patch.status = b.status
    if (typeof b.note === 'string') patch.note = b.note.slice(0, 2000)
    const updated = await patchOne('submissions', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    const ok = await removeOne('submissions', id)
    return { ok }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
