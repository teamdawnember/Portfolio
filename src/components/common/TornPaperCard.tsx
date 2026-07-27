import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Draws itself in when scrolled into view, and un-draws again when scrolled
   back past it (up or down) — unlike the rest of the site's one-shot
   reveals, this one re-triggers both ways, so it plays again if you scroll
   back to it. Earlier version used an SVG `stroke-dasharray`/
   `stroke-dashoffset` line stretched via `preserveAspectRatio="none"` —
   combined with `vector-effect:non-scaling-stroke` that mixes CSS-pixel
   dash values with a non-uniformly scaled viewBox coordinate space, which
   several browsers get wrong (the dash pattern silently never resolves, so
   the line just never appears). This version instead scales a plain div
   from 0 to full width (`transform: scaleX`, `transform-origin: left`) —
   no SVG coordinate spaces involved, so it can't misfire the same way —
   while keeping the `deInk` filter on the div itself for the same
   hand-drawn wobble. */
export const DrawLine = ({ color = 'rgba(230,200,172,0.55)', height = 3, style, className }: {
  color?: string; height?: number; style?: React.CSSProperties; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ height, ...style }}>
      <div style={{
        height: '100%', borderRadius: height / 2, background: color,
        filter: 'url(#deInk)', transformOrigin: 'left center',
        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 1.1s cubic-bezier(.22,1,.36,1)',
      }} />
    </div>
  );
};

export const InkDivider = ({ style }: { style?: React.CSSProperties }) => (
  <DrawLine style={style} />
);

export const InkDividerV = ({ style }: { style?: React.CSSProperties }) => (
  <div style={{
    position: 'absolute', top: '16%', bottom: '16%', right: 0, width: 3, borderRadius: 2,
    background: 'linear-gradient(180deg,transparent,rgba(230,200,172,0.5) 10%,rgba(230,200,172,0.45) 90%,transparent)',
    filter: 'url(#deInkV)',
    ...style,
  }} />
);

export const RoughBorder = ({ radius = 14 }: { radius?: number }) => (
  <div style={{
    position: 'absolute', inset: 0, borderRadius: radius,
    border: '1.5px solid rgba(230,200,172,0.28)',
    filter: 'url(#deRough)', pointerEvents: 'none',
  }} />
);

const C = '#F8ECE0';

/* Cream overlay approach:
   A cream-coloured rect sits just OUTSIDE each card edge.
   The deTorn filter displaces it — cream pixels that land on the dark card
   create natural torn teeth. Cream pixels displaced away from card are invisible
   (same colour as background). Zero gray, zero bleed. */

const OVERLAP = 75; // px the cream rect overlaps into the card
/* Cross-axis inset for each torn strip — generous overlap at all four
   corners (rather than a thin -4px) so the top/bottom and left/right
   overlays always cover each other's corner regardless of viewport width. */
const CORNER = 100;
/* Belt-and-suspenders: fade each strip to transparent at its own cross-axis
   ends (via CSS mask, applied on top of the deTorn-displaced pixels) so a
   corner can never show a hard rectangular edge — only ever a soft taper —
   no matter how the turbulence displacement happens to land at that width. */
const fadeH = 'linear-gradient(90deg, transparent 0, #000 60px, #000 calc(100% - 60px), transparent 100%)';
const fadeV = 'linear-gradient(180deg, transparent 0, #000 60px, #000 calc(100% - 60px), transparent 100%)';

const TornTop = () => (
  <div aria-hidden style={{
    position:'absolute', top: -(OVERLAP), left:-CORNER, right:-CORNER, height: OVERLAP + 30, pointerEvents:'none', zIndex:10, overflow:'visible',
    WebkitMaskImage: fadeH, maskImage: fadeH,
  }}>
    <svg width="100%" height={OVERLAP + 30} style={{ display:'block', overflow:'visible' }}>
      <rect x="0" y="0" width="100%" height={OVERLAP} fill={C} filter="url(#deTorn)" />
    </svg>
  </div>
);

const TornBottom = () => (
  <div aria-hidden style={{
    position:'absolute', bottom: -(OVERLAP), left:-CORNER, right:-CORNER, height: OVERLAP + 30, pointerEvents:'none', zIndex:10, overflow:'visible',
    WebkitMaskImage: fadeH, maskImage: fadeH,
  }}>
    <svg width="100%" height={OVERLAP + 30} style={{ display:'block', overflow:'visible' }}>
      <rect x="0" y="30" width="100%" height={OVERLAP} fill={C} filter="url(#deTorn)" />
    </svg>
  </div>
);

const TornLeft = () => (
  <div aria-hidden style={{
    position:'absolute', top:-CORNER, bottom:-CORNER, left: -(OVERLAP), width: OVERLAP + 30, pointerEvents:'none', zIndex:10, overflow:'visible',
    WebkitMaskImage: fadeV, maskImage: fadeV,
  }}>
    <svg width={OVERLAP + 30} height="100%" style={{ display:'block', overflow:'visible' }}>
      <rect x="0" y="0" width={OVERLAP} height="100%" fill={C} filter="url(#deTorn)" />
    </svg>
  </div>
);

const TornRight = () => (
  <div aria-hidden style={{
    position:'absolute', top:-CORNER, bottom:-CORNER, right: -(OVERLAP), width: OVERLAP + 30, pointerEvents:'none', zIndex:10, overflow:'visible',
    WebkitMaskImage: fadeV, maskImage: fadeV,
  }}>
    <svg width={OVERLAP + 30} height="100%" style={{ display:'block', overflow:'visible' }}>
      <rect x="30" y="0" width={OVERLAP} height="100%" fill={C} filter="url(#deTorn)" />
    </svg>
  </div>
);

export default function TornPaperCard({ children }: { children: ReactNode }) {
  return (
    <div style={{
      position: 'relative', width: '82vw', maxWidth: 1140, margin: '0 auto', zIndex: 3,
    }}>
      {/* Inner: overflow:clip clips grain/mottle — torn overlays are siblings
          outside. Must be `clip`, NOT `hidden`: `hidden` makes this a scroll
          container, which silently breaks `position: sticky` for ANY
          descendant section that uses it. `clip` clips identically without
          that side effect, so it stays safe for future sticky/pinned UI. */}
      <div style={{ position: 'relative', overflow: 'clip', containerType: 'inline-size' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />
        <div style={{ position: 'absolute', inset: 0, filter: 'url(#deGrain)', opacity: 0.44, mixBlendMode: 'screen', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, filter: 'url(#deMottle)', opacity: 0.28, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.55)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>{children}</div>
      </div>

      {/* Cream torn edge overlays — organic, no gray */}
      <TornTop />
      <TornBottom />
      <TornLeft />
      <TornRight />
    </div>
  );
}
