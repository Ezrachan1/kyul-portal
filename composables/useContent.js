import { group as baseGroup } from '~/data/group'
import { investors as baseInvestors } from '~/data/investors'
import { subsidiaries as baseSubsidiaries } from '~/data/subsidiaries'
import { contentDefault } from '~/data/content-registry'

// Site content edited in the Group Portal (/dashboard/content). The store holds
// overrides only; everything else falls back to the copy authored in data/*.js
// and the registry, so an untouched site renders exactly as designed.
//
//   const { c, n, group, investors, subsidiaries, subsidiaryBySlug } = useContent()
//   c('about.hero.title')      -> override or the registry default (string)
//   n('home.stats.counties')   -> the same, parsed as a number (for <CountUp>)
//   group / investors          -> data objects with `group.*` / `investors.*`
//                                 overrides applied (computed; `.value` in script)
//   subsidiaries               -> list with `sub.<slug>.*` applied; a custom logo
//                                 replaces `logo`, a hero photo lands in `heroImage`
const present = (v) => v !== undefined && v !== null && v !== ''
const clone = (v) => JSON.parse(JSON.stringify(v))

function setPath(target, path, value) {
  const parts = path.split('.')
  let o = target
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (o[p] === null || typeof o[p] !== 'object') o[p] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    o = o[p]
  }
  o[parts[parts.length - 1]] = value
}

function overlay(base, prefix, overrides) {
  const keys = Object.keys(overrides).filter((k) => k.startsWith(prefix) && present(overrides[k]))
  if (!keys.length) return base
  const out = clone(base)
  for (const k of keys) setPath(out, k.slice(prefix.length), overrides[k])
  return out
}

export function useContent() {
  const { data } = useFetch('/api/content', { key: 'site-content', default: () => ({}) })
  const overrides = computed(() => (data.value && typeof data.value === 'object' ? data.value : {}))

  const c = (key, fallback) => {
    const v = overrides.value[key]
    if (present(v)) return v
    return fallback !== undefined ? fallback : contentDefault(key)
  }
  const n = (key, fallback = 0) => {
    const v = Number(String(c(key)).replace(/[^\d.-]/g, ''))
    return Number.isFinite(v) ? v : fallback
  }

  const group = computed(() => overlay(baseGroup, 'group.', overrides.value))
  const investors = computed(() => overlay(baseInvestors, 'investors.', overrides.value))
  const subsidiaries = computed(() =>
    baseSubsidiaries.map((s) => {
      const prefix = `sub.${s.slug}.`
      const o = overrides.value
      const keys = Object.keys(o).filter((k) => k.startsWith(prefix) && present(o[k]))
      if (!keys.length) return s
      const out = clone(s)
      for (const k of keys) {
        const path = k.slice(prefix.length)
        if (path === 'logo') out.logo = { ...out.logo, src: o[k], full: o[k], clean: true, tone: 'light' }
        else if (path === 'hero.image') out.heroImage = o[k]
        else setPath(out, path, o[k])
      }
      return out
    }),
  )
  const subsidiaryBySlug = (slug) => subsidiaries.value.find((s) => s.slug === slug)

  return { overrides, c, n, group, investors, subsidiaries, subsidiaryBySlug }
}
