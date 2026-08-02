import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import SVGFilters from './components/common/SVGFilters';
import PageBackground from './components/common/PageBackground';
import TornPaperCard from './components/common/TornPaperCard';
import ScrollFab from './components/common/ScrollFab';
import logoIcon from './assets/images/Logo Mark.svg';
import QuickNav from './components/sections/QuickNav';
import Hero from './components/sections/Hero';
import Work from './components/sections/Work';
import About from './components/sections/About';
import SparkFactor from './components/sections/SparkFactor';
import Contact from './components/sections/Contact';

export default function App() {
  // Scroll-spy: keep the URL hash in sync with the section in view, so the
  // address bar reflects where you actually are (e.g. #contact once you reach
  // Contact) instead of staying on whatever nav link was last clicked.
  // replaceState is used so it neither scrolls the page nor floods history.
  useEffect(() => {
    const sections = ['home', 'work', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const hash = `#${entry.target.id}`;
            if (window.location.hash !== hash) {
              history.replaceState(null, '', hash);
            }
          }
        }
      },
      // A thin band in the upper third of the viewport is the "active" zone —
      // whichever section is crossing it owns the hash. Sitting it higher than
      // dead-centre lets the first section (#home) register at the top of the
      // page, where its centre can never reach the middle.
      { rootMargin: '-30% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SVGFilters />
      <PageBackground />
      <ScrollFab />

      {/* Scrollable content */}
      <div style={{ position: 'relative', zIndex: 3, paddingBottom: 64 }}>
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
