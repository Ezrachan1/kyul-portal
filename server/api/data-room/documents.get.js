export default defineEventHandler(async (event) => {
  const u = await getSessionUser(event)
  const staff = u && ['admin', 'editor', 'super-admin'].includes(u.role)
  if (!staff && !(await hasDataRoom(event))) {
    throw createError({ statusCode: 403, statusMessage: 'Data room access required.' })
  }
  const all = await listAll('documents')
  return all.filter((d) => d.restricted)
})
