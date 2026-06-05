// News & Insights hub — Group-wide CMS content
export const articles = [
  {
    slug: 'uasin-gishu-county-hq-handover',
    title: 'Kyul Engineering hands over the Uasin Gishu County HQ office block',
    category: 'Project Update',
    date: '2025-11-18',
    author: 'Kyul Group Communications',
    entity: 'engineering',
    readingTime: 3,
    featured: true,
    excerpt:
      'A four-storey, 3,200m² county headquarters delivered on a Design & Build contract — handed over on programme and within budget.',
    body: [
      { type: 'p', text: 'Kyul Engineering Limited has formally handed over the new four-storey County HQ office block in Eldoret, completing a KSh 180M Design & Build engagement for Uasin Gishu County. The 3,200m² reinforced-concrete frame building was delivered on programme, with finishing, services and external works completed under a single contract.' },
      { type: 'h2', text: 'One contract, one point of responsibility' },
      { type: 'p', text: 'The project demonstrates the Group’s core thesis: design and construction under one roof. Kyul Ventures led the architecture, structures and project management; Kyul Engineering built it; and Kyul Enterprises supplied the cement, steel and finishing materials at framework pricing. The result was fewer variations and a compressed programme.' },
      { type: 'q', text: 'When design, delivery and supply sit inside one Group, the interface risk that usually delays public buildings simply isn’t there.' },
      { type: 'p', text: 'The building adds modern, accessible civic office space and was delivered to KEBS and NEMA standards, with a zero lost-time-injury record maintained across the construction period.' },
    ],
  },
  {
    slug: 'concept-to-cashflow-integrated-model',
    title: 'Concept to Cashflow: why an integrated group de-risks African infrastructure',
    category: 'Insight',
    date: '2025-10-02',
    author: 'Office of the Group CEO',
    entity: null,
    readingTime: 5,
    featured: true,
    excerpt:
      'Fragmented delivery is the hidden tax on African projects. Kyul’s answer is a single thread of accountability from feasibility to performing asset.',
    body: [
      { type: 'p', text: 'The most common reason good African projects stall is not capital — it is the gaps between the people who design, fund, build and supply them. Every handover is a chance for scope to drift, budgets to slip and accountability to evaporate.' },
      { type: 'h2', text: 'A single thread of accountability' },
      { type: 'p', text: 'Kyul Group is structured to close those gaps. Kyul Projects originates and structures the opportunity; Kyul Ventures designs and costs it; Kyul Investment funds it; Kyul Engineering builds it; Kyul Enterprises supplies it; and Kyul Holdings governs and reports on it. The same Group that draws the first sketch is accountable for the final cashflow.' },
      { type: 'h2', text: 'Why investors notice' },
      { type: 'p', text: 'For an institutional or diaspora investor, this matters in concrete ways: ring-fenced SPVs, clean ownership through a single sub-holding, and consolidated, audited reporting. The structure is built to survive due diligence — because it was designed for it.' },
      { type: 'q', text: 'We build what we design, and we finance what we build. That sentence is the entire investment case.' },
    ],
  },
  {
    slug: 'kyul-holdings-consolidation',
    title: 'Kyul Holdings Limited consolidates Group ownership and shared services',
    category: 'Group News',
    date: '2025-08-21',
    author: 'Kyul Group Communications',
    entity: 'holdings',
    readingTime: 3,
    featured: false,
    excerpt:
      'The Group formalises Kyul Holdings as its sub-holding vehicle — clean ownership, centralised treasury and shared services across all companies.',
    body: [
      { type: 'p', text: 'Kyul Group Inc. has completed the consolidation of inter-company shareholding under Kyul Holdings Limited. The sub-holding now holds equity in all five operating companies, while the Group remains the ultimate parent and brand.' },
      { type: 'p', text: 'The move establishes a clean ownership structure — no operating company holds shares in another — and centralises Group finance, legal, HR, IT, risk and procurement. The objective is lower overhead, consolidated reporting and a structure that institutional investors can diligence quickly.' },
    ],
  },
  {
    slug: 'water-works-rift-valley',
    title: 'Water security in the Rift Valley: dams, boreholes and solar pumping',
    category: 'Insight',
    date: '2025-06-12',
    author: 'Kyul Engineering — Water Division',
    entity: 'engineering',
    readingTime: 4,
    featured: false,
    excerpt:
      'From the Kesses dam rehabilitation to solar-pumped school boreholes, a look at how Kyul approaches resilient rural water infrastructure.',
    body: [
      { type: 'p', text: 'Water is where engineering meets community resilience. Over the past two years Kyul Engineering has delivered a portfolio of water works across the Rift Valley and Western regions — from the rehabilitation of the Kesses earth dam to solar-pumped boreholes and storage for schools.' },
      { type: 'h2', text: 'Designing for the long term' },
      { type: 'p', text: 'Our standard specification now defaults to solar pumping wherever feasible, reducing operating cost and carbon while improving reliability for communities that cannot depend on grid power. Every scheme is delivered to NEMA standards with community engagement built in.' },
    ],
  },
  {
    slug: 'diaspora-investment-products',
    title: 'Kyul Investment opens USD-denominated products for diaspora investors',
    category: 'Press Release',
    date: '2025-04-30',
    author: 'Kyul Investment Limited',
    entity: 'investment',
    readingTime: 2,
    featured: false,
    excerpt:
      'Audited, ring-fenced and reported on IRR/MOIC terms — Kyul Investment formalises investment products for Kenyans abroad.',
    body: [
      { type: 'p', text: 'Kyul Investment Limited has launched a set of USD-denominated investment products aimed at diaspora investors seeking exposure to Eastern African infrastructure and real estate through a governed, transparent structure.' },
      { type: 'p', text: 'Each product is held in a ring-fenced SPV, audited annually, and reported to investors on IRR and MOIC terms through the Group’s secure investor portal.' },
    ],
  },
  {
    slug: 'kerra-rural-roads-programme',
    title: 'On the gravel: completing 15km of KeRRA rural access roads',
    category: 'Project Update',
    date: '2024-12-09',
    author: 'Kyul Engineering — Roads Division',
    entity: 'engineering',
    readingTime: 3,
    featured: false,
    excerpt:
      'Grading, gravelling and twelve culverts — connecting communities and markets across the Rift Valley under a KeRRA contract.',
    body: [
      { type: 'p', text: 'Kyul Engineering has completed a 15km rural access road for the Kenya Rural Roads Authority (KeRRA), comprising grading, gravelling, drainage and twelve culverts. The KSh 95M contract improves all-weather access for communities and connects smallholder farmers to markets.' },
      { type: 'p', text: 'Rural roads are among the highest-return infrastructure investments available — and a core part of Kyul’s civil works portfolio across the region.' },
    ],
  },
]

export const articleBySlug = (slug) => articles.find((a) => a.slug === slug)
export const categories = ['All', 'Group News', 'Press Release', 'Project Update', 'Insight']
