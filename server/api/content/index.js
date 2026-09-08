// Site Content overrides — see data/content-registry.js for every editable slot.
// GET is public (the public site reads it at render time); PATCH is super-admin.
// The store holds overrides only: a value equal to its default, or empty, clears
// the key, so the collection never grows beyond what has actually been changed.
import { contentFields } from '~/data/content-registry'

// Uploaded or bundled site-relative paths only — never an external URL.
const IMAGE_PATH = /^\/(uploads|logos|images)\/[A-Za-z0-9][A-Za-z0-9._-]*(\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/
const NUMBER = /^-?\d+(\.\d+)?$/
const MAX = { text: 400, textarea: 3000, image: 300, number: 20 }

const asMap = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return asMap(await readCol('content'))
  }

  if (event.method === 'PATCH') {
    await requireUser(event, ['super-admin'])
    const body = asMap(await readBody(event))
    const next = { ...asMap(await readCol('content')) }

    for (const [key, raw] of Object.entries(body)) {
      const field = contentFields[key]
      if (!field) throw createError({ statusCode: 400, statusMessage: `Unknown content field: ${key}` })

      const value = raw === null || raw === undefined ? '' : String(raw).trim()
      if (!value || value === String(field.default ?? '')) {
        delete next[key]
        continue
      }
      if (value.length > MAX[field.type]) {
        throw createError({ statusCode: 400, statusMessage: `${field.label} is too long (max ${MAX[field.type]} characters).` })
      }
      if (field.type === 'image' && (!IMAGE_PATH.test(value) || value.includes('..'))) {
        throw createError({ statusCode: 400, statusMessage: `${field.label}: please upload an image rather than pasting a link.` })
      }
      if (field.type === 'number' && !NUMBER.test(value)) {
        throw createError({ statusCode: 400, statusMessage: `${field.label} must be a number.` })
      }
      next[key] = value
    }

    await writeCol('content', next)
    return next
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
