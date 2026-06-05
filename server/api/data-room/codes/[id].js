export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    if (typeof b.active !== 'undefined') patch.active = !!b.active
    if (typeof b.label === 'string') patch.label = b.label.slice(0, 160)
    const updated = await patchOne('dataRoomCodes', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('dataRoomCodes', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
