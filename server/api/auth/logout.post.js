export default defineEventHandler((event) => {
  endStaffSession(event)
  return { ok: true }
})
