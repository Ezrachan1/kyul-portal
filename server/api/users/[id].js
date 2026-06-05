const ASSIGNABLE = ['admin', 'editor', 'finance', 'viewer']

export default defineEventHandler(async (event) => {
  const me = await requireUser(event, ['admin'])
  const id = getRouterParam(event, 'id')
  const users = await listAll('users')
  const target = users.find((u) => u.id === id)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  // Admins cannot see or touch super-admin accounts.
  if (target.role === 'super-admin' && me.role !== 'super-admin') {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (event.method === 'PATCH') {
    const b = await readBody(event)
    const patch = {}
    if (typeof b.name === 'string') patch.name = b.name.slice(0, 160)
    if (typeof b.active !== 'undefined') patch.active = !!b.active
    if (typeof b.photo === 'string') patch.photo = b.photo
    if (b.role) {
      if (b.role === 'super-admin' && me.role !== 'super-admin') {
        throw createError({ statusCode: 403, statusMessage: 'Not permitted.' })
      }
      if (['super-admin', ...ASSIGNABLE].includes(b.role)) patch.role = b.role
    }
    if (b.password) {
      if (String(b.password).length < 6) throw createError({ statusCode: 400, statusMessage: 'Password too short.' })
      Object.assign(patch, await hashPassword(b.password))
    }
    const updated = await patchOne('users', id, patch)
    return publicUser(updated)
  }

  if (event.method === 'DELETE') {
    if (target.id === me.id) throw createError({ statusCode: 400, statusMessage: 'You cannot delete your own account.' })
    if (target.system) throw createError({ statusCode: 400, statusMessage: 'This account cannot be deleted.' })
    return { ok: await removeOne('users', id) }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
