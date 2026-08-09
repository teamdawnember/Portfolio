import anbu from '../../assets/images/Anbu 2.png';
import aswin from '../../assets/images/Aswin 2.png';
import kolam1 from '../../assets/images/Kolam 1.png';
import kolam2 from '../../assets/images/Kolam 2.png';
import { Reveal } from '../common/Reveal';
import { DrawLine } from '../common/TornPaperCard';


const orange = '#AD4F2E';
const pad = 'clamp(28px,5cqw,60px)';

const kolamOrange = (size: number) => (
  <img src={kolam1} alt="" style={{ width: size, height: size, objectFit: 'contain', opacity: 0.5, filter: 'sepia(1) saturate(3) hue-rotate(-15deg) brightness(0.75)', display: 'block' }} />
);

const Chip = ({ label }: { label: string }) => (
  <span style={{ position: 'relative', display: 'inline-block', fontSize: 12, fontWeight: 600, color: '#D4B99A', background: 'rgba(230,200,172,0.12)', borderRadius: 999, padding: '6px 12px' }}>
    <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1.5px solid rgba(230,200,172,0.34)', filter: 'url(#deRough)', pointerEvents: 'none' }} />
    {label}
  </span>
);

/* Index marks — kolam-lattice motifs (the diamond-knot pattern used
   throughout the site's Tamil-inspired ornamentation) standing in for
   plain "01"/"02" numerals, one loop for the first row, two interlocked
   for the second. */
const kolamIndexOne = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke={orange} strokeWidth="1.4" strokeLinejoin="round">
    <path d="M15 3 L23 15 L15 27 L7 15 Z" />
    <circle cx="15" cy="15" r="4.2" />
    <circle cx="15" cy="3" r="1.4" fill={orange} stroke="none" />
    <circle cx="15" cy="27" r="1.4" fill={orange} stroke="none" />
    <circle cx="7" cy="15" r="1.4" fill={orange} stroke="none" />
    <circle cx="23" cy="15" r="1.4" fill={orange} stroke="none" />
  </svg>
);
const kolamIndexTwo = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke={orange} strokeWidth="1.4" strokeLinejoin="round">
    <path d="M10 3 L18 11 L10 19 L2 11 Z" />
    <path d="M20 11 L28 19 L20 27 L12 19 Z" />
    <circle cx="10" cy="11" r="2" />
    <circle cx="20" cy="19" r="2" />
  </svg>
);

interface PersonRowProps {
  indexMark: React.ReactNode; img: string; imgPos: string;
  name: string; role: string; tagline: string;
  skills: string[];
  kolam: React.ReactNode; flip: boolean;
}

function PersonRow({ indexMark, img, imgPos, name, role, tagline, skills, kolam, flip }: PersonRowProps) {
  const portrait = (
    <div key="portrait" className="dn-person-portrait" style={{ position: 'relative', overflow: 'hidden' }}>
      <img src={img} alt={name} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: imgPos,
        /* These portraits shipped as opaque RGB (no alpha channel) with a
           true-black fill around the halftone cutout, which read as a flat,
           ungrained rectangle against the card's noisy grain/mottle texture.
           mix-blend-mode:screen was tried here first, but it silently fails
           whenever an ancestor gets isolated into its own stacking context
           (e.g. Reveal's opacity-transition wrapper) — the blend then only
           sees its own isolated (empty) backdrop instead of the real card
           texture behind it, so the black reappears solid. Fixed at the
           asset level instead: the PNG was reprocessed so near-black pixels
           are genuinely transparent (alpha channel), which works regardless
           of any ancestor's stacking context. */
        /* Soft fade at the bottom edge so the halftone crop dissolves into
           the card instead of ending on a hard, abrupt line. */
        WebkitMaskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
      }} />
      <div style={{ position: 'absolute', right: 18, bottom: 20, opacity: 0.88 }}>{kolam}</div>
    </div>
  );

  const details = (
    <div key="details" style={{ padding: '36px clamp(24px,4cqw,42px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Index mark paired with a rule, anchoring it to the name the same
          way the numbered accents read elsewhere on the site (Work, etc.) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, flex: '0 0 auto' }}>{indexMark}</div>
        <DrawLine color={orange} height={1.5} style={{ flex: 1 }} />
      </div>
      <div style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 44, lineHeight: 1, color: '#E6C8AC' }}>{name}</div>
      <div style={{ fontFamily: "'Newsreader',serif", fontStyle: 'italic', fontSize: 20, color: orange, marginTop: 8 }}>{role}</div>
      <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#D4B99A', maxWidth: 340, margin: '16px 0 20px' }}>{tagline}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map(s => <Chip key={s} label={s} />)}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <div className={`dn-person-grid${flip ? ' flip' : ''}`}>
        {flip ? [details, portrait] : [portrait, details]}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" style={{ padding: `44px ${pad} 48px` }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 34 }}>
        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.26em', color: orange, textTransform: 'uppercase' }}>About us</div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 34, color: '#F8ECE0', margin: '14px 0 0', letterSpacing: '-0.01em' }}>
          The minds behind dawnember.
        </h2>
        <p style={{ fontSize: 15.5, color: '#C4A882', maxWidth: 440, margin: '14px auto 0', lineHeight: 1.65 }}>
          A two-person team blending design and development to create fun, functional, and user-friendly digital experiences.
        </p>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4cqw,44px)' }}>
        <Reveal>
          <PersonRow
            indexMark={kolamIndexOne} img={anbu} imgPos="50% 16%"
            name="Anbu" role="Designer"
            tagline="Crafting pixel-perfect designs that tell stories and evoke emotion. From concept to completion, every detail matters."
            skills={['Figma', 'Framer', 'Web Design', 'UI/UX Design']}
            kolam={kolamOrange(104)}
            flip={false}
          />
        </Reveal>
        <Reveal>
          <PersonRow
            indexMark={kolamIndexTwo} img={aswin} imgPos="50% 18%"
            name="Aswin" role="Full Stack Developer"
            tagline="Building robust, scalable solutions that bring designs to life. Clean code, seamless functionality, and optimized performance."
            skills={['React', 'Node JS', 'Express JS', 'Mongo DB']}
            kolam={<img src={kolam2} alt="" style={{ width: 108, height: 108, objectFit: 'contain', opacity: 0.5, filter: 'sepia(1) saturate(3) hue-rotate(-15deg) brightness(0.75)', display: 'block' }} />}
            flip={true}
          />
        </Reveal>
      </div>
    </section>
  );
}
