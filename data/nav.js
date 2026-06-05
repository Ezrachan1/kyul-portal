import { subsidiaries } from './subsidiaries'

export const mainNav = [
  { label: 'The Group', to: '/about' },
  {
    label: 'Companies',
    to: '/subsidiaries',
    children: subsidiaries.map((s) => ({
      label: s.name,
      short: s.short,
      to: `/subsidiaries/${s.slug}`,
      arm: s.arm,
      accent: s.accent,
    })),
  },
  { label: 'Investors', to: '/investors' },
  { label: 'News & Insights', to: '/news' },
  { label: 'Careers', to: '/careers' },
  { label: 'Sustainability', to: '/esg' },
]

export const footerNav = [
  {
    title: 'The Group',
    links: [
      { label: 'About Kyul Group', to: '/about' },
      { label: 'Governance', to: '/about#governance' },
      { label: 'Leadership', to: '/about#leadership' },
      { label: 'Sustainability', to: '/esg' },
      { label: 'News & Insights', to: '/news' },
    ],
  },
  {
    title: 'Companies',
    links: subsidiaries.map((s) => ({ label: s.name, to: `/subsidiaries/${s.slug}` })),
  },
  {
    title: 'Connect',
    links: [
      { label: 'Investor Relations', to: '/investors' },
      { label: 'Investor Data Room', to: '/investors/data-room' },
      { label: 'Careers', to: '/careers' },
      { label: 'Group Portal', to: '/dashboard' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]
