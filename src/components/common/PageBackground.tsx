import { useEffect, useRef, useState } from 'react';
import kolamTan from '../../assets/images/kolam-tan.png';
import kolamOrange from '../../assets/images/kolam-orange.png';

const TAN = '#E6C8AC';
const ORANGE = '#AD4F2E';
const F = "'Noto Sans Tamil', sans-serif";

/* Exact port of the Dawn Ember design file's background gutters — letters,
   kolams and dots, with their original positions/depths/sizes/opacities.
   Legacy design colors (#c1542e / #c7a982) mapped 1:1 to the current
   brand palette (orange / tan). */
type Item = {
  type: 'letter' | 'kolam' | 'dot';
  char?: string; src?: string;
  size: number; opacity: number;
  top: string; left?: string; right?: string;
  depth: number;
  side: 'left' | 'right';
};

/* Kolam placements alternate inner/outer within their gutter as they step
   down the page (up-left, down-right, up-left, down-right, …) so
   consecutive motifs never stack on the same vertical line, keeping them
   clear of each other even at the slightly larger size. */
const left: Item[] = [
  { type: 'letter', char: 'ழ', size: 120, opacity: 0.32, top: '3%', left: '14%', depth: 0.10, side: 'left' },
  { type: 'letter', char: 'ஃ', size: 34, opacity: 0.42, top: '11%', left: '58%', depth: -0.12, side: 'left' },
  { type: 'kolam', src: kolamTan, size: 56, opacity: 0.45, top: '19%', left: '8%', depth: 0.22, side: 'left' },
  { type: 'kolam', src: kolamOrange, size: 76, opacity: 0.5, top: '31%', left: '46%', depth: 0.26, side: 'left' },
  { type: 'letter', char: 'க', size: 46, opacity: 0.4, top: '42%', left: '50%', depth: -0.16, side: 'left' },
  { type: 'kolam', src: kolamOrange, size: 60, opacity: 0.4, top: '53%', left: '10%', depth: 0.15, side: 'left' },
  { type: 'letter', char: 'அ', size: 104, opacity: 0.28, top: '60%', left: '16%', depth: 0.12, side: 'left' },
  { type: 'dot', size: 6, opacity: 0.5, top: '72%', left: '56%', depth: -0.2, side: 'left' },
  { type: 'kolam', src: kolamTan, size: 68, opacity: 0.5, top: '81%', left: '44%', depth: 0.30, side: 'left' },
  { type: 'letter', char: 'ண', size: 44, opacity: 0.4, top: '90%', left: '14%', depth: -0.14, side: 'left' },
  { type: 'dot', size: 7, opacity: 0.45, top: '95%', left: '52%', depth: 0.20, side: 'left' },
];

const right: Item[] = [
  { type: 'letter', char: 'இ', size: 112, opacity: 0.3, top: '4%', right: '16%', depth: -0.14, side: 'right' },
  { type: 'kolam', src: kolamTan, size: 52, opacity: 0.42, top: '12%', right: '8%', depth: 0.18, side: 'right' },
  { type: 'kolam', src: kolamOrange, size: 72, opacity: 0.45, top: '25%', right: '46%', depth: 0.16, side: 'right' },
  { type: 'letter', char: 'ய', size: 42, opacity: 0.42, top: '36%', right: '48%', depth: -0.26, side: 'right' },
  { type: 'letter', char: 'ஃ', size: 100, opacity: 0.28, top: '46%', right: '20%', depth: 0.12, side: 'right' },
  { type: 'kolam', src: kolamOrange, size: 60, opacity: 0.4, top: '58%', right: '10%', depth: 0.24, side: 'right' },
  { type: 'kolam', src: kolamOrange, size: 66, opacity: 0.45, top: '68%', right: '44%', depth: 0.28, side: 'right' },
  { type: 'letter', char: 'ண', size: 42, opacity: 0.4, top: '80%', right: '46%', depth: -0.14, side: 'right' },
  { type: 'letter', char: 'ழ', size: 96, opacity: 0.26, top: '88%', right: '18%', depth: 0.1, side: 'right' },
  { type: 'dot', size: 6, opacity: 0.45, top: '10%', right: '10%', depth: -0.18, side: 'right' },
  { type: 'dot', size: 7, opacity: 0.5, top: '73%', right: '62%', depth: 0.2, side: 'right' },
];

const items = [...left, ...right];

/* Reference gutter width the original sizes were designed against (the
   old clamp's desktop ceiling). Converting each item's fixed px size into
   a clamped `cqw` (container-query-width) value — measured against the
   gutter's own actual rendered width, via `containerType:'inline-size'`
   below — makes every letter/kolam scale down proportionally on narrow
   screens instead of staying pinned at its full desktop size, which is
   what made them read as oversized/clipped/invisible on mobile. */
const REF_WIDTH = 260;
const responsiveSize = (px: number) => `clamp(${(px * 0.42).toFixed(0)}px, ${(px / REF_WIDTH * 100).toFixed(1)}cqw, ${px}px)`;

export default function PageBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    /* Tamil glyphs render as blank tofu boxes in fallback fonts — wait for
       the actual Noto Sans Tamil webfont before showing letters, to avoid
       giant blank shapes flashing on the cream background before it loads. */
    document.fonts.load(`210px "Noto Sans Tamil"`)
      .then(() => setFontReady(true))
      .catch(() => setFontReady(true));
  }, []);

  useEffect(() => {
    let ticking = false;
    const apply = () => {
      const y = window.scrollY || 0;
      containerRef.current?.querySelectorAll<HTMLElement>('[data-depth]').forEach(el => {
        const d = parseFloat(el.getAttribute('data-depth') || '0');
        el.style.transform = `translate3d(0, ${(y * d).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes dawnShake {
          0%,100%{ transform:translate(0,0) rotate(0deg); }
          20%{ transform:translate(-3px,2px) rotate(-8deg); }
          40%{ transform:translate(3px,-2px) rotate(7deg); }
          60%{ transform:translate(-2px,3px) rotate(-6deg); }
          80%{ transform:translate(2px,-1px) rotate(5deg); }
        }
        @keyframes dawnSpin { to { transform: rotate(360deg); } }
        .bg-letter:hover { color: #AD4F2E !important; opacity: 1 !important; animation: dawnShake 0.45s ease-in-out infinite; }
        .bg-kolam:hover { animation: dawnSpin 3s linear infinite; }
      `}</style>

      {/* top offset (not inset:0) so the gutter's 0%-100% coordinate space
          starts at the card's own top edge, not the true viewport top —
          the brand mark sits in a cream strip above the card, and letters
          positioned near top:0% would otherwise land there instead of over
          the dark card, where the tan color is nearly invisible against
          the near-identical cream background. */}
      <div ref={containerRef} aria-hidden="true" style={{
        position: 'fixed', top: 'clamp(130px,20vw,172px)', left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {(['left', 'right'] as const).map(side => (
          <div key={side} className={`dn-bg-gutter dn-bg-gutter-${side}`} style={{
            position: 'absolute', top: 0, [side]: 0,
            /* Track the card's own centering formula (82vw, capped at
               1140px, per TornPaperCard) instead of a fixed vw clamp — a
               fixed clamp doesn't shrink at the same rate as the card's
               actual cream margin, so on some widths the gutter undershot
               the margin (leaving letters stranded in the low-contrast
               cream zone) and on others it overshot into content. This
               keeps the gutter's outer edge glued to the true margin width
               at every breakpoint, plus a fixed overlap into the card. */
            width: 'calc(max(9vw, (100vw - 1140px) / 2) + 44px)',
            height: '100%', containerType: 'inline-size',
            fontFamily: F, color: TAN, textAlign: side === 'right' ? 'right' : 'left',
          }}>
            {items.filter(item => item.side === side).map((item, i) => {
              const pos: React.CSSProperties = {
                position: 'absolute',
                top: item.top,
                left: item.left,
                right: item.right,
              };
              /* Parallax lives on the OUTER wrapper (data-depth → inline
                 translate3d), the hover shake/spin animation on the INNER
                 element. Keeping them on separate elements stops the running
                 CSS animation from overriding the inline parallax transform
                 (which made hovered motifs jump to translate(0)). */
              if (item.type === 'letter') {
                if (!fontReady) return null;
                return (
                  <span key={i} data-depth={item.depth} style={{ ...pos, willChange: 'transform' }}>
                    <span
                      className="bg-letter"
                      style={{
                        display: 'inline-block',
                        fontSize: responsiveSize(item.size),
                        lineHeight: 1,
                        opacity: item.opacity,
                        userSelect: 'none',
                        pointerEvents: 'auto',
                        cursor: 'default',
                      }}
                    >{item.char}</span>
                  </span>
                );
              }
              if (item.type === 'kolam') {
                return (
                  <div key={i} data-depth={item.depth} style={{ ...pos, willChange: 'transform' }}>
                    <div
                      className="bg-kolam"
                      style={{ transformOrigin: '50% 50%', pointerEvents: 'auto', cursor: 'default' }}
                    >
                      <img src={item.src} alt="" style={{ width: responsiveSize(item.size), height: responsiveSize(item.size), objectFit: 'contain', opacity: item.opacity, display: 'block' }} />
                    </div>
                  </div>
                );
              }
              return (
                <span
                  key={i}
                  data-depth={item.depth}
                  style={{
                    ...pos,
                    display: 'inline-block', width: responsiveSize(item.size), height: responsiveSize(item.size), borderRadius: '50%',
                    background: ORANGE, opacity: item.opacity, willChange: 'transform',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
