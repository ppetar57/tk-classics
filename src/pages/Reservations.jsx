import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CLUB, COURTS, COURT_IMAGES } from '../data.js';

const IMG_SIZE = { full: [505, 872], sm: [380, 656] };
import { slotsFor, todayBelgrade, fmtDate, hh, createReservation, getCurrentUser, useStore, getReservations, currentSeason } from '../store.js';
import { Icon, Modal, DemoNote, SectionLabel, useToast } from '../components/ui.jsx';

const DAYS = 14;

function readPending() {
  try {
    return JSON.parse(sessionStorage.getItem('tk-pending') || 'null');
  } catch {
    return null;
  }
}

export default function Reservations() {
  const user = useStore(getCurrentUser);
  useStore(getReservations); // re-render when reservations change
  const navigate = useNavigate();
  const toast = useToast();
  const pending = useMemo(readPending, []);
  const dates = useMemo(() => Array.from({ length: DAYS }, (_, i) => todayBelgrade(i)), []);
  const [date, setDate] = useState(() => {
    if (pending?.date && dates.includes(pending.date)) return pending.date;
    return dates.find((d) => COURTS.some((c) => slotsFor(d, c.id).some((x) => x.state === 'free'))) || dates[0];
  });
  const [court, setCourtState] = useState(() => {
    const saved = Number(pending?.court || (() => { try { return localStorage.getItem('tk-court'); } catch { return null; } })());
    return COURTS.some((c) => c.id === saved) ? saved : 1;
  });
  const setCourt = (id) => {
    setCourtState(id);
    try {
      localStorage.setItem('tk-court', String(id));
    } catch {}
  };
  const courtInfo = COURTS.find((c) => c.id === court);
  const [hour, setHour] = useState(pending?.hour ?? null);
  const [review, setReview] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      sessionStorage.removeItem('tk-pending');
    } catch {}
  }, []);

  const slots = slotsFor(date, court);
  const freeCount = (d, c) => slotsFor(d, c).filter((s) => s.state === 'free').length;
  const sel = slots.find((s) => s.hour === hour);
  const validSel = sel && sel.state === 'free';

  useEffect(() => {
    if (hour !== null && sel && sel.state !== 'free') setHour(null);
  }, [date, court]);

  function proceed() {
    setError('');
    if (!validSel) return setError('Izaberite slobodan termin.');
    if (!user) {
      try {
        sessionStorage.setItem('tk-pending', JSON.stringify({ date, court, hour }));
      } catch {}
      navigate('/prijava', { state: { from: '/rezervacije' } });
      return;
    }
    setReview(true);
  }

  function confirm() {
    try {
      const r = createReservation({ date, court, hour });
      setReview(false);
      setDone(r);
      setHour(null);
      toast('Demo rezervacija je potvrđena.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e.message);
      setReview(false);
    }
  }

  if (done) return <Success r={done} onAgain={() => setDone(null)} />;

  return (
    <div className="res-page">
      <section className="res-head">
        <div className="container res-head__inner">
          <div>
            <SectionLabel>Tereni / Rezervacije</SectionLabel>
            <h1 className="res-head__title">Rezerviši teren.</h1>
            <p className="res-head__today">
              <span>Danas</span>
              <time dateTime={todayBelgrade()}>{fmtDate(todayBelgrade(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</time>
            </p>
          </div>
          <div className="res-head__side">
            <div className="page-hero__meta">
            <span className="pill">
              <Icon name="clock" size={16} /> {CLUB.hours}
            </span>
            <span className="pill">3 terena</span>
            <span className="pill">{currentSeason().label}</span>
            </div>
          </div>
          <DemoNote className="demo-note--strong res-head__note">
            Demo rezervacije — termini nisu povezani sa stvarnom evidencijom kluba. Za stvarnu rezervaciju pozovite{' '}
            <a href={CLUB.phoneHref}>{CLUB.phone}</a>.
          </DemoNote>
        </div>
      </section>

      <div className="container res-layout">
        <div className="res-main">
          <fieldset className="step">
            <legend className="step__title">
              <span className="step__n">1</span> Teren
            </legend>
            <div className="court-picker" role="radiogroup" aria-label="Izaberite teren">
              {COURTS.map((c) => {
                const active = c.id === court;
                const free = freeCount(date, c.id);
                return (
                  <button key={c.id} role="radio" aria-checked={active} className={`court-card ${active ? 'is-active' : ''}`} onClick={() => setCourt(c.id)}>
                    <CourtImage id={c.id} size="sm" alt={`Pogled iz vazduha — ${c.name}`} className="court-card__img" />
                    <span className="court-card__check" aria-hidden="true">
                      <Icon name="check" size={16} />
                    </span>
                    <span className="court-card__body">
                      <span className="court-card__top">
                        <span className="court-card__name">{c.name}</span>
                        <span className="court-card__surface">Šljaka</span>
                      </span>
                      <span className="court-card__free">{free ? `${free} slobodnih termina · ${fmtDate(date, { day: 'numeric', month: 'short' })}` : 'Nema slobodnih termina'}</span>
                      <span className="court-card__action">{active ? 'Izabran' : 'Izaberi teren'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="court-preview" aria-live="polite">
              <div className="court-preview__media">
                {COURTS.map((c) => (
                  <CourtImage key={c.id} id={c.id} alt={`Pogled iz vazduha — ${c.name}`} className={`court-preview__img ${c.id === court ? 'is-shown' : ''}`} hidden={c.id !== court} />
                ))}
              </div>
              <div className="court-preview__info" key={court}>
                <span className="court-preview__n">0{court}</span>
                <strong className="court-preview__name">{courtInfo.name}</strong>
                <dl className="court-preview__facts">
                  <div>
                    <dt>Podloga</dt>
                    <dd>Šljaka</dd>
                  </div>
                  <div>
                    <dt>Radno vreme</dt>
                    <dd>07:00–23:00</dd>
                  </div>
                  <div>
                    <dt>Slobodno · {fmtDate(date, { day: 'numeric', month: 'short' })}</dt>
                    <dd>{freeCount(date, court)} termina (demo)</dd>
                  </div>
                </dl>
                <p className="court-preview__next">
                  Sledeći korak: izaberite datum i termin <Icon name="arrow" size={16} />
                </p>
              </div>
            </div>
          </fieldset>

          <fieldset className="step">
            <legend className="step__title">
              <span className="step__n">2</span> Datum
            </legend>
            <div className="date-strip" role="radiogroup" aria-label="Izaberite datum">
              {dates.map((d, i) => {
                const active = d === date;
                return (
                  <button key={d} role="radio" aria-checked={active} className={`date-chip ${active ? 'is-active' : ''}`} onClick={() => setDate(d)}>
                    <span className="date-chip__wd">{i === 0 ? 'Danas' : i === 1 ? 'Sutra' : fmtDate(d, { weekday: 'short' })}</span>
                    <span className="date-chip__d">{fmtDate(d, { day: 'numeric' })}</span>
                    <span className="date-chip__m">{fmtDate(d, { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="step">
            <legend className="step__title">
              <span className="step__n">3</span> Termin
              <span className="legend">
                <i className="lg lg--free" /> Slobodno <i className="lg lg--taken" /> Zauzeto <i className="lg lg--seasonal" /> Sezonski termin <i className="lg lg--sel" /> Izabrano
              </span>
            </legend>
            <div className="slot-grid" role="radiogroup" aria-label={`Termini za ${fmtDate(date)}`}>
              {slots.map((s) => {
                const active = s.hour === hour;
                const disabled = s.state !== 'free';
                return (
                  <button
                    key={s.hour}
                    role="radio"
                    aria-checked={active}
                    disabled={disabled}
                    className={`slot is-${s.state} ${active ? 'is-active' : ''}`}
                    onClick={() => setHour(s.hour)}
                    aria-label={`${hh(s.hour)}–${hh(s.hour + 1)} ${disabled ? (s.mine ? 'vaš termin' : s.state === 'past' ? 'prošlo' : s.state === 'seasonal' ? 'sezonski termin' : 'zauzeto') : 'slobodno'}`}
                  >
                    <span className="slot__t">{hh(s.hour)}</span>
                    <span className="slot__s">{s.mine ? 'Vaš termin' : s.state === 'free' ? '60 min' : s.state === 'past' ? 'Prošlo' : s.state === 'seasonal' ? 'Sezonski' : 'Zauzeto'}</span>
                  </button>
                );
              })}
            </div>
            {slots.some((s) => s.state === 'seasonal') && (
              <p className="seasonal-note">
                <i className="lg lg--seasonal" aria-hidden="true" />
                <span>
                  <strong>Sezonski termin</strong> — isti teren i sat svake nedelje, zakupljen za celu sezonu. Za sezonski zakup pozovite klub. (demo)
                </span>
              </p>
            )}
            {slots.every((s) => s.state !== 'free') && <p className="empty-inline">Za ovaj dan i teren nema slobodnih demo termina. Izaberite drugi teren ili datum.</p>}
          </fieldset>
        </div>

        <aside className="res-summary" aria-live="polite">
          <div className="summary-card">
            <CourtImage id={court} size="sm" alt={`${courtInfo.name} — pogled iz vazduha`} className="summary-card__img" key={court} />
            <p className="summary-card__label">Vaša rezervacija</p>
            <dl className="summary-card__list">
              <div>
                <dt>Datum</dt>
                <dd>{fmtDate(date)}</dd>
              </div>
              <div>
                <dt>Teren</dt>
                <dd>Teren {court}</dd>
              </div>
              <div>
                <dt>Termin</dt>
                <dd className={validSel ? 'is-lime' : 'muted'}>{validSel ? `${hh(hour)}–${hh(hour + 1)}` : 'Izaberite termin'}</dd>
              </div>
            </dl>
            {error && (
              <p className="form-error" role="alert">
                <Icon name="alert" size={18} /> {error}
              </p>
            )}
            <button className="btn btn--lime btn--lg btn--block" onClick={proceed} disabled={!validSel}>
              {user ? 'Pregledaj rezervaciju' : 'Prijavi se i nastavi'} <Icon name="arrow" />
            </button>
            <p className="summary-card__rule">
              <Icon name="shield" size={16} /> Otkazivanje bez naknade do 24 h pre termina.
            </p>
          </div>
          <a href={CLUB.phoneHref} className="call-card">
            <Icon name="phone" />
            <span>
              <strong>Stvarna rezervacija?</strong>
              Pozovite klub: {CLUB.phone}
            </span>
          </a>
        </aside>
      </div>

      {validSel && (
        <div className="mobile-bar">
          <span>
            <strong>
              Teren {court} · {hh(hour)}
            </strong>
            {fmtDate(date, { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
          <button className="btn btn--lime" onClick={proceed}>
            {user ? 'Nastavi' : 'Prijava'} <Icon name="arrow" />
          </button>
        </div>
      )}

      <Modal open={review} onClose={() => setReview(false)} title="Potvrdite rezervaciju">
        <div className="review">
          <div className="review__ticket">
            <CourtImage id={court} size="sm" alt="" className="review__img" />
            <span className="review__court">Teren {court}</span>
            <span className="review__time">
              {hh(hour ?? 0)}–{hh((hour ?? 0) + 1)}
            </span>
            <span className="review__date">{fmtDate(date)}</span>
            <span className="review__who">{user?.name}</span>
          </div>
          <ul className="review__rules">
            <li>Otkazivanje bez naknade moguće je do 24 h pre početka termina.</li>
            <li>Ovo je demo rezervacija sačuvana samo u ovom pregledaču — nije poslata klubu.</li>
          </ul>
          <div className="row-gap">
            <button className="btn btn--lime btn--lg" onClick={confirm}>
              Potvrdi rezervaciju <Icon name="check" />
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => setReview(false)}>
              Nazad
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Success({ r, onAgain }) {
  return (
    <section className="success">
      <div className="container success__inner">
        <div className="success__check">
          <Icon name="check" size={40} />
        </div>
        <p className="section-label">Demo rezervacija potvrđena</p>
        <h1 className="display-1">Vidimo se na terenu.</h1>
        <div className="review__ticket review__ticket--big">
          <CourtImage id={r.court} size="sm" alt="" className="review__img" />
          <span className="review__court">Teren {r.court}</span>
          <span className="review__time">
            {hh(r.hour)}–{hh(r.hour + 1)}
          </span>
          <span className="review__date">{fmtDate(r.date)}</span>
          <span className="review__who">{r.name}</span>
        </div>
        <DemoNote>Rezervacija je sačuvana samo u ovom pregledaču i nije poslata klubu. Za stvarni termin pozovite {CLUB.phone}.</DemoNote>
        <div className="row-gap row-gap--center">
          <Link to="/profil" className="btn btn--lime btn--lg">
            Moje rezervacije <Icon name="arrow" />
          </Link>
          <button className="btn btn--ghost btn--lg" onClick={onAgain}>
            Nova rezervacija
          </button>
        </div>
      </div>
    </section>
  );
}

/** Aerial image for a court, looked up by explicit court ID, with a drawn fallback. */
export function CourtImage({ id, size = 'full', alt, className = '', hidden = false }) {
  const src = COURT_IMAGES[id];
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`court-img ${loaded ? 'is-loaded' : ''} ${className}`} aria-hidden={hidden || undefined} data-court={id}>
      {!src || failed ? (
        <span className="court-img__fallback" role="img" aria-label={alt}>
          <svg viewBox="0 0 120 60" aria-hidden="true">
            <rect x="2" y="2" width="116" height="56" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M2 10h116M2 50h116M60 2v56M30 10v40M90 10v40M30 30h60" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      ) : (
        <img src={size === 'sm' ? src.sm : src.full} alt={alt} width={IMG_SIZE[size][0]} height={IMG_SIZE[size][1]} loading={size === 'sm' ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
    </span>
  );
}
