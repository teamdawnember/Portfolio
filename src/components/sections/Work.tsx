import { Reveal } from '../common/Reveal';

const orange = '#AD4F2E';
const pad = 'clamp(28px,5cqw,60px)';

/* Hand-drawn wobbly frame around the screenshot — same double-stroke
   deRough treatment used for the contact form's RoughField inputs, so the
   work showcase reads as sketched rather than a generic device mockup.
   objectFit:cover + fixed aspect-ratio makes ANY screenshot fill the frame
   with no gaps, regardless of its native aspect ratio: wide heroes
   center-crop, tall full-page captures show their top viewport.
   objectPosition defaults to 'top' but can be overridden per project. */
const LaptopMock = ({ src, alt, objectPosition = 'top', fillWidth = false }: { src: string; alt: string; objectPosition?: string; fillWidth?: boolean }) => (
  <div style={{ position: 'relative', width: '100%', maxWidth: fillWidth ? '100%' : 420 }}>
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.55)' }}>
      <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition }} />
      </div>
    </div>
    {/* Outer wobbly stroke, tan */}
    <div style={{
      position: 'absolute', inset: -7, borderRadius: 16,
      border: '2px solid rgba(230,200,172,0.7)',
      filter: 'url(#deRough)', pointerEvents: 'none',
    }} />
    {/* Inner wobbly stroke, orange, tighter to the image */}
    <div style={{
      position: 'absolute', inset: -2, borderRadius: 13,
      border: '1.5px solid rgba(173,79,46,0.6)',
      filter: 'url(#deRough)', pointerEvents: 'none',
    }} />
  </div>
);

/* Loose organic blob behind each laptop — hand-drawn feel via a wobbly
   closed SVG path, softly filled and blurred at the edge. */
const Blob = () => (
  <svg viewBox="0 0 500 460" style={{ position: 'absolute', inset: '-8% -10%', width: '118%', height: '118%', zIndex: 0 }}>
    <path
      fill={orange} opacity="0.16"
      d="M154 46C221 8 314 4 375 52C436 100 460 187 441 256C422 325 361 376 291 402C221 428 133 429 82 383C31 337 18 245 40 174C62 103 87 84 154 46Z"
    />
  </svg>
);

const LeafSprig = ({ flip = false }: { flip?: boolean }) => (
  <svg width="70" height="90" viewBox="0 0 70 90" style={{ position: 'absolute', bottom: '4%', [flip ? 'left' : 'right']: '2%', opacity: 0.5, transform: flip ? 'scaleX(-1)' : undefined }}>
    <g fill="none" stroke={orange} strokeWidth="1.2" strokeLinecap="round">
      <path d="M35 88 C35 60 30 40 10 20" />
      <ellipse cx="20" cy="32" rx="10" ry="4.5" transform="rotate(-35 20 32)" />
      <ellipse cx="14" cy="46" rx="9" ry="4" transform="rotate(-40 14 46)" />
      <ellipse cx="24" cy="18" rx="8" ry="3.6" transform="rotate(-30 24 18)" />
    </g>
  </svg>
);

interface Project {
  name: string; category: string;
  description: string; deliverables: string; shot: string;
  href?: string; // live project URL; falls back to the contact section if unset
  objectPosition?: string;
  fillWidth?: boolean;
}

interface ProjectRowProps extends Project { flip?: boolean; }

function ProjectRow({ name, category, description, deliverables, shot, href, flip, objectPosition, fillWidth }: ProjectRowProps) {
  const media = (
    <div key="media" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '30px 10px' }}>
      <Blob />
      <LeafSprig flip={flip} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <LaptopMock src={shot} alt={name} objectPosition={objectPosition} fillWidth={fillWidth} />
      </div>
    </div>
  );

  const copy = (
    <div key="copy" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '10px clamp(4px,2cqw,28px)' }}>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 30, color: '#F8ECE0', margin: 0 }}>{name}</h3>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: orange, marginTop: 2 }}>{category}</div>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#D4B99A', maxWidth: 360, margin: '16px 0 0' }}>{description}</p>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: orange, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What we did</div>
        <div style={{ fontSize: 14.5, color: '#C4A882', marginTop: 6 }}>{deliverables}</div>
      </div>
      <a
        href={href || '#contact'}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#F8ECE0', fontWeight: 600, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 26 }}
      >
        View project
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={orange} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Filter on the <g>, not the individual shapes: the horizontal
              shaft <line> alone has a zero-height bbox, which makes an
              objectBoundingBox filter region degenerate and hides it. The
              group's bbox includes the arrowhead, so it's non-degenerate. */}
          <g filter="url(#deInk)">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </g>
        </svg>
      </a>
    </div>
  );

  return (
    <div className={`dn-work-grid${flip ? ' flip' : ''}`}>
      {flip ? [copy, media] : [media, copy]}
    </div>
  );
}

/* ─── Projects ──────────────────────────────────────────────────────────
   To add a new project, append one entry here. The alternating left/right
   layout, the divider between rows, and the perfect-fit laptop mock are
   all applied automatically.
   Optional `objectPosition` (default 'top') fine-tunes the screenshot crop. */
const projects: Project[] = [
  {
    name: 'Dr. K. V. Anbazhagan',
    category: 'Legacy Website',
    href: 'https://drkva.com/',
    description: 'A tribute website celebrating 70 years of Dr. K. V. Anbazhagan, a life of healing, love, and service.',
    deliverables: 'Web Design, Development',
    shot: 'https://pub-ebe4b471ad7b4bf8b2fd0a3a59474634.r2.dev/Website/Dr.%20Anbazhagan%20Website%20Desktop.png',
  },
  {
    name: 'SGE Air Compressors',
    category: 'Industrial Website',
    href: 'https://sg-virid-ten.vercel.app/',
    description: 'A decade of building compressors out of Coimbatore, a catalogue-driven site for an industrial manufacturer.',
    deliverables: 'Web Design, Development, SEO',
    shot: 'https://pub-ebe4b471ad7b4bf8b2fd0a3a59474634.r2.dev/Website/SGE%20Website%20Desktop.png',
    fillWidth: true,
  },
];

export default function Work() {
  return (
    <section id="work" style={{ padding: `30px ${pad} 44px` }}>
      <Reveal style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.26em', color: orange, textTransform: 'uppercase' }}>Our work</div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,38px)', color: '#F8ECE0', margin: '14px 0 0', letterSpacing: '-0.01em' }}>
          Stories woven into the{' '}
          <em style={{ fontFamily: "'Newsreader',serif", fontStyle: 'italic', fontWeight: 500, color: orange }}>kolam.</em>
        </h2>
        <p style={{ fontSize: 15.5, color: '#D4B99A', maxWidth: 420, margin: '14px auto 0', lineHeight: 1.65 }}>
          A few of the journeys we've been part of and the impact we've created together.
        </p>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginTop: 34 }}>
        {projects.map((project, i) => (
          <Reveal key={project.name}>
            <ProjectRow flip={i % 2 === 1} {...project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
