import { InkDivider } from './TornPaperCard';
import favicon2 from '../../assets/images/Favicon 2.svg';

const orange = '#AD4F2E';

/* Shared footer bar — rendered at the end of the home page's Contact
   section and at the bottom of the privacy policy page. */
export default function Footer() {
  return (
    <div style={{ marginTop: 46, paddingTop: 30, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
      <InkDivider style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <img src={favicon2} alt="" style={{ width: 26, height: 26, objectFit: 'contain', display: 'block' }} />
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: '#F8ECE0' }}>DawnEmber</span>
      </a>
      <div style={{ fontSize: 12.5, color: '#9A8468', letterSpacing: '0.04em' }}>
        <a href="/privacy/" style={{ color: '#C4A882', textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy Policy</a>
        &nbsp;·&nbsp; Made with <span style={{ color: orange }}>&#9829;</span> by Anbu &amp; Aswin &nbsp;·&nbsp; © 2025 Dawn Ember
      </div>
    </div>
  );
}
