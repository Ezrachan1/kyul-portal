export default defineEventHandler(async (event) => {
  const u = await getSessionUser(event)
  return { user: publicUser(u) }
})
