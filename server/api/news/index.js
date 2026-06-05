export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const all = await listAll('news')
    const u = await getSessionUser(event)
    const canSeeAll = u && ['admin', 'editor', 'super-admin'].includes(u.role)
    const list = canSeeAll ? all : all.filter((a) => a.published !== false)
    return list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  if (event.method === 'POST') {
    await requireUser(event, ['admin', 'editor'])
    const b = await readBody(event)
    if (!b.title) throw createError({ statusCode: 400, statusMessage: 'Title is required.' })
    const existing = await listAll('news')
    let slug = slugify(b.slug || b.title)
    if (existing.some((a) => a.id === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    const item = {
      id: slug,
      slug,
      title: String(b.title).slice(0, 240),
      category: b.category || 'Group News',
      date: b.date || new Date().toISOString().slice(0, 10),
      author: b.author || 'Kyul Group Communications',
      entity: b.entity || null,
      readingTime: Number(b.readingTime) || 3,
      featured: !!b.featured,
      published: b.published !== false,
      excerpt: String(b.excerpt || '').slice(0, 400),
      body: Array.isArray(b.body) ? b.body : [{ type: 'p', text: String(b.content || '') }],
      createdAt: new Date().toISOString(),
    }
    await insert('news', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
