export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const all = await listAll('documents')
    const u = await getSessionUser(event)
    const staff = u && ['admin', 'editor', 'super-admin'].includes(u.role)
    // Staff see everything; the public only sees non-restricted documents.
    const list = staff ? all : all.filter((d) => !d.restricted)
    return list
  }

  if (event.method === 'POST') {
    await requireUser(event, ['admin', 'editor'])
    const b = await readBody(event)
    if (!b.title) throw createError({ statusCode: 400, statusMessage: 'Title is required.' })
    const item = {
      id: uid(),
      title: String(b.title).slice(0, 240),
      type: (b.type || 'PDF').toUpperCase(),
      size: b.size || 'N/A',
      category: b.category || 'Corporate',
      restricted: !!b.restricted,
      fileUrl: b.fileUrl || '',
      date: b.date || new Date().toISOString().slice(0, 7),
      createdAt: new Date().toISOString(),
    }
    await insert('documents', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
