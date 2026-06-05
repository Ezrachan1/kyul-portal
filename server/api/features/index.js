export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    await requireUser(event) // any authenticated user
    return await readCol('features')
  }

  if (event.method === 'PATCH') {
    await requireUser(event, ['super-admin'])
    const b = await readBody(event)
    const current = await readCol('features')
    const next = { ...current }
    for (const k of Object.keys(current)) {
      if (typeof b[k] !== 'undefined') next[k] = !!b[k]
    }
    await writeCol('features', next)
    return next
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
