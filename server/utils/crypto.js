// Edge-safe crypto via WebCrypto (globalThis.crypto) — works on Node 18+,
// Cloudflare Workers, Deno and Bun. No node:crypto dependency.
const te = new TextEncoder()
const td = new TextDecoder()

export function bytesToHex(buf) {
  const a = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < a.length; i++) s += a[i].toString(16).padStart(2, '0')
  return s
}
export function hexToBytes(hex) {
  const a = new Uint8Array(hex.length / 2)
  for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16)
  return a
}
export function b64url(buf) {
  const a = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
export function b64urlStr(str) {
  return b64url(te.encode(str))
}
export function b64urlToStr(b64) {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : ''
  const bin = atob(s + pad)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return td.decode(bytes)
}

// PBKDF2-SHA256 password hashing (edge-safe alternative to scrypt).
export async function pbkdf2Derive(password, saltHex) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', te.encode(String(password)), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  return { salt: bytesToHex(salt), hash: bytesToHex(bits) }
}

export async function hmacSha256(secret, payload) {
  const key = await crypto.subtle.importKey('raw', te.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, te.encode(payload))
  return b64url(sig)
}

// Constant-time string compare
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}
