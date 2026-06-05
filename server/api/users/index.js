const ASSIGNABLE = ['admin', 'editor', 'finance', 'viewer']

export default defineEventHandler(async (event) => {
  const me = await requireUser(event, ['admin'])

  if (event.method === 'GET') {
    const users = await listAll('users')
    // Admins never see super-admin accounts.
    const visible = me.role === 'super-admin' ? users : users.filter((u) => u.role !== 'super-admin')
    return visible.map(publicUser)
  }

  if (event.method === 'POST') {
    const b = await readBody(event)
    const email = String(b.email || '').trim().toLowerCase()
    if (!b.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Name and a valid email are required.' })
    }
    if (!b.password || String(b.password).length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters.' })
    }
    const users = await listAll('users')
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw createError({ statusCode: 409, statusMessage: 'A user with that email already exists.' })
    }
    let role = b.role
    if (role === 'super-admin' && me.role !== 'super-admin') {
      throw createError({ statusCode: 403, statusMessage: 'Not permitted.' })
    }
    if (!['super-admin', ...ASSIGNABLE].includes(role)) role = 'viewer'

    const item = {
      id: uid(),
      name: String(b.name).slice(0, 160),
      email,
      role,
      ...(await hashPassword(b.password)),
      active: true,
      photo: b.photo || '',
      createdAt: new Date().toISOString(),
      createdBy: me.id,
    }
    await insert('users', item)
    return publicUser(item)
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
