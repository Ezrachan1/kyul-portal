export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await readCol('settings')
  }

  if (event.method === 'PATCH') {
    await requireUser(event, ['admin'])
    const b = await readBody(event)
    const cur = await readCol('settings')
    const next = {
      hq: { ...cur.hq, ...(b.hq || {}) },
      contact: { ...cur.contact, ...(b.contact || {}) },
      social: Array.isArray(b.social)
        ? b.social
            .filter((s) => s && (s.label || s.href))
            .map((s) => ({ label: String(s.label || '').slice(0, 60), icon: String(s.icon || 'lucide:link').slice(0, 60), href: String(s.href || '').slice(0, 300) }))
        : cur.social,
      subsidiaryContacts: { ...cur.subsidiaryContacts, ...(b.subsidiaryContacts || {}) },
    }
    await writeCol('settings', next)
    return next
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
