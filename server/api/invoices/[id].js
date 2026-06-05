export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'finance'])
  const id = getRouterParam(event, 'id')

  if (event.method === 'GET') {
    const item = await findOne('invoices', (x) => x.id === id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return item
  }

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    for (const k of ['number', 'issuer', 'client', 'issueDate', 'dueDate', 'currency', 'items', 'notes']) {
      if (typeof b[k] !== 'undefined') patch[k] = b[k]
    }
    if (b.status && ['draft', 'pending', 'paid', 'overdue'].includes(b.status)) patch.status = b.status
    if (typeof b.taxRate === 'number') patch.taxRate = b.taxRate
    const updated = await patchOne('invoices', id, patch)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return updated
  }

  if (event.method === 'DELETE') {
    return { ok: await removeOne('invoices', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
