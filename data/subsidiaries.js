// The six Kyul operating companies. Each drives its own sub-portal.
// `logo.clean` = background was cleanly removable (sits on light surfaces);
// otherwise we present the premium render framed on its native tone.

export const subsidiaries = [
  // ─────────────────────────────────────────── ENGINEERING
  {
    slug: 'engineering',
    name: 'Kyul Engineering Limited',
    short: 'Engineering',
    arm: 'Construction Arm',
    tagline: 'Designing Solid. Building Strong.',
    accent: '#1f7a3d',
    accentInk: '#0f3f20',
    accentSoft: '#eef6f0',
    logo: { src: '/logos/kyul-engineering-t.png', full: '/logos/kyul-engineering.png', clean: true, tone: 'light' },
    summary: 'Civil & structural contractor delivering builders, water and road works across Kenya and East Africa.',
    lede: 'A civil and structural engineering contractor delivering builders works, civil water works and civil road works — through Design & Build, Turnkey, Joint Venture and Construction Management contracts.',
    offering: 'NCA-registered. We build what the Group designs — to standard, on programme and to budget.',
    about: [
      'Kyul Engineering Limited is the construction arm of the Group: an NCA-registered civil and structural contractor headquartered in Eldoret and mobilising across the Rift Valley, Western and Nyanza regions.',
      'Our edge is single-point responsibility. With in-house engineers, quantity surveyors and our own plant, we reduce variations and compress programmes — particularly on the Design & Build and water projects where interface risk usually bites.',
    ],
    portfolioLabel: 'Selected Projects',
    services: [
      { name: 'Builders Works', icon: 'lucide:building', text: 'Commercial buildings, warehouses, schools, hospitals and housing — reinforced concrete, steel structures and finishing.' },
      { name: 'Civil Water Works', icon: 'lucide:droplets', text: 'Dams and pans, irrigation canals, water-treatment plants, pipelines, boreholes and sewerage systems.' },
      { name: 'Civil Road Works', icon: 'lucide:construction', text: 'Grading, gravelling and tarmacking, drainage, culverts, bridges and road maintenance.' },
      { name: 'Design & Build / Turnkey', icon: 'lucide:ruler', text: 'Full EPC — design, approvals, construction and handover under single-point responsibility.' },
      { name: 'Construction Management', icon: 'lucide:hard-hat', text: 'Supervision, cost control, QA/QC and contract administration for client-owned designs.' },
      { name: 'Joint Ventures', icon: 'lucide:handshake', text: 'SPVs with local and international firms for large or specialised donor-funded works.' },
    ],
    projects: [
      { name: 'County HQ Office Block', client: 'Uasin Gishu County', location: 'Eldoret', value: 'KSh 180M', year: '2024–25', scope: '4-storey RC frame & finishing, ~3,200m²', sector: 'Buildings', status: 'Delivered' },
      { name: 'Kesses Dam Rehabilitation', client: 'NGO + County', location: 'Kesses', value: 'KSh 65M', year: '2023', scope: 'Earth dam, spillway, intake & pipeline', sector: 'Water', status: 'Delivered' },
      { name: '15km Rural Access Road', client: 'KeRRA', location: 'Rift Valley', value: 'KSh 95M', year: '2023–24', scope: 'Grading, gravelling & 12 culverts', sector: 'Roads', status: 'Delivered' },
      { name: 'School Borehole & Tank', client: 'Donor-funded', location: 'Western', value: 'KSh 12M', year: '2025', scope: 'Solar borehole & 100m³ steel tank', sector: 'Water', status: 'Delivered' },
    ],
    stats: [
      { label: 'NCA categories', value: 'Builders · Roads · Water' },
      { label: 'Contract range', value: 'KSh 5M – 500M+' },
      { label: 'Delivery models', value: 'D&B · EPC · CM · JV' },
    ],
    team: [
      { role: 'Managing Director', initials: 'MD', bio: 'Leads the contracting business, tendering strategy and joint-venture relationships.' },
      { role: 'Technical Director', initials: 'TD', bio: 'Registered engineer responsible for structural design, QA/QC and engineering standards.' },
      { role: 'Head of Projects', initials: 'HP', bio: 'Owns site delivery, programme and HSE across all active contracts.' },
    ],
    contact: { email: 'engineering@kyulgroup.com', web: 'kyulengineering.co.ke' },
  },

  // ─────────────────────────────────────────── VENTURES
  {
    slug: 'ventures',
    name: 'Kyul Ventures Limited',
    short: 'Ventures',
    arm: 'Consulting & Design Arm',
    tagline: 'Where every project begins.',
    accent: '#ef8a23',
    accentInk: '#9a4f0c',
    accentSoft: '#fdf2e4',
    logo: { src: '/logos/kyul-ventures-t.png', full: '/logos/kyul-ventures.png', clean: true, tone: 'light' },
    summary: 'Project management and multidisciplinary design — feasibility, architecture, engineering, M&E and quantity surveying.',
    lede: 'The design, innovation and ideation unit of the Group — the genesis point for new projects, feasibility studies and conceptual development.',
    offering: 'We turn an opportunity into a designed, costed, bankable project ready to build.',
    about: [
      'Kyul Ventures Limited is the consulting and design arm — a multidisciplinary practice spanning architecture, structural, mechanical and electrical engineering, and quantity surveying.',
      'Ventures is where ideas become bankable. We run the feasibility, the design and the cost plan, then steer delivery as project managers — handing a fully resolved scope to Kyul Projects and Kyul Engineering with the interface risk already engineered out.',
    ],
    portfolioLabel: 'Design & Advisory Commissions',
    services: [
      { name: 'Feasibility & Advisory', icon: 'lucide:clipboard-list', text: 'Technical and commercial feasibility, options appraisal and bankability studies.' },
      { name: 'Architecture & Design', icon: 'lucide:pen-tool', text: 'Concept through detailed design, approvals and tender documentation.' },
      { name: 'Project & Programme Management', icon: 'lucide:kanban', text: 'End-to-end PM — scope, programme, risk and stakeholder coordination.' },
      { name: 'Cost & Quantity Surveying', icon: 'lucide:calculator', text: 'Cost planning, BOQs, valuations and contract administration.' },
      { name: 'M&E Engineering', icon: 'lucide:plug-zap', text: 'Mechanical, electrical and public-health engineering design and supervision.' },
      { name: 'Concept & Innovation', icon: 'lucide:lightbulb', text: 'Master-planning and value engineering for complex, multi-phase developments.' },
    ],
    projects: [
      { name: 'County HQ — Design & PM', client: 'Uasin Gishu County', location: 'Eldoret', value: '—', year: '2023–24', scope: 'Architecture, structures & project management', sector: 'Buildings', status: 'Completed' },
      { name: 'Irrigation Scheme Feasibility', client: 'County + Donor', location: 'Rift Valley', value: '—', year: '2024', scope: 'Feasibility, hydrology & cost plan', sector: 'Water', status: 'Completed' },
      { name: 'Agro-processing Master Plan', client: 'Kyul Projects SPV', location: 'Western', value: '—', year: '2025', scope: 'Master-plan & M&E concept design', sector: 'Manufacturing', status: 'In progress' },
    ],
    stats: [
      { label: 'Disciplines in-house', value: 'Arch · Struc · M&E · QS' },
      { label: 'Role', value: 'Design + PM' },
      { label: 'Standards', value: 'BS · Eurocodes' },
    ],
    team: [
      { role: 'Managing Director', initials: 'MD', bio: 'Leads the consultancy and the design-to-delivery handover into the Group pipeline.' },
      { role: 'Principal Architect', initials: 'PA', bio: 'Heads architectural design, master-planning and approvals.' },
      { role: 'Lead Quantity Surveyor', initials: 'QS', bio: 'Owns cost planning, BOQs and commercial management.' },
    ],
    contact: { email: 'ventures@kyulgroup.com', web: 'kyulgroup.com/subsidiaries/ventures' },
  },

  // ─────────────────────────────────────────── ENTERPRISES
  {
    slug: 'enterprises',
    name: 'Kyul Enterprises Limited',
    short: 'Enterprises',
    arm: 'Trade & Logistics Arm',
    tagline: 'Supplying the build. Moving the trade.',
    accent: '#1c3a6e',
    accentInk: '#13284c',
    accentSoft: '#eef1f7',
    logo: { src: '/logos/kyul-enterprises-t.png', full: '/logos/kyul-enterprises.png', clean: true, tone: 'light' },
    summary: 'Construction materials, equipment hire, import/export and logistics — plus agribusiness trade across Eastern Africa.',
    lede: 'The commercial and distribution arm of the Group — managing supply chains, agribusiness and consumer-facing trade across Eastern Africa.',
    offering: 'Group-scale procurement and logistics that keep projects supplied and competitively priced.',
    about: [
      'Kyul Enterprises Limited is the trading and logistics arm: the engine that keeps the Group’s sites supplied and its trade flowing.',
      'By consolidating procurement across all six companies, Enterprises secures framework pricing on fuel, materials and plant — then moves them where they are needed. Beyond the Group, it trades agribusiness commodities and distributes across the region.',
    ],
    portfolioLabel: 'Trade & Supply Programmes',
    services: [
      { name: 'Construction Materials', icon: 'lucide:package', text: 'Cement, steel, aggregates and finishing materials sourced at framework pricing.' },
      { name: 'Plant & Equipment Hire', icon: 'lucide:truck', text: 'Excavators, graders, tippers, rollers and concrete plant — owned and leased.' },
      { name: 'Import & Export', icon: 'lucide:ship', text: 'Specialist equipment and commodity import/export with customs handling.' },
      { name: 'Logistics & Distribution', icon: 'lucide:route', text: 'Haulage, warehousing and last-mile distribution across the region.' },
      { name: 'Agribusiness Trade', icon: 'lucide:sprout', text: 'Sourcing, aggregation and distribution of agricultural commodities and inputs.' },
      { name: 'Framework Procurement', icon: 'lucide:handshake', text: 'Group-wide supplier prequalification, framework agreements and bulk discounts.' },
    ],
    projects: [
      { name: 'Group Materials Framework', client: 'All Kyul companies', location: 'Group-wide', value: 'KSh 120M+/yr', year: 'Ongoing', scope: 'Cement, steel & aggregate supply', sector: 'Supply', status: 'Active' },
      { name: 'Plant Hire Pool', client: 'Kyul Engineering', location: 'Rift Valley', value: '—', year: 'Ongoing', scope: 'Earthmoving & compaction fleet', sector: 'Plant', status: 'Active' },
      { name: 'Agri-commodity Aggregation', client: 'Regional buyers', location: 'Western & Nyanza', value: '—', year: '2025', scope: 'Grain aggregation & distribution', sector: 'Agribusiness', status: 'Active' },
    ],
    stats: [
      { label: 'Procurement scope', value: 'Group-wide' },
      { label: 'Fleet', value: 'Owned + leased' },
      { label: 'Trade lanes', value: 'East Africa' },
    ],
    team: [
      { role: 'Managing Director', initials: 'MD', bio: 'Leads trading, procurement strategy and supplier relationships.' },
      { role: 'Head of Logistics', initials: 'HL', bio: 'Runs fleet, warehousing and distribution operations.' },
      { role: 'Procurement Manager', initials: 'PM', bio: 'Manages framework agreements and supplier prequalification.' },
    ],
    contact: { email: 'enterprises@kyulgroup.com', web: 'kyulgroup.com/subsidiaries/enterprises' },
  },

  // ─────────────────────────────────────────── PROJECTS
  {
    slug: 'projects',
    name: 'Kyul Projects Limited',
    short: 'Projects',
    arm: 'Development Arm',
    tagline: 'From opportunity to asset.',
    accent: '#e0731f',
    accentInk: '#16305b',
    accentSoft: '#fdf1e6',
    logo: { src: '/logos/kyul-projects-t.png', full: '/logos/kyul-projects.png', clean: true, tone: 'light' },
    summary: 'Project origination and SPV development in agribusiness, mining and manufacturing — with joint-venture structuring.',
    lede: 'The development arm — originating opportunities, structuring SPVs and securing the land, licences and partners that turn an idea into a deliverable project.',
    offering: 'We assemble the deal: opportunity, structure, land, licences and partners — ready for design and capital.',
    about: [
      'Kyul Projects Limited is the development arm of the Group. It originates opportunities in agribusiness, mining and manufacturing, then structures the special-purpose vehicle that will own and drive each one.',
      'Projects does the un-glamorous, decisive work: securing land and licences, engaging communities and counties, and structuring the joint ventures that bring in partners and capital — before handing a clean, bankable vehicle to Ventures and Investment.',
    ],
    portfolioLabel: 'Development Pipeline',
    services: [
      { name: 'Opportunity Origination', icon: 'lucide:search', text: 'Identifying and screening viable projects across the Group’s priority sectors.' },
      { name: 'SPV & JV Structuring', icon: 'lucide:network', text: 'Designing special-purpose vehicles and joint ventures that are bankable and ring-fenced.' },
      { name: 'Land & Licensing', icon: 'lucide:file-badge', text: 'Securing land, title, permits and statutory licences for development.' },
      { name: 'Execution Management', icon: 'lucide:list-checks', text: 'Driving the SPV through design approval, procurement and handover.' },
      { name: 'Community Engagement', icon: 'lucide:users-round', text: 'Stakeholder, county and community engagement — including local shareholding.' },
      { name: 'Development Finance', icon: 'lucide:banknote', text: 'Liaison with DFIs, lenders and Kyul Investment to assemble the capital stack.' },
    ],
    projects: [
      { name: 'Feed Mill SPV', client: 'Kyul Projects SPV', location: 'Uasin Gishu', value: 'KSh 220M (est.)', year: '2025–26', scope: 'Agribusiness — origination & structuring', sector: 'Agribusiness', status: 'Structuring' },
      { name: 'Industrial Minerals Concession', client: 'JV with partner', location: 'Rift Valley', value: '—', year: '2025', scope: 'Licensed, mercury-free quarry SPV', sector: 'Mining', status: 'Licensing' },
      { name: 'Affordable Housing Phase 1', client: 'County PPP', location: 'Eldoret', value: 'KSh 480M (est.)', year: '2026', scope: 'Land, PPP structure & approvals', sector: 'Real Estate', status: 'Origination' },
    ],
    stats: [
      { label: 'Focus sectors', value: 'Agri · Mining · Mfg' },
      { label: 'Structures', value: 'SPV · JV · PPP' },
      { label: 'Stage', value: 'Origination → handover' },
    ],
    team: [
      { role: 'Managing Director', initials: 'MD', bio: 'Leads origination, deal structuring and partner relationships.' },
      { role: 'Head of Development', initials: 'HD', bio: 'Owns land, licensing and statutory approvals.' },
      { role: 'Community Liaison Lead', initials: 'CL', bio: 'Manages county, community and stakeholder engagement.' },
    ],
    contact: { email: 'projects@kyulgroup.com', web: 'kyulgroup.com/subsidiaries/projects' },
  },

  // ─────────────────────────────────────────── INVESTMENT
  {
    slug: 'investment',
    name: 'Kyul Investment Limited',
    short: 'Investment',
    arm: 'Asset Management Arm',
    tagline: 'Capital with a clear return.',
    accent: '#b88a32',
    accentInk: '#1b2440',
    accentSoft: '#f7f1e3',
    logo: { src: '/logos/kyul-investment.png', full: '/logos/kyul-investment.png', clean: false, tone: 'dark' },
    summary: 'Real estate, equipment leasing, project equity and diaspora investment products — with disciplined portfolio management.',
    lede: 'The Group’s investment management subsidiary — responsible for portfolio management, financial instruments and ROI tracking.',
    offering: 'We put capital to work in Kyul’s projects and assets, and report on it to institutional standards.',
    about: [
      'Kyul Investment Limited is the asset-management arm. It holds and grows the Group’s capital — in real estate, in plant and equipment leased to operating companies, and as equity in Kyul’s project SPVs.',
      'For external and diaspora investors, Investment is the front door: USD-denominated products, ring-fenced SPVs and transparent IRR and MOIC reporting on every position.',
    ],
    portfolioLabel: 'Portfolio Holdings',
    services: [
      { name: 'Real Estate Investment', icon: 'lucide:building-2', text: 'Commercial, industrial and residential assets held for income and capital growth.' },
      { name: 'Equipment Leasing', icon: 'lucide:forklift', text: 'Plant and equipment owned by the Group and leased to operating companies.' },
      { name: 'Project Equity', icon: 'lucide:pie-chart', text: 'Equity stakes in Kyul project SPVs, co-invested with external partners.' },
      { name: 'Diaspora Products', icon: 'lucide:globe-2', text: 'USD-denominated, audited investment products for investors abroad.' },
      { name: 'Portfolio Management', icon: 'lucide:line-chart', text: 'IRR and MOIC tracking, capital deployment schedules and dividend management.' },
      { name: 'Asset Management', icon: 'lucide:briefcase', text: 'Active management of the Group’s income-generating asset base.' },
    ],
    projects: [
      { name: 'Eldoret Commercial Plaza', client: 'Owned asset', location: 'Eldoret', value: 'KSh 240M', year: 'Held', scope: 'Retail & office — income asset', sector: 'Real Estate', status: 'Performing' },
      { name: 'Group Equipment Lease Book', client: 'Intra-group', location: 'Group-wide', value: 'KSh 160M', year: 'Ongoing', scope: 'Plant leased to Engineering & Enterprises', sector: 'Leasing', status: 'Performing' },
      { name: 'Project Equity — Water & Agri', client: 'Kyul SPVs', location: 'Rift Valley', value: 'KSh 90M', year: '2024–', scope: 'Co-invested project equity', sector: 'Equity', status: 'Deploying' },
    ],
    stats: [
      { label: 'Mandate', value: 'Income + growth' },
      { label: 'Currencies', value: 'KES · USD' },
      { label: 'Reporting', value: 'IRR · MOIC' },
    ],
    team: [
      { role: 'Managing Director', initials: 'MD', bio: 'Leads investment strategy, capital deployment and investor relations.' },
      { role: 'Head of Portfolio', initials: 'HP', bio: 'Owns portfolio performance, valuations and IRR/MOIC reporting.' },
      { role: 'Asset Manager', initials: 'AM', bio: 'Manages real-estate and leasing assets for income and growth.' },
    ],
    contact: { email: 'investment@kyulgroup.com', web: 'kyulgroup.com/subsidiaries/investment' },
  },

  // ─────────────────────────────────────────── HOLDINGS
  {
    slug: 'holdings',
    name: 'Kyul Holdings Limited',
    short: 'Holdings',
    arm: 'Sub-Holding Company',
    tagline: 'The structure behind the Group.',
    accent: '#2f6fb0',
    accentInk: '#1c4a7d',
    accentSoft: '#eef4fa',
    logo: { src: '/logos/kyul-holdings.png', full: '/logos/kyul-holdings.png', clean: false, tone: 'light' },
    summary: 'Internal shareholding, treasury and governance — plus the shared services that run the whole Group.',
    lede: 'The sub-holding vehicle that owns equity in the operating companies and provides centralised finance, legal, HR, IT, risk and compliance.',
    offering: 'Clean ownership, shared services and investor-grade governance — so the operating companies can focus on delivery.',
    about: [
      'Kyul Holdings Limited sits between Kyul Group Inc. and the five operating companies. It is 100% owned by the Group and, in turn, holds the equity in Projects, Ventures, Engineering, Enterprises and Investment.',
      'The principle is clean ownership: no operating company holds shares in another. Every inter-company stake flows through Holdings, which also runs the Group’s shared services and treasury — keeping overheads low, reporting consolidated and due diligence simple.',
    ],
    portfolioLabel: 'Companies Under Management',
    services: [
      { name: 'Group Finance', icon: 'lucide:wallet', text: 'Consolidated accounts, tax, payroll, budgeting, investor reporting and audit liaison.' },
      { name: 'Legal & Compliance', icon: 'lucide:scale', text: 'Contracts, SPV structuring, statutory renewals and board secretarial services.' },
      { name: 'HR & Admin', icon: 'lucide:users', text: 'Recruitment, staff contracts, training, policies and Group medical & insurance.' },
      { name: 'IT & Systems', icon: 'lucide:server', text: 'ERP, servers, email, cybersecurity, the investor portal and the data room.' },
      { name: 'Risk & Treasury', icon: 'lucide:shield-check', text: 'Group insurance, bank facilities, forex, inter-company funding and risk registers.' },
      { name: 'Group Procurement', icon: 'lucide:shopping-cart', text: 'Framework agreements and Group discounts on fuel, materials and software.' },
    ],
    projects: [
      { name: 'Kyul Engineering Limited', client: 'Equity holding', location: 'Construction', value: 'Held', year: '—', scope: 'Civil & structural contractor', sector: 'Operating Co', status: 'Held' },
      { name: 'Kyul Ventures Limited', client: 'Equity holding', location: 'Consulting', value: 'Held', year: '—', scope: 'Design & project management', sector: 'Operating Co', status: 'Held' },
      { name: 'Kyul Enterprises Limited', client: 'Equity holding', location: 'Trade', value: 'Held', year: '—', scope: 'Trade & logistics', sector: 'Operating Co', status: 'Held' },
      { name: 'Kyul Projects Limited', client: 'Equity holding', location: 'Development', value: 'Held', year: '—', scope: 'Project origination & SPVs', sector: 'Operating Co', status: 'Held' },
      { name: 'Kyul Investment Limited', client: 'Equity holding', location: 'Asset mgmt', value: 'Held', year: '—', scope: 'Investment & asset management', sector: 'Operating Co', status: 'Held' },
    ],
    stats: [
      { label: 'Owns equity in', value: '5 operating companies' },
      { label: 'Shared services', value: '6 departments' },
      { label: 'Reporting', value: 'Consolidated & audited' },
    ],
    team: [
      { role: 'Group CFO', initials: 'CF', bio: 'Leads Group treasury, consolidated reporting and investor-grade financials.' },
      { role: 'Group Legal Counsel', initials: 'LC', bio: 'Owns governance, SPV structuring and statutory compliance.' },
      { role: 'Group HR Director', initials: 'HR', bio: 'Runs Group-wide people, policy and shared administration.' },
    ],
    contact: { email: 'holdings@kyulgroup.com', web: 'kyulgroup.com/subsidiaries/holdings' },
  },
]

export const subsidiaryBySlug = (slug) => subsidiaries.find((s) => s.slug === slug)
export const subsidiarySlugs = subsidiaries.map((s) => s.slug)
