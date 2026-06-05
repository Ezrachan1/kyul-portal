export default defineEventHandler(async (event) => {
  await requireUser(event, ['admin', 'finance'])

  if (event.method === 'GET') {
    return await listAll('invoices')
  }

  if (event.method === 'POST') {
    const b = await readBody(event)
    if (!b.client?.name) throw createError({ statusCode: 400, statusMessage: 'Client name is required.' })
    const item = {
      id: 'inv-' + uid().slice(0, 8),
      number: b.number || `KYL-2026-${Date.now().toString().slice(-4)}`,
      issuer: b.issuer || 'group',
      client: { name: b.client.name, address: b.client.address || '', email: b.client.email || '' },
      issueDate: b.issueDate || new Date().toISOString().slice(0, 10),
      dueDate: b.dueDate || new Date().toISOString().slice(0, 10),
      status: ['draft', 'pending', 'paid', 'overdue'].includes(b.status) ? b.status : 'pending',
      currency: b.currency || 'KES',
      taxRate: typeof b.taxRate === 'number' ? b.taxRate : 0.16,
      items: Array.isArray(b.items) ? b.items : [],
      notes: String(b.notes || ''),
      createdAt: new Date().toISOString(),
    }
    await insert('invoices', item)
    return item
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
