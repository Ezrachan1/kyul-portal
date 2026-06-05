import { issuers, VAT_RATE } from '~/data/invoices'

export function invoiceTotals(inv) {
  const subtotal = (inv?.items || []).reduce(
    (s, i) => s + (Number(i.qty) || 0) * (Number(i.unitPrice) || 0),
    0,
  )
  const tax = subtotal * (inv?.taxRate ?? VAT_RATE)
  return { subtotal, tax, total: subtotal + tax }
}

export function useInvoices() {
  const invoices = useState('kyul-invoices', () => [])
  const loaded = useState('kyul-invoices-loaded', () => false)
  const pending = useState('kyul-invoices-pending', () => false)

  async function refresh() {
    pending.value = true
    try {
      invoices.value = await $fetch('/api/invoices')
    } catch {
      invoices.value = []
    }
    loaded.value = true
    pending.value = false
  }
  async function ensure() {
    if (!loaded.value) await refresh()
  }

  const get = (id) => invoices.value.find((i) => i.id === id)

  function nextNumber(issuerSlug) {
    const code = issuers[issuerSlug]?.code || 'GRP'
    const prefix = `KYL-${code}-2026-`
    const seqs = invoices.value
      .filter((i) => i.number?.startsWith(prefix))
      .map((i) => parseInt(i.number.slice(prefix.length), 10) || 0)
    const next = (seqs.length ? Math.max(...seqs) : 0) + 1
    return prefix + String(next).padStart(3, '0')
  }

  async function create(data) {
    const inv = await $fetch('/api/invoices', { method: 'POST', body: data })
    invoices.value = [inv, ...invoices.value]
    return inv
  }
  async function update(id, patch) {
    const inv = await $fetch(`/api/invoices/${id}`, { method: 'PATCH', body: patch })
    const i = invoices.value.findIndex((x) => x.id === id)
    if (i >= 0) {
      invoices.value[i] = inv
      invoices.value = [...invoices.value]
    }
    return inv
  }
  async function remove(id) {
    await $fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    invoices.value = invoices.value.filter((x) => x.id !== id)
  }

  return { invoices, loaded, pending, refresh, ensure, get, create, update, remove, nextNumber }
}
