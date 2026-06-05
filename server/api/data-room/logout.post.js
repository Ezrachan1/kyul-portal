export default defineEventHandler((event) => {
  clearDataRoom(event)
  return { ok: true }
})
