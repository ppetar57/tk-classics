import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PLAYERS } from '../data.js';
import { Icon, SectionLabel } from '../components/ui.jsx';

export function Players() {
  return (
    <>
      <section className="res-head">
        <div className="container">
          <SectionLabel>Igrači</SectionLabel>
          <h1 className="res-head__title">Igrači Classicsa.</h1>
          <p className="players__intro muted">Ljudi koji čine klub — na terenu i oko njega.</p>
        </div>
      </section>

      <section className="container players">
        <ul className="players__list">
          {PLAYERS.map((p) => (
            <li key={p.slug}>
              <Link to={`/players/${p.slug}`} className="player-card">
                <span className="player-card__photo">
                  <img src={p.photo} alt={p.name} width="1122" height="1402" loading="lazy" decoding="async" />
                </span>
                <span className="player-card__body">
                  <span className="player-card__tag">{p.tag}</span>
                  <span className="player-card__title">{p.title}</span>
                  <strong className="player-card__name">{p.name}</strong>
                  <span className="player-card__go">
                    Pogledaj profil <Icon name="arrow" size={18} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function Player() {
  const { slug } = useParams();
  const p = PLAYERS.find((x) => x.slug === slug);
  useEffect(() => {
    if (p) document.title = `${p.name} — TK Classics`;
  }, [p]);
  if (!p) return <Navigate to="/players" replace />;

  return (
    <section className="player">
      <div className="container player__inner">
        <div className="player__photo">
          <img src={p.photo} alt={p.name} width="1122" height="1402" decoding="async" />
        </div>
        <div className="player__copy">
          <Link to="/players" className="player__back">
            <Icon name="arrow" size={18} /> Svi igrači
          </Link>
          <p className="player__tag">{p.tag}</p>
          <p className="player__title">{p.title}</p>
          <h1 className="player__name">{p.name}</h1>
          <Link to="/rezervacije" className="btn btn--lime btn--lg">
            Rezerviši teren <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
