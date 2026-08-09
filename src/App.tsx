import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import SVGFilters from './components/common/SVGFilters';
import PageBackground from './components/common/PageBackground';
import TornPaperCard from './components/common/TornPaperCard';
import ScrollFab from './components/common/ScrollFab';
import Loader from './components/common/Loader';
import logoIcon from './assets/images/Logo Mark.svg';
import QuickNav from './components/sections/QuickNav';
import Hero from './components/sections/Hero';
import Work from './components/sections/Work';
import About from './components/sections/About';
import SparkFactor from './components/sections/SparkFactor';
import Contact from './components/sections/Contact';

export default function App() {
  const [ready, setReady] = useState(false);

  // Hold the loader until the page's assets (images, fonts, everything the
  // window "load" event waits for) have finished — with a minimum display
  // time so it doesn't flash, and an 8s safety fallback so a slow/broken
  // asset can never trap the visitor on the loader.
  useEffect(() => {
    const MIN_MS = 600;
    const started = Date.now();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, MIN_MS - (Date.now() - started));
      window.setTimeout(() => setReady(true), wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const fallback = window.setTimeout(finish, 8000);
    return () => {
      window.removeEventListener('load', finish);
      window.clearTimeout(fallback);
    };
  }, []);

  // Lock page scroll while the loader is covering the screen.
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [ready]);

  // Keep the address bar clean. In-page anchor clicks are intercepted BEFORE
  // the browser can write the #hash to the URL — we preventDefault and run the
  // smooth scroll ourselves (scrollIntoView honours the sections'
  // scroll-margin-top), so the hash never appears, not even for a moment.
  // A scroll fallback still strips a hash that arrives via a direct link
  // (e.g. someone opening dawnember.in/#work).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      const el = document.getElementById(a.getAttribute('href')!.slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const clearHash = () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    document.addEventListener('click', onClick);
    window.addEventListener('scroll', clearHash, { passive: true });
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('scroll', clearHash);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Loader done={ready} />
      <SVGFilters />
      <PageBackground />
      <ScrollFab />

      {/* Scrollable content. overflowX:clip trims the torn-paper card's edge
          overlays (which extend ~100px beyond the card) at the viewport edge,
          so they never cause horizontal scroll on narrow screens. `clip`
          (not hidden) keeps vertical scroll normal and creates no scroll
          container. */}
      <div style={{ position: 'relative', zIndex: 3, paddingBottom: 64, overflowX: 'clip' }}>
        {/* Brand mark — on cream background, centred above the card. zIndex 4
            keeps it above the card (zIndex 3) so the torn-paper top edge's cream
            overlay can't paint over the wordmark. */}
        <div style={{ position: 'relative', zIndex: 4, textAlign: 'center', paddingTop: 32, paddingBottom: 28 }}>
          <a href="#home" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <img src={logoIcon} alt="" style={{ height: 'clamp(34px,5vw,46px)', width: 'auto', objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 'clamp(20px,2.6vw,26px)', color: '#191919', lineHeight: 1 }}>DawnEmber</span>
          </a>
        </div>

        <TornPaperCard>
          <QuickNav />
          <Hero />
          <Work />
          <About />
          <SparkFactor />
          <Contact />
        </TornPaperCard>
      </div>
    </ThemeProvider>
  );
}
