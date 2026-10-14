import { Link } from 'react-router-dom';
import { DEMO_LEAGUE, DEMO_MATCHES, CLUB } from '../data.js';
import { Reveal, Icon, SectionLabel, DemoNote } from '../components/ui.jsx';

const STATUS = { zakazan: 'Zakazan', 'u toku': 'U toku', završen: 'Završen' };

export default function League() {
  return (
    <>
      <section className="page-hero page-hero--dark">
        <div className="container page-hero__inner page-hero__inner--split">
          <div>
            <SectionLabel>Klupska liga</SectionLabel>
            <h1 className="display-1">
              Liga<span className="lime">.</span>
            </h1>
          </div>
          <div>
            <p className="lead">Redovni mečevi, jasna tabela i motivacija da svake nedelje igraš bolje. Klupska liga je deo ponude TK Classics.</p>
            <DemoNote>Tabela, igrači i rezultati ispod su primer (demo) — nisu stvarni rezultati lige. Za aktuelne informacije kontaktirajte klub.</DemoNote>
          </div>
        </div>
      </section>

      <section className="league">
        <div className="container league__grid">
          <Reveal className="league__table">
            <div className="panel-head">
              <h2 className="display-3">Tabela</h2>
              <span className="tag tag--demo">Demo podaci</span>
            </div>
            <div className="table-wrap">
              <table className="table table--league">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Igrač</th>
                    <th title="Odigrano">O</th>
                    <th title="Pobede">P</th>
                    <th title="Porazi">I</th>
                    <th>Setovi</th>
                    <th>Forma</th>
                    <th>Bod.</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_LEAGUE.map((p, i) => (
                    <tr key={p.name} className={i < 2 ? 'is-top' : ''}>
                      <td className="pos">{i + 1}</td>
                      <td className="name">{p.name}</td>
                      <td>{p.p}</td>
                      <td>{p.w}</td>
                      <td>{p.l}</td>
                      <td>{p.sets}</td>
                      <td>
                        <span className="form-dots" aria-label={`Forma: ${p.form.join(', ')}`}>
                          {p.form.map((f, k) => (
                            <i key={k} className={f === 'W' ? 'w' : 'l'} />
                          ))}
                        </span>
                      </td>
                      <td className="pts">{p.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={120} className="league__matches">
            <div className="panel-head">
              <h2 className="display-3">Mečevi</h2>
              <span className="tag tag--demo">Demo</span>
            </div>
            <ul className="matches">
              {DEMO_MATCHES.map((m, i) => (
                <li key={i} className={`match match--${m.status.replace(' ', '-').replace('š', 's')}`}>
                  <div className="match__top">
                    <span className="match__status">
                      <i />
                      {STATUS[m.status]}
                    </span>
                    <span className="muted">
                      {m.when} · {m.court}
                    </span>
                  </div>
                  <div className="match__players">
                    <strong>{m.a}</strong>
                    <span className="match__vs">{m.score || 'vs'}</span>
                    <strong>{m.b}</strong>
                  </div>
                </li>
              ))}
            </ul>
            <div className="side-card side-card--lime">
              <h3>Želiš da igraš ligu?</h3>
              <p>Pravila, termine i prijave za klupsku ligu saznaćete u klubu.</p>
              <div className="row-gap">
                <a href={CLUB.phoneHref} className="btn btn--dark">
                  <Icon name="phone" /> Pozovi
                </a>
                <Link to="/kontakt" className="btn btn--outline-dark">
                  Kontakt
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
