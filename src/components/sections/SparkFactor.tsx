import { useEffect, useRef, useState } from 'react';
import kolam1 from '../../assets/images/Kolam 1.png';
import kolam2 from '../../assets/images/Kolam 2.png';
import kolam3 from '../../assets/images/Kolam 3.png';
import kolam4 from '../../assets/images/Kolam 4.png';
import { Reveal } from '../common/Reveal';
import { InkDivider } from '../common/TornPaperCard';

const orange = '#AD4F2E';
const cream = '#F8ECE0';
const tan = '#E6C8AC';
const pad = 'clamp(28px,5cqw,60px)';

/* A modern designer's notebook, not a photorealistic manuscript — flat,
   line-drawn, generous whitespace. Every "page" is identical in structure:
   a headline, a handwritten aphorism, a small floret, one line-drawn
   illustration, and a tiny kolam tucked in the corner. */
const pages = [
  {
    icon: 'bean', title: 'Idea',
    quote: 'An idea, like a bean, waits quietly to be found.',
    body: 'We listen, understand and dive deep into the problem you want to solve.',
    kolam: kolam1,
  },
  {
    icon: 'flame', title: 'Roast',
    quote: 'Heat reveals what raw cannot.',
    body: 'Research, strategy and insight roast the idea to perfection.',
    kolam: kolam2,
  },
  {
    icon: 'grind', title: 'Grind',
    quote: 'Break it down to see it whole.',
    body: 'User journeys, wireframes and flows give shape to the experience.',
    kolam: kolam3,
  },
  {
    icon: 'drop', title: 'Brew',
    quote: 'Patience turns water into wonder.',
    body: 'We craft clean, intuitive and beautiful interfaces that users love.',
    kolam: kolam4,
  },
  {
    icon: 'code', title: 'Perfection',
    quote: 'The details are the difference.',
    body: 'We build robust, scalable and high-performing digital products.',
    kolam: kolam1,
  },
  {
    icon: 'cup', title: 'Share',
    quote: 'A good cup is meant to be poured for others.',
    body: "We launch, support and grow with you as partners in your journey.",
    kolam: kolam2,
  },
];

/* Single-stroke, line-drawn illustrations — no fills, no blob backdrops. */
const PageIllustration = ({ type }: { type: string }) => {
  const p = { fill: 'none', stroke: tan, strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const svgs: Record<string, React.ReactNode> = {
    bean: <svg width="48" height="48" viewBox="0 0 24 24" {...p}><path d="M12 3c4.5 1 8 5 8 9s-3.5 8-8 8-8-4-8-8 3.5-8 8-9Z" /><path d="M9 18c1-3 1-9 6-11" /></svg>,
    flame: <svg width="48" height="48" viewBox="0 0 24 24" {...p}><path d="M12 2c1 3-2 4-2 7a3 3 0 1 0 6 0c0-1-.5-1.8-1-2.5 2 1 3.5 3.5 3.5 6a6.5 6.5 0 1 1-13 0C5.5 8 8 5 12 2Z" /></svg>,
    grind: <svg width="48" height="48" viewBox="0 0 24 24" fill={tan} stroke="none"><circle cx="7" cy="8" r="1.3" /><circle cx="12" cy="6" r="1.3" /><circle cx="17" cy="8" r="1.3" /><circle cx="6" cy="13" r="1.3" /><circle cx="11" cy="12" r="1.3" /><circle cx="16" cy="13" r="1.3" /><circle cx="8" cy="17" r="1.3" /><circle cx="14" cy="17" r="1.3" /></svg>,
    drop: <svg width="48" height="48" viewBox="0 0 24 24" {...p}><path d="M12 3c3 4 6.5 8.2 6.5 12A6.5 6.5 0 0 1 5.5 15C5.5 11.2 9 7 12 3Z" /></svg>,
    code: <svg width="48" height="48" viewBox="0 0 24 24" {...p}><polyline points="8 7 3 12 8 17" /><polyline points="16 7 21 12 16 17" /></svg>,
    cup: <svg width="48" height="48" viewBox="0 0 24 24" {...p}><path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" /><path d="M16 9.5h1.5a2 2 0 0 1 0 4H16" /><path d="M8 3.5c0 1-1 1-1 2M11.5 3.5c0 1-1 1-1 2" /></svg>,
  };
  return svgs[type] ?? null;
};

/* Small decorative floret standing in for the "☙" divider mark. */
const Floret = () => (
  <svg width="18" height="13" viewBox="0 0 20 14" style={{ display: 'block' }}>
    <g fill="none" stroke={orange} strokeWidth="1.1" opacity="0.75">
      <path d="M10 1v12" />
      <path d="M10 7C10 4 7 3 5 4.5S4 9 7 8.5C8.5 8.2 10 7 10 7Z" />
      <path d="M10 7c0-3 3-4 5-2.5S16 9 13 8.5C11.5 8.2 10 7 10 7Z" />
    </g>
  </svg>
);

/* Scrollytelling accordion — inspired by netcraft.solutions/services: a
   stack of numbered rows, each a thin title bar until the page scrolls it
   near the vertical centre of the viewport, at which point it expands to
   reveal its quote/illustration/body. Only one row is "active" (expanded)
   at a time. Driven entirely by IntersectionObserver against a thin band
   around the viewport centre — no manual scroll-position math, no
   position:sticky, nothing that can race against layout — so it's far
   more robust than the earlier pinned horizontal track. */
function NotebookRow({ idx, page, active, onActivate }: {
  idx: number; page: typeof pages[number]; active: boolean; onActivate: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onActivate(); },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <div
        /* Activate immediately for feedback, then scroll this row to the
           viewport centre so the IntersectionObserver's centre band agrees
           with the click — otherwise the observer would re-fire on the
           click-induced layout shift and snap active back to whatever row
           is currently centred. */
        onClick={() => { onActivate(); ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
        style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px clamp(16px,4vw,32px)', cursor: 'pointer' }}
      >
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: active ? orange : '#8A7360', flex: '0 0 auto', width: 20 }}>
          {String(idx + 1).padStart(2, '0')}
        </span>
        <h3 style={{
          fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 'clamp(20px,3.2vw,28px)', margin: 0,
          color: active ? cream : '#9A8468', transition: 'color .35s ease', flex: '1 1 auto',
        }}>
          {page.title}
        </h3>
        <Floret />
      </div>

      {/* Modern CSS grid accordion trick: animating grid-template-rows
          between 0fr/1fr smoothly animates height without ever needing a
          measured pixel value. */}
      <div style={{ display: 'grid', gridTemplateRows: active ? '1fr' : '0fr', transition: 'grid-template-rows .5s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24,
            padding: `4px clamp(16px,4vw,32px) 30px ${52 + 18}px`,
          }}>
            <div style={{ flex: '1 1 220px', position: 'relative' }}>
              <p style={{ fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 21, color: tan, margin: 0, lineHeight: 1.3 }}>
                &ldquo;{page.quote}&rdquo;
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#C4A882', maxWidth: 320, margin: '12px 0 0' }}>
                {page.body}
              </p>
            </div>
            <div style={{ position: 'relative', flex: '0 0 auto', width: 48, height: 48 }}>
              <PageIllustration type={page.icon} />
              <img src={page.kolam} alt="" style={{
                position: 'absolute', top: -10, right: -18, width: 22, height: 22,
                objectFit: 'contain', opacity: 0.3,
                filter: 'sepia(1) saturate(3) hue-rotate(-15deg) brightness(0.75)',
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SparkFactor() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section style={{ padding: '44px 0 20px' }}>
      <Reveal style={{ textAlign: 'center', maxWidth: 520, margin: `0 auto 8px`, padding: `0 ${pad}` }}>
        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.26em', color: orange, textTransform: 'uppercase' }}>How we brew it</div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 'clamp(24px,3vw,32px)', color: cream, margin: '10px 0 0', letterSpacing: '-0.01em' }}>
          Six pages from the studio notebook.
        </h2>
      </Reveal>

      <div style={{ marginTop: 30 }}>
        <InkDivider style={{ margin: `0 ${pad}` }} />
        {pages.map((page, i) => (
          <div key={page.title}>
            <NotebookRow idx={i} page={page} active={activeIdx === i} onActivate={() => setActiveIdx(i)} />
            <InkDivider style={{ margin: `0 ${pad}` }} />
          </div>
        ))}
      </div>
    </section>
  );
}
