import { useEffect, useRef, useState } from 'react';

/* One-shot IntersectionObserver reveal — proven pattern already used by the
   brewing-story notebook pages. Triggers once when the element first enters
   the viewport, then disconnects (no re-triggering on scroll back up). */
export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fallback: if IntersectionObserver is unavailable, reveal immediately so
    // the wrapped content is never left permanently hidden at opacity 0.
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* Subtle fade-up wrapper for section content. `delay` (seconds) lets
   sibling Reveals stagger slightly instead of popping in simultaneously. */
export function Reveal({ children, as = 'div', delay = 0, distance = 22, style, className }: {
  children: React.ReactNode;
  as?: 'div' | 'section';
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity .8s ease ${delay}s, transform .8s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
