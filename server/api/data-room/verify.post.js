export default defineEventHandler(async (event) => {
  const { code } = await readBody(event)
  const codes = await listAll('dataRoomCodes')
  const input = String(code || '').trim().toUpperCase()
  const match = codes.find((c) => c.active !== false && String(c.code).toUpperCase() === input)
  if (!match) {
    throw createError({ statusCode: 401, statusMessage: 'That access code was not recognised.' })
  }
  await grantDataRoom(event)
  return { ok: true }
})
