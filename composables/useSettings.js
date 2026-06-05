import { site } from '~/data/site'

// Site settings (HQ, contacts, socials, per-company contacts) are editable in
// the Group Portal. Falls back to the static defaults from data/site.js.
export function useSettings() {
  const { data } = useFetch('/api/settings', {
    key: 'site-settings',
    default: () => ({
      hq: { ...site.hq },
      contact: { ...site.contact },
      social: site.social.map((s) => ({ ...s })),
      subsidiaryContacts: {},
    }),
  })
  return data
}
