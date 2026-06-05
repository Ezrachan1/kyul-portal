// Session auth for the Group Portal — signed cookie tokens + role guards.
// Edge-safe (WebCrypto HMAC). Cross-util functions are auto-imported by Nitro.
const COOKIE = 'kyul_session'
const DR_COOKIE = 'kyul_dataroom'
const TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const secret = () => useRuntimeConfig().sessionSecret || 'kyul-dev-secret'

export async function signToken(uid) {
  const payload = b64urlStr(JSON.stringify({ uid, exp: Date.now() + TTL_MS }))
  const sig = await hmacSha256(secret(), payload)
  return `${payload}.${sig}`
}

export async function verifyToken(token) {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expected = await hmacSha256(secret(), payload)
  if (!safeEqual(sig, expected)) return null
  try {
    const data = JSON.parse(b64urlToStr(payload))
    if (!data.exp || data.exp < Date.now()) return null
    return data.uid
  } catch {
    return null
  }
}

export async function setSession(event, uid) {
  setCookie(event, COOKIE, await signToken(uid), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(TTL_MS / 1000),
  })
}
export function endStaffSession(event) {
  deleteCookie(event, COOKIE, { path: '/' })
}

export function publicUser(u) {
  if (!u) return null
  const { salt, hash, ...rest } = u
  return rest
}

export async function getSessionUser(event) {
  const uid = await verifyToken(getCookie(event, COOKIE))
  if (!uid) return null
  const users = await listAll('users')
  const u = users.find((x) => x.id === uid && x.active !== false)
  return u || null
}

// ── Investor data-room access (separate from staff sessions) ──
export async function grantDataRoom(event) {
  setCookie(event, DR_COOKIE, await signToken('dataroom'), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  })
}
export async function hasDataRoom(event) {
  return (await verifyToken(getCookie(event, DR_COOKIE))) === 'dataroom'
}
export function clearDataRoom(event) {
  deleteCookie(event, DR_COOKIE, { path: '/' })
}

// roles: array of allowed roles. super-admin always passes.
export async function requireUser(event, roles) {
  const u = await getSessionUser(event)
  if (!u) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  if (roles && roles.length && u.role !== 'super-admin' && !roles.includes(u.role)) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have access to this resource.' })
  }
  return u
}
