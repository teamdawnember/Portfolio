import { useState } from 'react';
import { InkDivider, DrawLine } from '../common/TornPaperCard';
import { Reveal } from '../common/Reveal';
import coffeeImg from '../../assets/images/coffe 1.png';
import favicon2 from '../../assets/images/Favicon 2.svg';

const orange = '#AD4F2E';
const pad = 'clamp(28px,5cqw,60px)';

/* Steam — three soft motes rising from the cup's actual mouth (the
   illustration's own painted-in curl starts there), continuing that curl
   upward and forward along a real `offset-path` instead of restarting
   somewhere disconnected from the artwork. Growing/blurring as they thin
   out reads as one continuous drift rather than a repeating mechanical
   loop; each dot has its own curvature, duration and delay so the three
   never move in visible sync. */
const SteamRising = () => (
  <div style={{ position: 'absolute', left: '63%', top: '50%', width: 1, height: 1, pointerEvents: 'none' }}>
    <style>{`
      @keyframes dnDrift {
        0%   { offset-distance: 0%; opacity: 0; transform: scale(0.45); filter: blur(0px); }
        16%  { opacity: 0.55; }
        62%  { opacity: 0.3; }
        100% { offset-distance: 100%; opacity: 0; transform: scale(2); filter: blur(2.6px); }
      }
      .dn-wisp {
        position: absolute; top: 0; left: 0; width: 5px; height: 5px; border-radius: 50%;
        background: #F8ECE0; animation-name: dnDrift; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
      }
    `}</style>
    <div className="dn-wisp" style={{ offsetPath: "path('M0,0 C -3,-18 4,-34 -1,-52 C -5,-70 3,-84 -2,-102')", animationDuration: '5.2s', animationDelay: '0s' }} />
    <div className="dn-wisp" style={{ offsetPath: "path('M0,0 C 4,-16 -3,-32 3,-50 C 7,-68 -2,-82 4,-98')", animationDuration: '6s', animationDelay: '1.8s' }} />
    <div className="dn-wisp" style={{ offsetPath: "path('M0,0 C -2,-14 5,-30 -3,-48 C -7,-64 2,-78 -3,-94')", animationDuration: '4.6s', animationDelay: '3.2s' }} />
  </div>
);

/* Hand-drawn ornamental vertical divider — SVG instead of the raster PNG,
   which had blurred glow margins that got cropped/cut off at odd points.
   Lines flex to fill whatever height the row needs; the knot ornament in
   the middle stays fixed size, so it always fits perfectly, never crops.
   Only shown at desktop, where info/form sit side by side in the same
   row — at mobile/tablet widths they're never adjacent, so the divider
   wouldn't make sense there. */
const OrnamentalDivider = () => (
  <div className="dn-contact-divider" style={{ height: '100%', width: 40, opacity: 0.4, gridArea: 'divider', alignSelf: 'stretch' }}>
    {/* Short lead-in so the flourish sits near the top, not centered */}
    <div style={{ flex: '0 0 20px', width: 1.5, background: 'linear-gradient(180deg, transparent, rgba(230,200,172,0.7))', filter: 'url(#deInkV)' }} />
    {/* Single simple loop-knot, fully vector so it never blurs, crops,
        or misaligns at any height. */}
    <svg width="26" height="30" viewBox="0 0 26 30" style={{ flex: '0 0 auto' }}>
      <path
        d="M13 0 V11 C8 6 3 8 3 12 C3 16.5 9 16 13 11 C17 16 23 16.5 23 12 C23 8 18 6 13 11 V30"
        fill="none" stroke="#E6C8AC" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#deRough)"
      />
    </svg>
    <div style={{ flex: 1, minHeight: 12, width: 1.5, background: 'linear-gradient(0deg, transparent, rgba(230,200,172,0.7))', filter: 'url(#deInkV)' }} />
  </div>
);

const icons = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v14H4z" /><path d="M4 6l8 6 8-6" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2.18 2A17 17 0 0 1 3 5.18 2 2 0 0 1 5 4Z" />
    </svg>
  ),
  social: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </svg>
  ),
};

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M7.5 10v6.5M7.5 7.2v.1M12 16.5V13c0-1.4 1-2.5 2.3-2.5 1.3 0 2.2 1 2.2 2.5v3.5M12 10v6.5" />
    </svg>
  )},
  { name: 'Instagram', href: 'https://www.instagram.com', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17.2" cy="6.8" r="0.9" fill="#F8ECE0" stroke="none" />
    </svg>
  )},
  { name: 'Facebook', href: 'https://www.facebook.com', icon: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F8ECE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 21v-7h2.5l.5-3H14V9c0-1 .3-1.7 1.7-1.7H17V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8.5v3H11v7Z" />
    </svg>
  )},
];

const infoItems = [
  { icon: icons.mail,   label: 'Email us', lines: ['hello@dawnember.in'] },
  { icon: icons.phone,  label: 'Call us',  lines: ['+91 72002 05455'] },
];


const fieldStyle: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none',
  borderRadius: 10, padding: '14px 16px', fontSize: 14.5, color: '#F8ECE0',
  fontFamily: "'Hanken Grotesk',sans-serif", outline: 'none', position: 'relative', zIndex: 1,
};

/* Hand-drawn wobbly border — same deRough filter used for the badge/chip
   outlines elsewhere, so form fields read as sketched rather than
   machine-perfect rounded rects. */
const RoughField = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 10,
      border: '1.5px solid rgba(230,200,172,0.55)',
      filter: 'url(#deRough)', pointerEvents: 'none',
    }} />
    {children}
  </div>
);

// Base URL of the contact API. Empty by default → relative /api/contact, which
// works via the Vite dev proxy and when the API is served same-origin in prod.
// Set VITE_API_BASE only if the API lives on a different origin.
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  // `company` is a honeypot — hidden from users, only bots fill it.
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState<SendStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('sent');
        setForm({ name: '', phone: '', email: '', message: '', company: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please try again, or email us at hello@dawnember.in.');
    }
  };

  return (
    <>
      <section id="contact" style={{ padding: `58px ${pad} 54px` }}>
        {/* Five named grid areas (headerpara, info, divider, form, image)
            so the exact same DOM/flat structure can be rearranged per
            breakpoint via CSS alone: mobile puts the coffee art on top
            (matching the original design), then header copy, info, and
            form stacked below; tablet keeps header+form together on top
            with info/image paired below (fixes the cramped tablet-width
            layout without touching mobile or desktop); desktop restores
            the original side-by-side layout — header spanning the top of
            a 3-column text block (info | divider | form), image spanning
            the full height beside it. */}
        <div className="dn-contact-layout">
          <Reveal style={{ gridArea: 'headerpara' }}>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.26em', color: orange, textTransform: 'uppercase' }}>Let's brew something great,</div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 'clamp(32px,3.5vw,42px)', lineHeight: 1.06, color: '#F8ECE0', margin: '16px 0 0', letterSpacing: '-0.02em' }}>
              Let's talk{' '}
              <em style={{ fontFamily: "'Newsreader',serif", fontStyle: 'italic', fontWeight: 500, color: orange }}>over a filter.</em>
            </h2>
            <DrawLine color={orange} style={{ width: 60, margin: '18px 0 22px' }} />
            <p style={{ fontSize: 15.5, color: '#F8ECE0', maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
              Have a project in mind or just want to say hi?<br />
              Drop us a message. We'd love to hear from you.
            </p>
          </Reveal>

          {/* Contact info list */}
          <Reveal delay={0.08} style={{ position: 'relative', paddingLeft: 4, gridArea: 'info', alignSelf: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {infoItems.map(({ icon, label, lines }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
                  <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto', width: 44, height: 44, borderRadius: '50%', background: orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -8px rgba(173,79,46,0.7)' }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: '#F8ECE0' }}>{label}</div>
                    {lines.map(l => (
                      <div key={l} style={{ fontSize: 13.5, color: '#C4A882', lineHeight: 1.5 }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto', width: 44, height: 44, borderRadius: '50%', background: orange, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -8px rgba(173,79,46,0.7)' }}>
                  {icons.social}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: '#F8ECE0', marginBottom: 6 }}>Social</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {socialLinks.map(({ name, href, icon }) => (
                      <a key={name} href={href} target="_blank" rel="noopener" aria-label={name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 32, height: 32, borderRadius: '50%',
                        border: '1.5px solid rgba(230,200,172,0.35)', textDecoration: 'none',
                      }}>
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Ornamental vertical divider — desktop only */}
          <OrnamentalDivider />

          {/* Form — every field gets a hand-drawn wobbly border */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, gridArea: 'form' }}>
            {/* Honeypot — hidden from people; bots that fill it are dropped server-side. */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />
            <RoughField>
              <input
                type="text" placeholder="Your name" required
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={fieldStyle}
              />
            </RoughField>
            <RoughField>
              <input
                type="tel" placeholder="Mobile number" required
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={fieldStyle}
              />
            </RoughField>
            <RoughField>
              <input
                type="email" placeholder="Email address" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={fieldStyle}
              />
            </RoughField>
            <RoughField>
              <textarea
                placeholder="How can we help?" required rows={3}
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...fieldStyle, resize: 'vertical', minHeight: 84, fontFamily: "'Hanken Grotesk',sans-serif", display: 'block' }}
              />
            </RoughField>

            {/* Rough hand-painted pill — double outline like a sketched button */}
            <button type="submit" disabled={status === 'sending'} style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: orange, color: '#fff', fontWeight: 600, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '15px 26px', borderRadius: 999, boxShadow: '0 14px 30px -10px rgba(173,79,46,0.7)',
              border: 'none', cursor: status === 'sending' ? 'default' : 'pointer', marginTop: 4,
              opacity: status === 'sending' ? 0.75 : 1, transition: 'opacity .2s ease',
            }}>
              <span style={{
                position: 'absolute', inset: -4, borderRadius: 999,
                border: '1.5px solid rgba(230,200,172,0.55)',
                filter: 'url(#deRough)', pointerEvents: 'none',
              }} />
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent' : 'Send message'}
              {/* Same hand-drawn deInk stroke used for the hero CTA's
                  down-chevron, so every arrow on the site reads sketched
                  rather than a clean vector line. */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                {/* Filter on the <g>, not the shapes: the horizontal shaft
                    <line> alone has a zero-height bbox, which makes the
                    objectBoundingBox filter region degenerate and hides it. */}
                <g filter="url(#deInk)">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </g>
              </svg>
            </button>

            {/* Live send status — polite so screen readers announce it. */}
            <div aria-live="polite" style={{ minHeight: 20 }}>
              {status === 'sent' && (
                <span style={{ fontSize: 13.5, color: '#8FBF8A' }}>
                  Thanks — your message is on its way. We'll be in touch soon.
                </span>
              )}
              {status === 'error' && (
                <span style={{ fontSize: 13.5, color: '#E08A6E' }}>{errorMsg}</span>
              )}
            </div>
          </form>

          {/* Coffee art */}
          {/* alignSelf:stretch (overriding the grid's own top-alignment)
              makes this cell match the height of the tallest sibling in its
              row (the form on desktop) — the image then fills that full
              height via objectFit:cover, so it ends flush at the bottom
              instead of sizing to its own aspect ratio and leaving a gap. */}
          <Reveal delay={0.16} style={{ position: 'relative', display: 'flex', justifyContent: 'center', gridArea: 'image', alignSelf: 'stretch' }}>
            <div style={{ position: 'absolute', inset: '6% 4%', background: 'radial-gradient(58% 52% at 54% 40%, rgba(173,79,46,0.25), rgba(173,79,46,0.06) 55%, transparent 72%)', pointerEvents: 'none' }} />
            {/* aspect-ratio is the fallback for rows where this is the only
                item (mobile: alone in its own row; tablet: paired with a
                short info list) — height:100% only resolves to something
                real once a taller sibling (the form, on desktop) actually
                defines the row's height; otherwise the aspect-ratio takes
                over so the box never collapses to 0. */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 470, height: '100%', aspectRatio: '4 / 5' }}>
              <img src={coffeeImg} alt="Filter coffee by the window" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: 12 }} />
              <SteamRising />
            </div>
          </Reveal>
        </div>

        {/* Footer bar */}
        <div style={{ marginTop: 46, paddingTop: 30, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <InkDivider style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={favicon2} alt="" style={{ width: 26, height: 26, objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: '#F8ECE0' }}>DawnEmber</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#9A8468', letterSpacing: '0.04em' }}>
            Made with <span style={{ color: orange }}>&#9829;</span> by Anbu &amp; Aswin &nbsp;·&nbsp; © 2025 Dawn Ember
          </div>
        </div>
      </section>
    </>
  );
}
