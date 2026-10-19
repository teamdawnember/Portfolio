import type { ReactNode } from 'react';
import { DrawLine } from '../common/TornPaperCard';
import { Reveal } from '../common/Reveal';
import Footer from '../common/Footer';

const orange = '#AD4F2E';
const pad = 'clamp(28px,5cqw,60px)';

/* Update this whenever the policy text below changes. */
const EFFECTIVE_DATE = '19 October 2026';

const mail = <a href="mailto:hello@dawnember.in" style={{ color: '#E6C8AC' }}>hello@dawnember.in</a>;

const list = (items: ReactNode[]) => (
  <ul style={{ margin: '10px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const strong = (text: string) => <strong style={{ color: '#F8ECE0', fontWeight: 600 }}>{text}</strong>;

/* ─── Policy sections ───────────────────────────────────────────────────
   Each entry renders as a numbered heading + body. */
const sections: { title: string; body: ReactNode }[] = [
  {
    title: 'What we collect',
    body: (
      <>
        <p>We only collect what you choose to share with us through our contact form:</p>
        {list([strong('Name'), strong('Mobile number'), strong('Email address'), strong('Your message')])}
        <p>We do <strong style={{ color: '#F8ECE0' }}>not</strong> use analytics, tracking or advertising cookies, and we do not build profiles of visitors.</p>
        <p>
          When you visit the site, our hosting and content providers may briefly log standard technical
          information, such as your IP address, browser type and time of visit, to deliver the site securely.
          Our fonts are loaded from Google Fonts, which also receives your IP address when the page loads.
        </p>
      </>
    ),
  },
  {
    title: 'Why we use it',
    body: (
      <>
        <p>We use your details <strong style={{ color: '#F8ECE0' }}>only to reply to your enquiry</strong> and continue the conversation you started, for example to send a quote or arrange a call.</p>
        <p>We will not:</p>
        {list(['send you marketing messages,', 'sell or rent your data,', 'share it with anyone for their own purposes.'])}
      </>
    ),
  },
  {
    title: 'Your consent',
    body: (
      <p>
        We process your details only after you tick the consent box on our contact form. You can withdraw
        your consent at any time by emailing {mail}. Withdrawing is as easy as giving consent. Once you
        withdraw, we stop using your details and delete them, unless the law requires us to keep them.
      </p>
    ),
  },
  {
    title: 'Who we share it with',
    body: (
      <>
        <p>Your details are handled only by:</p>
        {list([
          <>{strong('The DawnEmber team')}, who reply to you, and</>,
          <>{strong('Trusted service providers')} who help us run this website and deliver email (website hosting, email delivery and image storage). They act on our instructions and may not use your data for anything else.</>,
        ])}
        <p>Some of these providers may store data on servers outside India. Where they do, we rely on their security standards and only transfer data as permitted under Indian law.</p>
      </>
    ),
  },
  {
    title: 'How long we keep it',
    body: (
      <p>
        We keep enquiry details only for as long as we need them to respond and follow up. If you don't
        become a client, we delete your details within 12 months of our last contact. If you become a client,
        we keep the records our agreement and the law require.
      </p>
    ),
  },
  {
    title: 'How we protect it',
    body: (
      <p>
        The site is served over HTTPS, and only the people who need your enquiry to reply can access it.
        If a personal data breach ever affects you, we will inform you and the Data Protection Board of
        India as the law requires.
      </p>
    ),
  },
  {
    title: 'Your rights',
    body: (
      <>
        <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
        {list([
          <>{strong('Access')}: ask what personal data we hold about you and how we use it.</>,
          <>{strong('Correct or update')} inaccurate or incomplete details.</>,
          <>{strong('Erase')}: ask us to delete your data.</>,
          <>{strong('Withdraw consent')} at any time.</>,
          <>{strong('Nominate')} someone to exercise these rights on your behalf if you die or become unable to do so.</>,
          <>{strong('Raise a grievance')} with us, and if you're not satisfied, complain to the Data Protection Board of India.</>,
        ])}
        <p>To use any of these rights, email {mail}. We will respond within 30 days.</p>
      </>
    ),
  },
  {
    title: 'Children',
    body: (
      <p>
        Our services are meant for businesses and adults. We don't knowingly collect data from anyone under 18.
        If you believe a child has sent us their details, contact us and we will delete them.
      </p>
    ),
  },
  {
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy from time to time. The latest version will always be on this page,
        with the effective date at the top.
      </p>
    ),
  },
  {
    title: 'Contact us',
    body: (
      <p>
        {strong('DawnEmber')}<br />
        Coimbatore, Tamil Nadu, India<br />
        Email: {mail}<br />
        Phone: <a href="tel:+917200205455" style={{ color: '#E6C8AC' }}>+91 72002 05455</a>
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <section style={{ padding: `58px ${pad} 54px`, color: '#D4B99A', fontSize: 15, lineHeight: 1.75 }}>
      <style>{`
        .dn-privacy p { margin: 12px 0 0; }
        .dn-privacy li::marker { color: ${orange}; }
      `}</style>

      <Reveal style={{ maxWidth: 720 }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#C4A882', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <g filter="url(#deInk)">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </g>
          </svg>
          Back to home
        </a>
        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.26em', color: orange, textTransform: 'uppercase', marginTop: 34 }}>Your data, respected</div>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 'clamp(32px,3.5vw,42px)', lineHeight: 1.06, color: '#F8ECE0', margin: '16px 0 0', letterSpacing: '-0.02em' }}>
          Privacy{' '}
          <em style={{ fontFamily: "'Newsreader',serif", fontStyle: 'italic', fontWeight: 500, color: orange }}>policy.</em>
        </h1>
        <DrawLine color={orange} style={{ width: 60, margin: '18px 0 22px' }} />
        <p style={{ margin: 0, color: '#F8ECE0', fontSize: 15.5, lineHeight: 1.6 }}>
          DawnEmber respects your privacy. This policy explains what personal data we collect through{' '}
          dawnember.in, why we collect it, and the rights you have under India's Digital Personal Data
          Protection Act, 2023 and the DPDP Rules, 2025.
        </p>
        <div style={{ fontSize: 13, color: '#9A8468', marginTop: 12 }}>Effective date: {EFFECTIVE_DATE}</div>
      </Reveal>

      <div className="dn-privacy" style={{ maxWidth: 720, marginTop: 42, display: 'flex', flexDirection: 'column', gap: 34 }}>
        {sections.map(({ title, body }, i) => (
          <Reveal key={title}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 20, color: '#F8ECE0', margin: 0, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: "'Newsreader',serif", fontStyle: 'italic', fontWeight: 500, color: orange, fontSize: 22 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {title}
            </h2>
            {body}
          </Reveal>
        ))}
      </div>

      <Footer />
    </section>
  );
}
