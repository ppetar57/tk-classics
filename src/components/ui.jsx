import { asset, ARTIFACT } from '../env.js';
import { MAPS_EMBED, MAPS_DIRECTIONS, CLUB } from '../data.js';
import { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';

export function Logo({ variant = 'auto', className = '', alt = 'TK Classics' }) {
  // variant: 'auto' follows theme, 'dark' forces light-lettering (for dark surfaces), 'light' forces dark lettering.
  if (variant === 'dark') return <img className={`logo ${className}`} src={asset('/images/logo-dark.webp')} alt={alt} width="640" height="376" />;
  if (variant === 'light') return <img className={`logo ${className}`} src={asset('/images/logo-light.webp')} alt={alt} width="640" height="376" />;
  return (
    <span className={`logo-auto ${className}`}>
      <img className="logo logo--for-light" src={asset('/images/logo-light.webp')} alt={alt} width="640" height="376" />
      <img className="logo logo--for-dark" src={asset('/images/logo-dark.webp')} alt="" aria-hidden="true" width="640" height="376" />
    </span>
  );
}

const unsplash = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

/** Remote tennis photo with an art-directed fallback: never renders a broken image. */
export function Photo({ id, alt, className = '', eager = false, sizes = '100vw', position = 'center' }) {
  const [state, setState] = useState('loading');
  const ref = useRef(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) setState(img.naturalWidth > 0 ? 'ok' : 'err');
  }, []);
  return (
    <div className={`photo photo--${state} ${className}`} role={state === 'err' ? 'img' : undefined} aria-label={state === 'err' ? alt : undefined}>
      <CourtArt />
      {state !== 'err' && (
        <img
          ref={ref}
          src={unsplash(id, 1400)}
          srcSet={[640, 1000, 1400, 2000].map((w) => `${unsplash(id, w)} ${w}w`).join(', ')}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          decoding="async"
          style={{ objectPosition: position }}
          onLoad={() => setState('ok')}
          onError={() => setState('err')}
        />
      )}
    </div>
  );
}

/** Court-line composition used as the photo placeholder / fallback. */
export function CourtArt({ className = '' }) {
  return (
    <svg className={`court-art ${className}`} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="ca-glow" cx="72%" cy="28%" r="60%">
          <stop offset="0" stopColor="#C7F464" stopOpacity=".35" />
          <stop offset="1" stopColor="#C7F464" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ca-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1f1a" />
          <stop offset="1" stopColor="#0c0e0c" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#ca-bg)" />
      <rect width="800" height="600" fill="url(#ca-glow)" />
      <g fill="none" stroke="#F7F8F3" strokeOpacity=".22" strokeWidth="3">
        <path d="M250 120 L550 120 L760 600 L40 600 Z" />
        <path d="M290 120 L215 600 M510 120 L585 600" />
        <path d="M400 210 L400 470 M330 210 L470 210 M180 470 L620 470" />
        <path d="M150 340 L650 340" strokeOpacity=".5" strokeWidth="5" />
      </g>
      <circle cx="590" cy="170" r="34" fill="#C7F464" />
      <path d="M560 150 Q590 175 575 205 M620 140 Q592 165 606 200" stroke="#F7F8F3" strokeWidth="4" fill="none" strokeOpacity=".9" />
    </svg>
  );
}

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const [n, setN] = useState(value); // real value is rendered by default
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setN(0);
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} aria-label={`${value.toLocaleString('sr-Latn-RS')}${suffix}`}>
      <span aria-hidden="true">
        {n.toLocaleString('sr-Latn-RS')}
        <em>{suffix}</em>
      </span>
    </span>
  );
}

export function Modal({ open, onClose, title, children, labelledBy = 'modal-title' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.querySelector('input,select,textarea,button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={ref}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Zatvori">
          <Icon name="x" />
        </button>
        {title && <h2 id={labelledBy} className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, tone = 'ok') => {
    const id = Math.random();
    setItems((x) => [...x, { id, msg, tone }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <Icon name={t.tone === 'ok' ? 'check' : 'alert'} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function DemoNote({ children, className = '' }) {
  return (
    <p className={`demo-note ${className}`}>
      <span className="demo-dot" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function SectionLabel({ n, children }) {
  return (
    <p className="section-label">
      {n && <span className="section-label__n">{n}</span>}
      {children}
    </p>
  );
}

const PATHS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7M8 7h9v9',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  alert: 'M12 8v5M12 16.5v.5M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  trophy: 'M8 4h8v5a4 4 0 01-8 0zM8 6H4a3 3 0 003 4M16 6h4a3 3 0 01-3 4M12 13v4M8 21h8M9 17h6',
  ball: 'M12 21a9 9 0 100-18 9 9 0 000 18zM5.5 5.6a9 9 0 010 12.8M18.5 5.6a9 9 0 000 12.8',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  school: 'M3 9l9-5 9 5-9 5zM7 11.5V16c3 2 7 2 10 0v-4.5',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
};
export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Google Maps embed; in the artifact preview (where iframes are blocked) a location card instead. */
export function MapFrame() {
  if (!ARTIFACT)
    return <iframe title="Mapa — TK Classics, Gramšijeva 11, Novi Beograd" src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
  return (
    <a className="map-card" href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer">
      <CourtArt />
      <span className="map-card__body">
        <Icon name="pin" size={28} />
        <strong>{CLUB.street}</strong>
        <span>{CLUB.city}</span>
        <span className="map-card__go">
          Otvori u Google mapama <Icon name="arrowUpRight" size={16} />
        </span>
      </span>
    </a>
  );
}
