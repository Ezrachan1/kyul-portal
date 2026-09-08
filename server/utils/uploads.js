// Upload storage: Cloudflare Workers KV binding in production, local file store
// in dev. KV keeps the project on Cloudflare's no-card free tier (value ≤ 25 MB).
// node:fs is imported dynamically so it is never bundled for the edge runtime.
function kv(event) {
  return event?.context?.cloudflare?.env?.KYUL_UPLOADS || null
}
function sanitize(name) {
  return String(name || '').replace(/[^a-zA-Z0-9._-]/g, '')
}

export async function saveUpload(event, name, bytes, contentType) {
  const safe = sanitize(name)
  const store = kv(event)
  if (store) {
    await store.put(safe, bytes, { metadata: { contentType: contentType || '' } })
    return safe
  }
  const { mkdir, writeFile } = await import('node:fs/promises')
  const { join } = await import('node:path')
  const dir = join(process.cwd(), '.data', 'uploads')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, safe), bytes)
  return safe
}

export async function readUpload(event, name) {
  const safe = sanitize(name)
  if (!safe) return null
  const store = kv(event)
  if (store) {
    const res = await store.getWithMetadata(safe, { type: 'arrayBuffer' })
    if (!res || !res.value) return null
    // Wrap in a Uint8Array: h3 only sends typed arrays/Buffers as raw bytes. A bare
    // ArrayBuffer falls through to JSON.stringify and is served as "{}" (2 bytes).
    return { body: new Uint8Array(res.value), contentType: res.metadata?.contentType || null }
  }
  try {
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')
    const buf = await readFile(join(process.cwd(), '.data', 'uploads', safe))
    return { body: buf, contentType: null }
  } catch {
    return null
  }
}
