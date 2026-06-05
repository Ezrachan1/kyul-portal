// Auto-imported formatting helpers

export function kes(amount, { decimals = 0 } = {}) {
  if (amount === null || amount === undefined || amount === '') return '—'
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return (
    'KSh ' +
    n.toLocaleString('en-KE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

export function num(value, decimals = 0) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return n.toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', opts)
}

export function monthYear(iso) {
  if (!iso) return ''
  // accepts "2026-04" or full ISO
  const d = new Date(iso.length === 7 ? `${iso}-01` : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export function relativeMonths(iso) {
  return monthYear(iso)
}
