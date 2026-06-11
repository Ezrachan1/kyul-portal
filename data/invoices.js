// Invoice seed data + issuer registry for the Group portal dashboard.
// Issuers are Kyul companies; the invoice document carries the issuer brand.

export const issuers = {
  group:       { code: 'GRP', name: 'Kyul Group Inc.',          accent: '#2d5d4b', email: 'finance@kyulgroup.com' },
  engineering: { code: 'ENG', name: 'Kyul Engineering Limited', accent: '#1f7a3d', email: 'accounts@kyulengineering.co.ke' },
  ventures:    { code: 'VEN', name: 'Kyul Ventures Limited',    accent: '#ef8a23', email: 'finance@kyulgroup.com' },
  enterprises: { code: 'ENT', name: 'Kyul Enterprises Limited', accent: '#1c3a6e', email: 'trade@kyulgroup.com' },
  projects:    { code: 'PRJ', name: 'Kyul Projects Limited',    accent: '#e0731f', email: 'finance@kyulgroup.com' },
  investment:  { code: 'INV', name: 'Kyul Investment Limited',  accent: '#b88a32', email: 'finance@kyulgroup.com' },
  holdings:    { code: 'HLD', name: 'Kyul Holdings Limited',    accent: '#2f6fb0', email: 'treasury@kyulgroup.com' },
}

export const VAT_RATE = 0.16 // Kenya standard VAT

export const seedInvoices = [
  {
    id: 'inv-001', number: 'KYL-ENG-2026-001', issuer: 'engineering',
    client: { name: 'Uasin Gishu County Government', address: 'P.O. Box 40-30100, Eldoret', email: 'procurement@uasingishu.go.ke' },
    issueDate: '2026-02-12', dueDate: '2026-03-14', status: 'paid', currency: 'KES', taxRate: VAT_RATE,
    items: [{ description: 'County HQ Office Block, Interim Payment Certificate No. 4', qty: 1, unitPrice: 18000000 }],
    notes: 'Per Design & Build contract KGI/UG/2024/017. Retention 5% held.',
  },
  {
    id: 'inv-002', number: 'KYL-ENG-2026-002', issuer: 'engineering',
    client: { name: 'Kenya Rural Roads Authority (KeRRA)', address: 'Blue Shield Towers, Nairobi', email: 'payments@kerra.go.ke' },
    issueDate: '2026-04-03', dueDate: '2026-05-03', status: 'pending', currency: 'KES', taxRate: VAT_RATE,
    items: [
      { description: '15km Rural Access Road, Grading & gravelling (IPC 3)', qty: 1, unitPrice: 6200000 },
      { description: 'Culvert installation, 4 No. units', qty: 4, unitPrice: 350000 },
    ],
    notes: 'Performance-based contract. Net 30 days.',
  },
  {
    id: 'inv-003', number: 'KYL-ENT-2026-014', issuer: 'enterprises',
    client: { name: 'Kyul Engineering Limited', address: 'Kyul Centre, Eldoret', email: 'accounts@kyulengineering.co.ke' },
    issueDate: '2026-05-09', dueDate: '2026-06-08', status: 'pending', currency: 'KES', taxRate: VAT_RATE,
    items: [
      { description: 'Ordinary Portland Cement, 42.5N (per tonne)', qty: 400, unitPrice: 6800 },
      { description: 'Reinforcement steel Y12 (per tonne)', qty: 6, unitPrice: 92000 },
    ],
    notes: 'Inter-company supply at Group framework pricing.',
  },
  {
    id: 'inv-004', number: 'KYL-VEN-2026-007', issuer: 'ventures',
    client: { name: 'Kyul Projects Limited', address: 'Kyul Centre, Eldoret', email: 'finance@kyulgroup.com' },
    issueDate: '2026-03-20', dueDate: '2026-04-19', status: 'paid', currency: 'KES', taxRate: VAT_RATE,
    items: [{ description: 'Agro-processing master plan, feasibility & concept design', qty: 1, unitPrice: 1450000 }],
    notes: 'Stage 1 design fee per appointment KGI/VEN/2026/004.',
  },
  {
    id: 'inv-005', number: 'KYL-INV-2026-003', issuer: 'investment',
    client: { name: 'Highlands Retail Ltd', address: 'Eldoret Commercial Plaza, Eldoret', email: 'accounts@highlandsretail.co.ke' },
    issueDate: '2026-04-01', dueDate: '2026-04-30', status: 'overdue', currency: 'KES', taxRate: VAT_RATE,
    items: [{ description: 'Eldoret Commercial Plaza: Lease, Q2 2026 (3 months)', qty: 3, unitPrice: 800000 }],
    notes: 'Quarterly lease per tenancy agreement. Late fees may apply.',
  },
  {
    id: 'inv-006', number: 'KYL-ENT-2026-021', issuer: 'enterprises',
    client: { name: 'Rift Valley Millers Ltd', address: 'Eldoret, Kenya', email: 'purchasing@rvmillers.co.ke' },
    issueDate: '2026-05-22', dueDate: '2026-06-21', status: 'pending', currency: 'KES', taxRate: VAT_RATE,
    items: [{ description: 'Maize grain, aggregated supply (per 90kg bag)', qty: 1600, unitPrice: 3600 }],
    notes: 'Agribusiness trade, delivery EX-warehouse Eldoret.',
  },
  {
    id: 'inv-007', number: 'KYL-PRJ-2026-002', issuer: 'projects',
    client: { name: 'Sirikwa Agri JV Partners', address: 'Nairobi, Kenya', email: 'finance@sirikwaagri.co.ke' },
    issueDate: '2026-02-28', dueDate: '2026-03-30', status: 'paid', currency: 'KES', taxRate: VAT_RATE,
    items: [{ description: 'Development management fee, Feed Mill SPV structuring', qty: 1, unitPrice: 2750000 }],
    notes: 'Per JV development management agreement.',
  },
  {
    id: 'inv-008', number: 'KYL-ENG-2026-003', issuer: 'engineering',
    client: { name: 'WaterAid Partners (Donor)', address: 'Nairobi, Kenya', email: 'grants@wateraidpartners.org' },
    issueDate: '2026-05-30', dueDate: '2026-06-29', status: 'draft', currency: 'KES', taxRate: VAT_RATE,
    items: [
      { description: 'School borehole drilling & solar pump installation', qty: 1, unitPrice: 8400000 },
      { description: 'Elevated 100m³ steel storage tank & kiosks', qty: 1, unitPrice: 3600000 },
    ],
    notes: 'Draft, pending donor approval of variation.',
  },
]
