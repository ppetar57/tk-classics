import { Link } from 'react-router-dom';
import { CLUB, STATS, COURTS_AERIAL } from '../data.js';
import { Reveal, Icon, SectionLabel, Counter } from '../components/ui.jsx';

const PILLARS = [
  { icon: 'school', title: 'Škola tenisa', text: 'Uvodimo decu i mlade od 5 do 18 godina u tenis — kroz igru, tehniku i postepeni napredak.' },
  { icon: 'trophy', title: 'Turniri', text: 'Organizacija turnira za mlade igrače i put ka takmičarskom tenisu.' },
  { icon: 'ball', title: 'Rezervacije i liga', text: 'Tereni za rekreativce i klupska liga za sve koji žele redovnu igru.' },
  { icon: 'shield', title: 'TSB i TSS', text: 'Klub je aktivni član Teniskog saveza Beograda i Teniskog saveza Srbije.' },
];

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <SectionLabel>O klubu</SectionLabel>
          <h1 className="display-1 about-hero__title">
            Teniski klub
            <br />
            <span className="outline">Classics.</span>
          </h1>
          <div className="about-hero__row">
            <p className="lead">
              TK Classics je teniski klub u Novom Beogradu, na adresi Gramšijeva 11. Klub okuplja decu, mlade i rekreativce kroz školu tenisa, rezervacije terena, klupsku ligu i turnire.
            </p>
            <p className="muted">
              Kroz školu tenisa kluba prošlo je više od 2.000 dece, a na više od 200 turnira u organizaciji kluba učestvovalo je više od 4.000 dece od 5 do 18 godina (podaci kluba).
            </p>
          </div>
        </div>
      </section>

      <section className="about-photo">
        <img className="about-photo__img" src={COURTS_AERIAL} alt="Pogled iz vazduha na terene TK Classics" width="1536" height="1024" loading="lazy" decoding="async" />
      </section>

      <section className="pillars">
        <div className="container pillars__grid">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="pillar">
              <Icon name={p.icon} size={28} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-stats">
        <div className="container about-stats__grid">
          {STATS.map((s) => (
            <div key={s.label}>
              <strong>
                <Counter value={s.value} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="container fineprint">Podaci koje objavljuje klub.</p>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2 className="display-2">Više o klubu</h2>
            <p>Dodatne informacije potražite na zvaničnom sajtu ili nas posetite u Gramšijevoj 11.</p>
          </div>
          <div className="row-gap">
            <a href={CLUB.website} target="_blank" rel="noreferrer" className="btn btn--dark btn--xl">
              tkclassics.rs <Icon name="arrowUpRight" />
            </a>
            <Link to="/kontakt" className="btn btn--outline-dark btn--xl">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
