export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'editor'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    if (b.status && ['new', 'approved', 'declined'].includes(b.status)) patch.status = b.status
    if (typeof b.note === 'string') patch.note = b.note.slice(0, 1000)
    const updated = await patchOne('dataRoomRequests', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('dataRoomRequests', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
