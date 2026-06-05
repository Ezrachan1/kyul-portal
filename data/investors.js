// Investor Relations — highlights, documents, governance, data room
export const investors = {
  lede:
    'Kyul Group is structured for the institutional and diaspora investor: clean ownership, ring-fenced SPVs and consolidated, audited reporting. This is where you begin your due diligence.',

  highlights: [
    { label: 'Group turnover (2025)', value: 'KSh 510M', note: '+59% year on year' },
    { label: '3-year revenue CAGR', value: '~68%', note: '2023 → 2025' },
    { label: 'Operating companies', value: 'Six', note: 'One sub-holding structure' },
    { label: 'Capital structure', value: 'KES · USD', note: 'Diaspora-ready accounts' },
  ],

  thesis: [
    { title: 'Integrated delivery', text: 'A single Group originates, designs, funds, builds and supplies every project — compressing timelines and removing interface risk.', icon: 'lucide:workflow' },
    { title: 'Clean ownership', text: 'All equity flows through Kyul Holdings. No cross-shareholding. Due diligence is simple and the corporate veil is intact.', icon: 'lucide:git-branch' },
    { title: 'Ring-fenced risk', text: 'Each project sits in its own SPV. Investor equity is insulated from unrelated venture risk.', icon: 'lucide:shield-check' },
    { title: 'Audited transparency', text: 'Consolidated annual audit, quarterly reporting and a secure investor data room — built for institutional scrutiny.', icon: 'lucide:file-check-2' },
  ],

  // Public, downloadable documents
  documents: [
    { title: 'Kyul Group Corporate Profile', type: 'PDF', size: '2.4 MB', date: '2026-04', category: 'Corporate', restricted: false },
    { title: 'Group Structure & Governance Overview', type: 'PDF', size: '1.1 MB', date: '2026-03', category: 'Governance', restricted: false },
    { title: 'ESG & Sustainability Summary 2025', type: 'PDF', size: '1.8 MB', date: '2026-02', category: 'ESG', restricted: false },
    { title: 'Group Fact Sheet (one-pager)', type: 'PDF', size: '420 KB', date: '2026-04', category: 'Corporate', restricted: false },
  ],

  // Items behind the secure data room (SSO/password)
  dataRoom: [
    { title: 'Consolidated Audited Financial Statements 2025', type: 'PDF', size: '3.6 MB', category: 'Financials' },
    { title: 'Management Accounts — Q4 2025', type: 'PDF', size: '1.2 MB', category: 'Financials' },
    { title: 'Cap Table & Share Register (Kyul Holdings)', type: 'XLSX', size: '180 KB', category: 'Governance' },
    { title: 'SPV Structure & Inter-company Loan Schedule', type: 'PDF', size: '900 KB', category: 'Governance' },
    { title: 'Project Pipeline & Capital Deployment Plan', type: 'PDF', size: '2.1 MB', category: 'Strategy' },
    { title: 'Risk Register & Insurance Summary', type: 'PDF', size: '740 KB', category: 'Risk' },
  ],

  governanceDocs: [
    { title: 'Memorandum & Articles of Association', icon: 'lucide:scroll' },
    { title: 'Board Charter & Delegated Authority Matrix', icon: 'lucide:gavel' },
    { title: 'Anti-Bribery & Conflict-of-Interest Policy', icon: 'lucide:shield' },
    { title: 'Group Financial Controls Policy', icon: 'lucide:lock' },
  ],
}
