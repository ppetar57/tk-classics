import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CLUB, NAV, MAPS_DIRECTIONS } from '../data.js';
import { getCurrentUser, useStore, currentSeason } from '../store.js';
import { Icon, Logo } from './ui.jsx';
import Intro from './Intro.jsx';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111311' : '#F7F8F3');
    try {
      localStorage.setItem('tk-theme', theme);
    } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const dark = theme === 'dark';
  return (
    <button className="icon-btn theme-toggle" onClick={toggle} aria-label={dark ? 'Uključi svetlu temu' : 'Uključi tamnu temu'} title={dark ? 'Svetla tema' : 'Tamna tema'}>
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}

function Nav() {
  const { pathname } = useLocation();
  const user = useStore(getCurrentUser);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === '/pocetna' && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${overHero ? 'nav--hero' : 'nav--solid'} ${open ? 'nav--open' : ''}`}>
      <a href="#main" className="skip">Preskoči na sadržaj</a>
      <div className="nav__inner">
        <Link to="/rezervacije" className="nav__brand" aria-label="TK Classics — rezervacije">
          <Logo variant={overHero ? 'dark' : 'auto'} />
        </Link>
        <nav className="nav__links" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="nav__link">
              {n.label.replace('Tereni / ', '')}
            </NavLink>
          ))}
        </nav>
        <div className="nav__actions">
          <ThemeToggle />
          <Link to={user ? '/profil' : '/prijava'} className="icon-btn nav__account" aria-label={user ? 'Moj profil' : 'Prijava'} title={user ? user.name : 'Prijava'}>
            {user ? <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span> : <Icon name="user" />}
          </Link>
          <Link to="/rezervacije" className="btn btn--lime btn--sm nav__cta">
            Rezerviši
          </Link>
          <button className="icon-btn nav__burger" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Zatvori meni' : 'Otvori meni'} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobilna navigacija">
          {NAV.map((n, i) => (
            <NavLink key={n.to} to={n.to} end className="mobile-menu__link" style={{ '--i': i }}>
              <span className="mobile-menu__n">0{i + 1}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <Link to="/rezervacije" className="btn btn--lime btn--lg btn--block">
            Rezerviši teren <Icon name="arrow" />
          </Link>
          <div className="mobile-menu__row">
            <Link to={user ? '/profil' : '/prijava'} className="btn btn--ghost btn--block">
              <Icon name="user" /> {user ? 'Moj profil' : 'Prijava'}
            </Link>
            <a href={CLUB.phoneHref} className="btn btn--ghost btn--block">
              <Icon name="phone" /> Pozovi
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const season = currentSeason();
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo variant="dark" className="footer__logo" />
          <p className="footer__tag">Tvoj teren. Tvoj ritam. Tvoj sledeći poen.</p>
          <p className="footer__member">Aktivni član TSB i TSS</p>
        </div>
        <div className="footer__col">
          <h3>Klub</h3>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <h3>Kontakt</h3>
          <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer">
            {CLUB.street}
            <br />
            {CLUB.city}
          </a>
          <a href={CLUB.phoneHref}>{CLUB.phone}</a>
          <a href={CLUB.emailHref}>{CLUB.email}</a>
        </div>
        <div className="footer__col">
          <h3>Radno vreme</h3>
          <p className="footer__hours">07:00–23:00</p>
          <p>Svaki dan</p>
          <p className="footer__season">
            <span className="demo-dot" aria-hidden="true" /> {season.label}
          </p>
          <a href={CLUB.website} target="_blank" rel="noreferrer" className="footer__official">
            Zvanični sajt kluba <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {CLUB.name}</span>
        <span>V1 prototip · rezervacije, nalozi i forme su demo i nisu povezani sa sistemom kluba.</span>
        <Link to="/admin">Demo admin</Link>
      </div>
      <div className="footer__giant" aria-hidden="true">
        CLASSICS
      </div>
    </footer>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

const TITLES = {
  '/pocetna': 'TK Classics — Teniski klub, Novi Beograd',
  '/rezervacije': 'Rezerviši teren — TK Classics',
  '/skola-tenisa': 'Škola tenisa — TK Classics',
  '/liga': 'Liga — TK Classics',
  '/turniri': 'Turniri — TK Classics',
  '/o-klubu': 'O klubu — TK Classics',
  '/kontakt': 'Kontakt — TK Classics',
  '/prijava': 'Prijava — TK Classics',
  '/registracija': 'Registracija — TK Classics',
  '/profil': 'Moj profil — TK Classics',
  '/admin': 'Demo admin — TK Classics',
};

export default function Layout() {
  const { pathname } = useLocation();
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    document.title = TITLES[pathname] || 'TK Classics';
  }, [pathname]);
  return (
    <>
      {intro && <Intro onDone={() => setIntro(false)} />}
      <ScrollTop />
      <Nav />
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      {pathname !== '/rezervacije' && (
        <Link to="/rezervacije" className="fab" aria-label="Rezerviši teren">
          <Icon name="calendar" /> Rezerviši
        </Link>
      )}
    </>
  );
}
