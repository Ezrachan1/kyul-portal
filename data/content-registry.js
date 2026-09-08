// Site Content registry — every image and copy slot a super-admin can change
// from the Group Portal (/dashboard/content), with its verbatim default.
//
// The store (server/api/content) holds OVERRIDES ONLY, keyed by these paths; an
// empty store renders the site exactly as authored here. Keys prefixed
// `group.` / `investors.` / `sub.<slug>.` are paths into data/*.js objects and
// are applied by useContent() without any template wiring; every other key is
// read explicitly in a page with c('key'). Keep `default` byte-identical to the
// copy it replaces so an untouched site never changes.
import { group } from './group'
import { investors } from './investors'
import { subsidiaries } from './subsidiaries'

const t = (key, label, def, extra = {}) => ({ key, label, type: 'text', default: def, ...extra })
const ta = (key, label, def, extra = {}) => ({ key, label, type: 'textarea', default: def, ...extra })
const num = (key, label, def, extra = {}) => ({ key, label, type: 'number', default: String(def), ...extra })
const img = (key, label, def, hint, maxEdge = 2400, extra = {}) => ({ key, label, type: 'image', default: def, hint, maxEdge, ...extra })

const HERO_HINT = 'Optional background photo behind the page title (landscape, ~2400px wide). Leave empty for the standard forest background.'

const heroFields = (prefix, eyebrow, title, lede, withImage = true) => [
  t(`${prefix}.hero.eyebrow`, 'Hero eyebrow', eyebrow),
  t(`${prefix}.hero.title`, 'Hero title', title),
  ...(lede === null ? [] : [ta(`${prefix}.hero.lede`, 'Hero lede', lede)]),
  ...(withImage ? [img(`${prefix}.hero.image`, 'Hero background photo', '', HERO_HINT)] : []),
]

const listFields = (prefix, items, spec, labelOf) =>
  items.flatMap((item, i) =>
    spec.map(([prop, label, kind]) => (kind === 'textarea' ? ta : t)(`${prefix}.${i}.${prop}`, `${labelOf(item, i)} · ${label}`, item[prop])),
  )

export const contentSections = [
  {
    id: 'brand',
    label: 'Brand & images',
    page: '/',
    intro: 'Logos and share images used across the whole site.',
    fields: [
      img('brand.logo', 'Group logo (home hero card)', '/logos/kyul-group-t.png', 'Transparent PNG or WebP, roughly square, at least 800px.', 1600),
      img('brand.ogImage', 'Social share image', '/og-image.png', 'Shown when a page is shared on LinkedIn, WhatsApp or X. Use a 1200×630 landscape image.', 1200),
    ],
  },
  {
    id: 'home',
    label: 'Home page',
    page: '/',
    fields: [
      t('home.hero.eyebrow', 'Hero eyebrow', 'Integrated project delivery & investment group'),
      t('home.hero.titleLine1', 'Hero title · line 1', 'Building Africa’s'),
      t('home.hero.titleLine2', 'Hero title · line 2', 'Future.'),
      t('home.hero.titleAccent', 'Hero title · accent word', 'Together.'),
      ta('home.hero.lede', 'Hero lede', 'We originate, design, finance, build and operate bankable projects across Eastern Africa.'),
      img('home.hero.image', 'Hero background photo', '', HERO_HINT),
      t('home.hero.cardLabel', 'Hero card · label', 'Group turnover, FY2025'),
      num('home.hero.cardValue', 'Hero card · turnover (KSh millions)', 510),
      t('home.hero.cardGrowth', 'Hero card · growth note', '+59% year on year'),
      num('home.stats.founded', 'Proof row · founded year', 2018),
      t('home.stats.foundedLabel', 'Proof row · founded label', 'Founded, Eldoret'),
      num('home.stats.counties', 'Proof row · counties active', 12),
      t('home.stats.countiesLabel', 'Proof row · counties label', 'Counties active'),
      num('home.stats.delivered', 'Proof row · project value delivered (KSh millions)', 350),
      t('home.stats.deliveredLabel', 'Proof row · delivered label', 'Project value delivered'),
      num('home.stats.turnover', 'Proof row · turnover (KSh millions)', 510),
      t('home.stats.turnoverLabel', 'Proof row · turnover label', 'FY2025 turnover'),
      t('home.stats.turnoverNote', 'Proof row · turnover note', '+59% YoY'),
      t('home.companies.eyebrow', 'Six specialists · eyebrow', 'Six specialists'),
      t('home.companies.title', 'Six specialists · title', 'One Group. Six specialists.'),
      ta('home.companies.lede', 'Six specialists · lede', 'Each company leads its field — and hands the baton to the next, from concept to cashflow.'),
      t('home.sectors.eyebrow', 'Sectors · eyebrow', 'Five high-growth sectors'),
      t('home.sectors.title', 'Sectors · title', 'We invest and build across the sectors shaping Africa.'),
      t('home.why.eyebrow', 'Why Kyul · eyebrow', 'Why Kyul'),
      t('home.why.title', 'Why Kyul · title', 'One platform. Fewer interfaces.'),
      ta('home.why.lede', 'Why Kyul · lede', 'The full value chain under one Group: one accountability chain from feasibility to operations.'),
      t('home.investors.eyebrow', 'Investor band · eyebrow', 'Investor relations'),
      t('home.investors.title', 'Investor band · title', 'Strong performance. Disciplined growth.'),
      ta('home.investors.lede', 'Investor band · lede', 'Turnover has grown from KSh 95M in FY2021 to KSh 510M in FY2025 — consolidated under one audit, ring-fenced through Kyul Holdings, and reported to institutional standard.'),
      t('home.news.eyebrow', 'News · eyebrow', 'News & insights'),
      t('home.news.title', 'News · title', 'From across the Group'),
      t('home.cta.eyebrow', 'Closing CTA · eyebrow', 'Partner with Kyul'),
      t('home.cta.title', 'Closing CTA · title', 'Let’s build something that lasts.'),
      ta('home.cta.text', 'Closing CTA · text', 'Have a project, investment opportunity or partnership in mind?'),
    ],
  },
  {
    id: 'chain',
    label: 'Concept to Cashflow',
    page: '/',
    intro: 'The signature value-chain journey shown on the home page and the Companies page. Each step has a portrait panel on desktop; add a photo to replace its forest design.',
    fields: [
      t('home.chain.eyebrow', 'Eyebrow (home page)', 'The Kyul value chain'),
      t('companies.chain.eyebrow', 'Eyebrow (Companies page)', 'How they work together'),
      t('group.valueChain.title', 'Title', group.valueChain.title),
      ta('group.valueChain.lede', 'Lede', group.valueChain.lede),
      ...group.valueChain.steps.map((st) =>
        img(`chain.${st.slug}.image`, `Step ${st.n} · ${st.entity} — panel photo`, '', 'Portrait photo (4:5, about 1200×1500px) for this step’s panel. The step number and company logo are laid over it. Leave empty for the standard forest design.', 1600),
      ),
    ],
  },
  {
    id: 'about',
    label: 'About the Group',
    page: '/about',
    fields: [
      ...heroFields('about', 'About the Group', 'The apex of the Kyul corporate family.', null),
      ta('group.intro', 'Hero lede (Group introduction)', group.intro),
      ta('group.narrative', 'Narrative (also opens the investor case)', group.narrative),
      ta('about.narrative.extra', 'Narrative · second paragraph', 'The Group operates across infrastructure, agribusiness, mining, manufacturing and real estate, a deliberate diversification that makes Kyul resilient and lets each company reinforce the others.'),
      ta('group.vision', 'Vision', group.vision),
      ta('group.mission', 'Mission', group.mission),
      t('about.values.eyebrow', 'Values · eyebrow', 'What we stand for'),
      t('about.values.title', 'Values · title', 'Five values, lived on every project.'),
      ...listFields('group.values', group.values, [['name', 'name'], ['text', 'text', 'textarea']], (v) => `Value “${v.name}”`),
      t('about.governance.eyebrow', 'Governance · eyebrow', 'Governance & structure'),
      t('about.governance.title', 'Governance · title', 'Clean ownership, by design.'),
      ta('group.governance.lede', 'Governance · lede (also on Investors)', group.governance.lede),
      ...listFields('group.governance.points', group.governance.points, [['title', 'title'], ['text', 'text', 'textarea']], (p) => `Governance point “${p.title}”`),
      t('about.leadership.eyebrow', 'Leadership · eyebrow', 'Leadership'),
      t('about.leadership.title', 'Leadership · title', 'The Board & Group executive.'),
      ta('about.leadership.lede', 'Leadership · lede', 'Kyul Group Inc. is governed by its Board of Directors, with each subsidiary led by its own managing director and technical board.'),
      ta('about.leadership.note', 'Leadership · footnote', 'Named board appointments are confirmed in the Group’s governance documentation, available to investors on request.'),
      t('about.history.eyebrow', 'Journey · eyebrow', 'Our journey'),
      t('about.history.title', 'Journey · title', 'From a single practice to an integrated Group.'),
      ...listFields('group.history', group.history, [['title', 'title'], ['text', 'text', 'textarea']], (h) => `${h.year}`),
      t('about.why.eyebrow', 'Why Kyul · eyebrow', 'Why Kyul'),
      t('about.why.title', 'Why Kyul · title', 'What sets the Group apart.'),
      ...listFields('group.advantages', group.advantages, [['title', 'title'], ['text', 'text', 'textarea']], (a) => `Advantage “${a.title}”`),
      t('about.cta.title', 'Closing CTA · title', 'Build with a Group that thinks long term.'),
      ta('about.cta.text', 'Closing CTA · text', 'Partner with us, invest with us, or join the team shaping Eastern Africa’s next decade.'),
    ],
  },
  {
    id: 'esg',
    label: 'Sustainability & ESG',
    page: '/esg',
    fields: [
      ...heroFields('esg', 'Sustainability & ESG', 'Returns, and the resilience we leave behind.', null),
      ta('group.esg.lede', 'Hero lede', group.esg.lede),
      ...group.esg.pillars.flatMap((p, i) => [
        t(`group.esg.pillars.${i}.name`, `Pillar ${i + 1} · name`, p.name),
        ta(`group.esg.pillars.${i}.text`, `Pillar ${i + 1} · text`, p.text),
        ...p.metrics.flatMap((m, j) => [
          t(`group.esg.pillars.${i}.metrics.${j}.label`, `Pillar ${i + 1} · metric ${j + 1} label`, m.label),
          t(`group.esg.pillars.${i}.metrics.${j}.value`, `Pillar ${i + 1} · metric ${j + 1} value`, m.value),
        ]),
      ]),
      t('esg.commitments.eyebrow', 'Commitments · eyebrow', 'Our commitments'),
      t('esg.commitments.title', 'Commitments · title', 'Sustainability, built into delivery.'),
      ta('esg.commitments.lede', 'Commitments · lede', 'ESG isn’t a report we publish once a year. It’s engineered into how every Kyul project is originated, built and governed.'),
      ta('esg.commitments.0.text', 'Commitment 1', 'Solar-powered boreholes and installations as a standard specification where feasible.'),
      ta('esg.commitments.1.text', 'Commitment 2', 'NEMA-compliant, mercury-free practices across mining and civil works.'),
      ta('esg.commitments.2.text', 'Commitment 3', 'Local employment and procurement that keeps value in the communities we build in.'),
      ta('esg.commitments.3.text', 'Commitment 4', 'Anti-bribery, conflict-of-interest and delegated-authority policies, Group-wide.'),
      ta('esg.commitments.4.text', 'Commitment 5', 'Community shareholding on selected project SPVs.'),
      ta('esg.commitments.5.text', 'Commitment 6', 'A genuine zero-harm safety culture on every site.'),
      ta('esg.quote.text', 'Statement quote (without quotation marks)', 'We measure success not only in returns, but in the jobs created, the infrastructure built and the communities strengthened along the way.'),
      t('esg.quote.by', 'Statement attribution', 'Office of the Group CEO'),
      t('esg.cta.eyebrow', 'Closing CTA · eyebrow', 'Partner on impact'),
      t('esg.cta.title', 'Closing CTA · title', 'Invest in projects that build more than returns.'),
    ],
  },
  {
    id: 'careers',
    label: 'Careers',
    page: '/careers',
    fields: [
      ...heroFields('careers', 'Careers', 'Build your career with Kyul.', 'We’re assembling the team that will deliver Eastern Africa’s next decade of infrastructure and investment. Find your place across the Group.'),
      t('careers.perks.0.title', 'Perk 1 · title', 'Real responsibility, early'),
      ta('careers.perks.0.text', 'Perk 1 · text', 'Work on live projects with measurable impact from day one.'),
      t('careers.perks.1.title', 'Perk 2 · title', 'Professional growth'),
      ta('careers.perks.1.text', 'Perk 2 · text', 'Mentorship from registered engineers and a path to professional registration.'),
      t('careers.perks.2.title', 'Perk 3 · title', 'Cross-Group exposure'),
      ta('careers.perks.2.text', 'Perk 3 · text', 'Move and learn across six companies and five sectors.'),
      t('careers.perks.3.title', 'Perk 4 · title', 'Purpose that matters'),
      ta('careers.perks.3.text', 'Perk 4 · text', 'Build infrastructure and create jobs across Eastern Africa.'),
      t('careers.speculative.title', 'Speculative applications · title', 'Don’t see your role?'),
      ta('careers.speculative.text', 'Speculative applications · text', 'We’re always glad to hear from exceptional people. Send us your CV and tell us where you’d add value.'),
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    page: '/contact',
    fields: [
      ...heroFields('contact', 'Contact', 'Let’s start a conversation.', 'Whether you’re an investor, a partner, a client or a future colleague, reach the right part of the Group below.'),
      t('contact.form.eyebrow', 'Message form · eyebrow', 'Send a message'),
      t('contact.form.title', 'Message form · title', 'How can we help?'),
      t('contact.directory.eyebrow', 'Company directory · eyebrow', 'Company directory'),
      t('contact.directory.title', 'Company directory · title', 'Reach a specific company.'),
    ],
  },
  {
    id: 'news',
    label: 'News & Insights',
    page: '/news',
    fields: [
      ...heroFields('news', 'News & insights', 'From across the Group.', 'Project milestones, press releases and perspectives on building and investing in Eastern Africa.'),
      t('news.cta.eyebrow', 'Closing CTA · eyebrow', 'Stay informed'),
      t('news.cta.title', 'Closing CTA · title', 'Follow the Group’s journey.'),
      ta('news.cta.text', 'Closing CTA · text', 'From county infrastructure to investment milestones, keep up with what Kyul is building.'),
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    page: '/projects',
    fields: [
      ...heroFields('projects', 'Projects', 'Building assets that matter.', 'Proof over promise: infrastructure, water, roads, agribusiness and real estate delivered across 12+ counties in Kenya and Eastern Africa.'),
      t('projects.cta.eyebrow', 'Closing CTA · eyebrow', 'Work with the Group'),
      t('projects.cta.title', 'Closing CTA · title', 'Have a project in mind?'),
      ta('projects.cta.text', 'Closing CTA · text', "Tell us what you're building or backing, and the right Kyul company will carry it from concept to handover."),
    ],
  },
  {
    id: 'companies',
    label: 'Companies (overview)',
    page: '/subsidiaries',
    fields: [
      ...heroFields('companies', 'The companies', 'Six specialists. One Group.', 'Each company leads in its own discipline, and together they form a continuous chain from concept to cashflow, coordinated under a single governance structure.'),
      t('companies.structure.parent.title', 'Structure · parent title', 'Kyul Group Inc.'),
      ta('companies.structure.parent.text', 'Structure · parent text', 'The ultimate parent and brand: strategy, policy and board-level oversight of the entire Group.'),
      t('companies.structure.holdings.title', 'Structure · sub-holding title', 'Kyul Holdings Ltd.'),
      ta('companies.structure.holdings.text', 'Structure · sub-holding text', 'The sub-holding vehicle that owns equity in the five operating companies and runs shared services and treasury.'),
      t('companies.structure.opcos.title', 'Structure · operating companies title', 'Operating companies'),
      ta('companies.structure.opcos.text', 'Structure · operating companies text', 'Five delivery specialists. No company holds shares in another, keeping ownership clean and risk ring-fenced.'),
      t('companies.cta.title', 'Closing CTA · title', 'Looking for a specific capability?'),
      ta('companies.cta.text', 'Closing CTA · text', 'Tell us about your project or partnership, and we’ll route it to the right company in the Group.'),
      ta('company.leadership.lede', 'Company pages · leadership lede (shared)', 'Experienced leaders, supported by the shared services and governance of Kyul Holdings.'),
      ta('company.contact.lede', 'Company pages · contact lede (shared)', 'Tell us about your project, tender or partnership. We respond within two business days.'),
    ],
  },
  ...subsidiaries.map((s) => ({
    id: `sub-${s.slug}`,
    label: s.name,
    page: `/subsidiaries/${s.slug}`,
    fields: [
      img(`sub.${s.slug}.logo`, 'Logo', s.logo.clean ? s.logo.src : s.logo.full, 'Transparent PNG or WebP on a light background, at least 800px wide.', 1600),
      img(`sub.${s.slug}.hero.image`, 'Hero photo', '', 'Optional photo shown in the company hero next to the introduction (roughly square, ~1600px). The logo appears as a badge over it.', 1800),
      t(`sub.${s.slug}.tagline`, 'Tagline', s.tagline),
      ta(`sub.${s.slug}.summary`, 'Summary (cards & search results)', s.summary),
      ta(`sub.${s.slug}.lede`, 'Hero lede', s.lede),
      ta(`sub.${s.slug}.offering`, 'In brief', s.offering),
      ...s.about.map((p, i) => ta(`sub.${s.slug}.about.${i}`, `About · paragraph ${i + 1}`, p)),
      t(`sub.${s.slug}.portfolioLabel`, 'Portfolio section title', s.portfolioLabel),
      ...listFields(`sub.${s.slug}.services`, s.services, [['name', 'name'], ['text', 'text', 'textarea']], (svc, i) => `Service ${i + 1}`),
      ...listFields(`sub.${s.slug}.stats`, s.stats, [['label', 'label'], ['value', 'value']], (st, i) => `Stat ${i + 1}`),
    ],
  })),
  {
    id: 'investors',
    label: 'Investor Relations',
    page: '/investors',
    fields: [
      t('ir.hero.eyebrow', 'Hero eyebrow', 'Investor relations'),
      t('ir.hero.title', 'Hero title', 'Capital. Transparency. Opportunity.'),
      ta('investors.lede', 'Hero lede', investors.lede),
      img('ir.hero.image', 'Hero background photo', '', HERO_HINT),
      t('ir.case.eyebrow', 'Investment case · eyebrow', 'The investment case'),
      t('ir.case.title', 'Investment case · title', 'Why investors choose Kyul.'),
      ...listFields('investors.thesis', investors.thesis, [['title', 'title'], ['text', 'text', 'textarea']], (x, i) => `Thesis ${i + 1}`),
      t('ir.performance.eyebrow', 'Performance · eyebrow', 'Performance'),
      t('ir.performance.title', 'Performance · title', 'Consolidated Group performance.'),
      ta('ir.performance.lede', 'Performance · lede', 'Illustrative consolidated figures. Audited statements are available in the secure investor data room.'),
      t('ir.governance.eyebrow', 'Governance · eyebrow', 'Governance & structure'),
      t('ir.governance.title', 'Governance · title', 'Clean ownership, by design.'),
      t('ir.documents.eyebrow', 'Documents · eyebrow', 'Document library'),
      t('ir.documents.title', 'Documents · title', 'Corporate & governance documents.'),
      ta('ir.documents.lede', 'Documents · lede', 'Public materials are available below. Financial statements and confidential documents are released to verified investors in the secure data room.'),
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Cookies',
    page: '/privacy',
    fields: heroFields('privacy', 'Legal', 'Privacy & Cookies', 'How we collect, use and protect your information, in line with Kenya’s Data Protection Act (2019).', false),
  },
  {
    id: 'footer',
    label: 'Footer',
    page: '/',
    fields: [
      t('footer.tagline', 'Signature line', 'Building Africa’s Future.'),
      t('footer.taglineAccent', 'Signature accent word', 'Together.'),
      ta('footer.description', 'Description', 'An integrated group originating, designing, financing, building and operating bankable projects across Eastern Africa.'),
    ],
  },
]

export const contentFields = Object.fromEntries(contentSections.flatMap((s) => s.fields.map((f) => [f.key, f])))

export function contentDefault(key) {
  const f = contentFields[key]
  return f ? (f.default ?? '') : ''
}
