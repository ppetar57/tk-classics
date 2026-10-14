import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser, useStore, myReservations, getReservations, logout, belgradeTs, fmtDate, hh, canCancelFree, cancelReservation } from '../store.js';
import { CLUB } from '../data.js';
import { Icon, Modal, DemoNote, SectionLabel, useToast } from '../components/ui.jsx';

export default function Profile() {
  const user = useStore(getCurrentUser);
  useStore(getReservations);
  const navigate = useNavigate();
  const toast = useToast();
  const [toCancel, setToCancel] = useState(null);
  const [tab, setTab] = useState('upcoming');
  if (!user) return <Navigate to="/prijava" state={{ from: '/profil' }} replace />;

  const now = Date.now();
  const mine = myReservations().sort((a, b) => belgradeTs(a.date, a.hour) - belgradeTs(b.date, b.hour));
  const upcoming = mine.filter((r) => belgradeTs(r.date, r.hour + 1) > now);
  const past = mine.filter((r) => belgradeTs(r.date, r.hour + 1) <= now).reverse();
  const list = tab === 'upcoming' ? upcoming : past;

  function doCancel() {
    try {
      cancelReservation(toCancel.id);
      toast('Demo rezervacija je otkazana.');
    } catch (e) {
      toast(e.message, 'err');
    }
    setToCancel(null);
  }

  return (
    <div className="profile">
      <section className="profile__head">
        <div className="container profile__head-inner">
          <div className="profile__id">
            <span className="avatar avatar--xl">{user.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <SectionLabel>Moj profil · demo nalog</SectionLabel>
              <h1 className="display-2">{user.name}</h1>
              <p className="muted">
                {user.email}
                {user.phone && ` · ${user.phone}`}
              </p>
            </div>
          </div>
          <div className="profile__stats">
            <div>
              <strong>{upcoming.length}</strong>
              <span>Predstojeće</span>
            </div>
            <div>
              <strong>{past.length}</strong>
              <span>Odigrano</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container profile__body">
        <div className="profile__main">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'upcoming'} className={`tab ${tab === 'upcoming' ? 'is-active' : ''}`} onClick={() => setTab('upcoming')}>
              Predstojeće ({upcoming.length})
            </button>
            <button role="tab" aria-selected={tab === 'past'} className={`tab ${tab === 'past' ? 'is-active' : ''}`} onClick={() => setTab('past')}>
              Prošle ({past.length})
            </button>
          </div>
          {list.length === 0 ? (
            <div className="empty">
              <Icon name="calendar" size={36} />
              <h3>{tab === 'upcoming' ? 'Nema predstojećih rezervacija' : 'Još nema prošlih termina'}</h3>
              <p className="muted">Izaberite dan, teren i termin — rezervacija traje manje od minuta.</p>
              <Link to="/rezervacije" className="btn btn--lime btn--lg">
                Rezerviši teren <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <ul className="booking-list">
              {list.map((r) => {
                const free = canCancelFree(r);
                return (
                  <li key={r.id} className="booking">
                    <div className="booking__date">
                      <span>{fmtDate(r.date, { day: 'numeric' })}</span>
                      <em>{fmtDate(r.date, { month: 'short' })}</em>
                    </div>
                    <div className="booking__info">
                      <strong>
                        Teren {r.court} · {hh(r.hour)}–{hh(r.hour + 1)}
                      </strong>
                      <span>{fmtDate(r.date)}</span>
                    </div>
                    {tab === 'upcoming' && (
                      <div className="booking__act">
                        {free ? (
                          <button className="btn btn--ghost btn--sm" onClick={() => setToCancel(r)}>
                            Otkaži
                          </button>
                        ) : (
                          <span className="tag" title="Manje od 24 h do termina">
                            &lt; 24 h · pozovite klub
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <aside className="profile__side">
          <div className="side-card">
            <h3>Pravilo otkazivanja</h3>
            <p>Rezervaciju možete otkazati bez naknade najkasnije 24 h pre početka termina. Kasnije otkazivanje dogovorite direktno sa klubom.</p>
            <p className="fineprint">U demo verziji se ne naplaćuju naknade.</p>
            <a href={CLUB.phoneHref} className="link-arrow">
              <Icon name="phone" size={18} /> {CLUB.phone}
            </a>
          </div>
          <div className="side-card">
            <h3>Nalog</h3>
            <DemoNote>Demo nalog sačuvan samo u ovom pregledaču. Vidite isključivo svoje rezervacije.</DemoNote>
            <button
              className="btn btn--ghost btn--block"
              onClick={() => {
                logout();
                toast('Odjavljeni ste.');
                navigate('/');
              }}
            >
              <Icon name="logout" /> Odjavi se
            </button>
          </div>
        </aside>
      </div>

      <Modal open={!!toCancel} onClose={() => setToCancel(null)} title="Otkazati rezervaciju?">
        {toCancel && (
          <>
            <p className="lead">
              Teren {toCancel.court} · {hh(toCancel.hour)}–{hh(toCancel.hour + 1)}, {fmtDate(toCancel.date)}.
            </p>
            <p className="muted">Otkazivanje je bez naknade jer je do termina više od 24 h.</p>
            <div className="row-gap">
              <button className="btn btn--danger btn--lg" onClick={doCancel}>
                Da, otkaži
              </button>
              <button className="btn btn--ghost btn--lg" onClick={() => setToCancel(null)}>
                Zadrži termin
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
