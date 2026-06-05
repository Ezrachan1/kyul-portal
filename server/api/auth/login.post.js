export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }
  const users = await listAll('users')
  const u = users.find((x) => x.email.toLowerCase() === String(email).toLowerCase() && x.active !== false)
  if (!u || !(await verifyPassword(password, u.salt, u.hash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }
  await setSession(event, u.id)
  return { user: publicUser(u) }
})
