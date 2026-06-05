export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    await requireUser(event, ['admin', 'editor'])
    return await listAll('submissions')
  }

  if (event.method === 'POST') {
    // Public endpoint — receives enquiries / RFPs / applications from the website.
    const b = await readBody(event)
    const email = String(b.email || '').trim()
    if (!b.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Name and a valid email are required.' })
    }
    const item = {
      id: uid(),
      type: ['enquiry', 'rfp', 'application'].includes(b.type) ? b.type : 'enquiry',
      name: String(b.name).slice(0, 200),
      email,
      org: String(b.org || '').slice(0, 200),
      subject: String(b.subject || '').slice(0, 200),
      message: String(b.message || '').slice(0, 5000),
      entity: b.entity || null,
      source: String(b.source || '').slice(0, 120),
      meta: b.meta || null,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    await insert('submissions', item)
    return { ok: true, id: item.id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
