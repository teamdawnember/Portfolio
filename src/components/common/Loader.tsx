import logoIcon from '../../assets/images/Logo Mark.svg';

/* Full-screen brand loader shown until the page's assets have loaded.
   Sits on the cream body background (same as the site) so there's no flash
   before/after. `done` fades it out and lifts it out of the way. */
export default function Loader({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden={done}
      role="status"
      aria-label="Loading DawnEmber"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#F8ECE0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
        opacity: done ? 0 : 1,
        visibility: done ? 'hidden' : 'visible',
        pointerEvents: done ? 'none' : 'auto',
        // fade opacity, then flip visibility off after the fade so it can't be tabbed to
        transition: 'opacity .55s ease, visibility 0s linear .55s',
      }}
    >
      <style>{`
        @keyframes dnLoaderPulse { 0%,100%{ opacity:.85; transform:scale(1); } 50%{ opacity:1; transform:scale(1.06); } }
        @keyframes dnLoaderSpin { to { transform: rotate(360deg); } }
      `}</style>

      <img
        src={logoIcon} alt=""
        style={{ height: 'clamp(46px,11vw,62px)', width: 'auto', display: 'block', animation: 'dnLoaderPulse 1.6s ease-in-out infinite' }}
      />
      <span style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 'clamp(22px,4vw,28px)', color: '#191919', letterSpacing: '.01em', lineHeight: 1 }}>
        DawnEmber
      </span>

      {/* spinning ember arc */}
      <svg width="30" height="30" viewBox="0 0 50 50" style={{ marginTop: 4, animation: 'dnLoaderSpin .9s linear infinite' }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(173,79,46,0.18)" strokeWidth="4" />
        <circle cx="25" cy="25" r="20" fill="none" stroke="#AD4F2E" strokeWidth="4" strokeLinecap="round" strokeDasharray="80 200" />
      </svg>
    </div>
  );
}
