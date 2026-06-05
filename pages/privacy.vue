<script setup>
import { site } from '~/data/site'

useSeoMeta({
  title: 'Privacy & Cookies',
  description: 'How Kyul Group Inc. collects, uses and protects personal data, in line with Kenya’s Data Protection Act (2019).',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Legal"
      title="Privacy & Cookies"
      lede="How we collect, use and protect your information — in line with Kenya’s Data Protection Act (2019)."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Privacy & Cookies' }]"
    />

    <section class="shell max-w-prose2 py-16 md:py-20">
      <div class="prose-kyul">
        <p class="text-sm text-forest-900/50">Last updated: April 2026</p>

        <h2>1. Who we are</h2>
        <p>
          {{ site.legalName }} (“Kyul Group”, “we”, “us”) is the data controller for personal information collected
          through this website. Our registered office is at {{ site.hq.line1 }}, {{ site.hq.line2 }}, {{ site.hq.country }}.
        </p>

        <h2>2. Information we collect</h2>
        <ul>
          <li>Information you provide through enquiry, RFP and job-application forms — such as your name, email, phone number and message.</li>
          <li>Limited technical information — such as your browser type and pages visited — collected through analytics, where you have consented.</li>
        </ul>

        <h2>3. How we use your information</h2>
        <ul>
          <li>To respond to your enquiries and route them to the relevant Kyul company.</li>
          <li>To consider job applications and manage recruitment.</li>
          <li>To understand how our website is used and to improve it.</li>
          <li>To meet our legal, regulatory and governance obligations.</li>
        </ul>

        <h2 id="cookies" class="scroll-mt-24">4. Cookies</h2>
        <p>
          We use essential cookies that are necessary for the website to function. With your consent, we also use
          optional analytics cookies to understand traffic and behaviour. You can accept or decline optional cookies
          using the banner shown on your first visit, and your preference is stored on your device.
        </p>

        <h2>5. Sharing your information</h2>
        <p>
          We share personal data only with the relevant Kyul Group company and trusted service providers who act on our
          instructions. We do not sell your personal data. Where data is processed by service providers, appropriate
          safeguards are in place.
        </p>

        <h2>6. Data security</h2>
        <p>
          We apply appropriate technical and organisational measures to protect personal data, including encryption in
          transit, access controls and audit logging across our systems.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Under the Data Protection Act (2019), you have the right to access, correct, or request deletion of your
          personal data, and to object to or restrict certain processing. To exercise these rights, contact us at
          <a :href="`mailto:${site.contact.email}`">{{ site.contact.email }}</a>.
        </p>

        <h2>8. Contact</h2>
        <p>
          For any privacy questions or requests, please write to <a :href="`mailto:${site.contact.email}`">{{ site.contact.email }}</a>
          or by post to our registered office above.
        </p>
      </div>
    </section>
  </div>
</template>
