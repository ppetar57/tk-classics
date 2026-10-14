import { Link } from 'react-router-dom';
import { COURTS_AERIAL, CLUB, STATS, PHOTOS, COURTS, DEMO_LEAGUE, MAPS_EMBED, MAPS_DIRECTIONS } from '../data.js';
import { currentSeason, slotsFor, todayBelgrade, hh } from '../store.js';
import { asset } from '../env.js';
import { MapFrame, Photo, Reveal, Counter, Icon, SectionLabel, DemoNote } from '../components/ui.jsx';

export default function Home() {
  const season = currentSeason();
  return (
    <>
      <section className="hero">
        <Photo id={PHOTOS.hero} alt="Teniska loptica i reket na terenu" className="hero__photo" eager position="center 60%" />
        <div className="hero__shade" />
        <div className="container hero__inner">
          <p className="hero__eyebrow anim-up" style={{ '--d': '0ms' }}>
            <span className="pill pill--glass">
              <span className="demo-dot" aria-hidden="true" /> Novi Beograd · {season.label}
            </span>
          </p>
          <h1 className="hero__title">
            <span className="anim-up" style={{ '--d': '60ms' }}>Tenis.</span>
            <span className="anim-up" style={{ '--d': '140ms' }}>Fokus.</span>
            <span className="anim-up hero__title-accent" style={{ '--d': '220ms' }}>
              Classics.
            </span>
          </h1>
          <div className="hero__bottom">
            <div className="anim-up" style={{ '--d': '320ms' }}>
              <p className="hero__quote">„Tvoj teren. Tvoj ritam. Tvoj sledeći poen.“</p>
              <p className="hero__lead">
                TK Classics je teniski klub u Novom Beogradu — škola tenisa, rezervacije terena, klupska liga, turniri i zajednica ljudi koji vole ovaj sport.
              </p>
            </div>
            <div className="hero__ctas anim-up" style={{ '--d': '400ms' }}>
              <Link to="/rezervacije" className="btn btn--lime btn--xl">
                Rezerviši teren <Icon name="arrow" />
              </Link>
              <a href="#otkrij" className="btn btn--glass btn--xl">
                Otkrij klub
              </a>
            </div>
          </div>
        </div>
        <div className="hero__strip">
          <div className="container hero__strip-inner">
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer">
              <Icon name="pin" size={18} /> {CLUB.street}, Novi Beograd
            </a>
            <span>
              <Icon name="clock" size={18} /> Svaki dan 07:00–23:00
            </span>
            <a href={CLUB.phoneHref}>
              <Icon name="phone" size={18} /> {CLUB.phone}
            </a>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Škola tenisa <i /> Rezervacije terena <i /> Klupska liga <i /> Turniri <i /> Novi Beograd <i /> TSB · TSS <i />
            </span>
          ))}
        </div>
      </div>

      <section className="stats" id="otkrij">
        <div className="container">
          <div className="stats__head">
            <Reveal>
              <SectionLabel n="01">Klub u brojkama</SectionLabel>
              <h2 className="display-2">
                Generacije dece
                <br />
                <span className="muted">na terenima Classicsa.</span>
              </h2>
            </Reveal>
            <Reveal delay={120} as="p" className="stats__intro">
              Od prvih udaraca do takmičarskog tenisa — škola i turniri kluba okupljaju decu i mlade od 5 do 18 godina.
            </Reveal>
          </div>
          <div className="stats__grid">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 110} className="stat">
                <div className="stat__num">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="stat__label">{s.label}</p>
              </Reveal>
            ))}
          </div>
          <p className="fineprint">Podaci koje objavljuje klub na zvaničnom sajtu; nisu nezavisno revidirani.</p>
        </div>
      </section>

      <ExploreReservations />

      <section className="feature-school">
        <Photo id={PHOTOS.player} alt="Mladi teniser na treningu" className="feature-school__photo" position="center 30%" />
        <div className="feature-school__shade" />
        <div className="container feature-school__inner">
          <Reveal className="feature-school__age" aria-hidden="true">
            5<span>–</span>18
          </Reveal>
          <Reveal delay={120} className="feature-school__copy">
            <SectionLabel n="03">Škola tenisa</SectionLabel>
            <h2 className="display-2">Prvi udarac. Prava tehnika. Sledeći nivo.</h2>
            <p>Programi za decu i mlade od 5 do 18 godina — od upoznavanja sa tenisom, preko tehnike i koordinacije, do takmičarskog tenisa.</p>
            <Link to="/skola-tenisa" className="btn btn--lime btn--lg">
              Škola tenisa <Icon name="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="split-dark">
        <div className="container split-dark__grid">
          <Reveal className="league-teaser">
            <SectionLabel n="04">Klupska liga</SectionLabel>
            <h2 className="display-2">Svaki meč se računa.</h2>
            <p className="lead">Igraj redovno, prati tabelu i napreduj iz kola u kolo.</p>
            <Link to="/liga" className="btn btn--outline-light btn--lg">
              Pogledaj ligu <Icon name="arrow" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="mini-table" aria-label="Primer tabele lige (demo)">
            <div className="mini-table__head">
              <span>Tabela · primer</span>
              <span className="tag tag--demo">Demo</span>
            </div>
            {DEMO_LEAGUE.slice(0, 4).map((p, i) => (
              <div key={p.name} className={`mini-table__row ${i === 0 ? 'is-lead' : ''}`}>
                <span className="mini-table__pos">{i + 1}</span>
                <span className="mini-table__name">{p.name}</span>
                <span className="mini-table__wl">
                  {p.w}–{p.l}
                </span>
                <span className="mini-table__pts">{p.pts}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="tourney-teaser">
        <div className="container tourney-teaser__grid">
          <Reveal className="tourney-teaser__big" aria-hidden="true">
            200<em>+</em>
          </Reveal>
          <Reveal delay={100} className="tourney-teaser__copy">
            <SectionLabel n="05">Turniri</SectionLabel>
            <h2 className="display-2">Takmičenje koje gradi igrače.</h2>
            <p>Klub je organizovao više od 200 turnira na kojima je učestvovalo više od 4.000 dece od 5 do 18 godina (podaci kluba).</p>
            <div className="row-gap">
              <Link to="/turniri" className="btn btn--dark btn--lg">
                Turniri <Icon name="arrow" />
              </Link>
              <Link to="/o-klubu" className="link-arrow">
                O klubu <Icon name="arrow" size={18} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={200} className="tourney-teaser__photo">
            <Photo id={PHOTOS.action} alt="Teniser u akciji tokom meča" sizes="(min-width: 900px) 40vw, 100vw" />
          </Reveal>
        </div>
      </section>

      <LocationSection />
    </>
  );
}

function ExploreReservations() {
  const date = todayBelgrade(1);
  return (
    <section className="feature-res">
      <div className="container feature-res__grid">
        <Reveal className="feature-res__photo">
          <img src={COURTS_AERIAL} alt="Pogled iz vazduha na Teren 1, Teren 2 i Teren 3 kluba TK Classics" width="1536" height="1024" loading="lazy" decoding="async" />
          <span className="feature-res__badge">3 terena</span>
        </Reveal>
        <Reveal delay={120} className="feature-res__copy">
          <SectionLabel n="02">Tereni / Rezervacije</SectionLabel>
          <h2 className="display-2">Izaberi dan. Izaberi teren. Igraj.</h2>
          <p className="lead">Rezervacija u nekoliko dodira — pregled slobodnih termina za Teren 1, 2 i 3, od 07:00 do 23:00.</p>
          <div className="court-peek" aria-label="Pregled termina za sutra (demo)">
            {COURTS.map((c) => {
              const slots = slotsFor(date, c.id).filter((s) => s.hour >= 16 && s.hour <= 21);
              return (
                <div key={c.id} className="court-peek__row">
                  <span className="court-peek__name">{c.name}</span>
                  <div className="court-peek__slots">
                    {slots.map((s) => (
                      <span key={s.hour} className={`court-peek__slot is-${s.state}`} title={`${hh(s.hour)} · ${s.state === 'free' ? 'slobodno' : s.state === 'seasonal' ? 'sezonski termin' : 'zauzeto'}`}>
                        {s.hour}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <DemoNote>Sutra 16–22h · demo dostupnost</DemoNote>
          </div>
          <Link to="/rezervacije" className="btn btn--lime btn--lg">
            Rezerviši teren <Icon name="arrow" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function LocationSection() {
  return (
    <section className="location">
      <div className="container location__grid">
        <Reveal className="location__info">
          <SectionLabel n="06">Lokacija</SectionLabel>
          <h2 className="display-2">
            Gramšijeva 11.
            <br />
            <span className="muted">Novi Beograd.</span>
          </h2>
          <ul className="info-list">
            <li>
              <Icon name="clock" />
              <div>
                <strong>Svaki dan, 07:00–23:00</strong>
                <span>Objavljeno radno vreme</span>
              </div>
            </li>
            <li>
              <Icon name="phone" />
              <div>
                <a href={CLUB.phoneHref}>
                  <strong>{CLUB.phone}</strong>
                </a>
                <span>Rezervacije i informacije</span>
              </div>
            </li>
            <li>
              <Icon name="mail" />
              <div>
                <a href={CLUB.emailHref}>
                  <strong>{CLUB.email}</strong>
                </a>
                <span>Pišite nam</span>
              </div>
            </li>
          </ul>
          <div className="row-gap">
            <Link to="/rezervacije" className="btn btn--lime btn--lg">
              Rezerviši teren <Icon name="arrow" />
            </Link>
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer" className="btn btn--ghost btn--lg">
              <Icon name="pin" /> Uputstva do kluba
            </a>
          </div>
        </Reveal>
        <Reveal delay={120} className="location__map">
          <MapFrame />
        </Reveal>
      </div>
    </section>
  );
}
