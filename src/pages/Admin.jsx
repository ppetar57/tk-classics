import { useMemo, useState } from 'react';
import { COURTS, CLUB } from '../data.js';
import { getReservations, useStore, isAdminDemo, setAdminDemo, todayBelgrade, fmtDate, hh, isDemoBooked, isSeasonal, belgradeTs } from '../store.js';
import { Icon, DemoNote, SectionLabel } from '../components/ui.jsx';

const HOURS = Array.from({ length: CLUB.closeHour - CLUB.openHour }, (_, i) => CLUB.openHour + i);

export default function Admin() {
  const enabled = useStore(isAdminDemo);
  const all = useStore(getReservations);
  const [date, setDate] = useState('');
  const [court, setCourt] = useState('all');
  const today = todayBelgrade();

  const filtered = useMemo(
    () =>
      all
        .filter((r) => (!date || r.date === date) && (court === 'all' || r.court === +court))
        .sort((a, b) => belgradeTs(a.date, a.hour) - belgradeTs(b.date, b.hour)),
    [all, date, court]
  );

  if (!enabled)
    return (
      <section className="admin-gate">
        <div className="container admin-gate__inner">
          <span className="admin-gate__icon">
            <Icon name="grid" size={32} />
          </span>
          <SectionLabel>Demo admin</SectionLabel>
          <h1 className="display-2">Pregled za upravu kluba.</h1>
          <p className="lead muted">
            Prikaz koncepta administracije: rezervacije, zauzetost terena i filteri. Ovo je demonstracija proizvoda u pregledaču — nije zaštićen sistem i ne sadrži stvarne podatke kluba.
          </p>
          <button className="btn btn--lime btn--lg" onClick={() => setAdminDemo(true)}>
            Otvori demo admin prikaz <Icon name="arrow" />
          </button>
          <DemoNote>U produkciji pristup zahteva serversku autentifikaciju i uloge.</DemoNote>
        </div>
      </section>
    );

  const day = date || today;
  const usage = COURTS.map((c) => {
    const seasonal = HOURS.filter((h) => isSeasonal(day, c.id, h)).length;
    const sample = HOURS.filter((h) => !isSeasonal(day, c.id, h) && isDemoBooked(day, c.id, h)).length;
    const local = all.filter((r) => r.date === day && r.court === c.id && !isSeasonal(day, c.id, r.hour)).length;
    return { ...c, seasonal, sample, local, pct: Math.min(100, Math.round(((seasonal + sample + local) / HOURS.length) * 100)) };
  });
  const upcoming = all.filter((r) => belgradeTs(r.date, r.hour) > Date.now()).length;

  return (
    <div className="admin">
      <section className="admin__head">
        <div className="container admin__head-inner">
          <div>
            <SectionLabel>Demo admin</SectionLabel>
            <h1 className="display-2">Kontrolna tabla</h1>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => setAdminDemo(false)}>
            Izađi iz admin prikaza
          </button>
        </div>
      </section>
      <div className="container admin__body">
        <DemoNote className="demo-note--strong">Demo podaci: lokalne rezervacije iz ovog pregledača + simulirana zauzetost. Nije povezano sa evidencijom kluba.</DemoNote>
        <div className="kpis">
          <div className="kpi">
            <span>Lokalne demo rezervacije</span>
            <strong>{all.length}</strong>
          </div>
          <div className="kpi">
            <span>Predstojeće</span>
            <strong>{upcoming}</strong>
          </div>
          <div className="kpi">
            <span>Tereni</span>
            <strong>3</strong>
          </div>
          <div className="kpi">
            <span>Radno vreme</span>
            <strong>07–23</strong>
          </div>
        </div>

        <div className="admin__panel">
          <h2 className="admin__h">Zauzetost · {fmtDate(day)}</h2>
          <div className="usage">
            {usage.map((u) => (
              <div key={u.id} className="usage__row">
                <span className="usage__name">{u.name}</span>
                <div className="usage__bar" role="img" aria-label={`${u.name}: ${u.pct}% zauzeto`}>
                  <span style={{ width: `${u.pct}%` }} />
                </div>
                <span className="usage__pct">{u.pct}%</span>
                <span className="usage__sub">{u.seasonal} sezonskih</span>
              </div>
            ))}
          </div>
          <div className="heat" aria-label="Mapa zauzetosti po satima">
            <div className="heat__row heat__row--head">
              <span />
              {HOURS.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            {COURTS.map((c) => (
              <div key={c.id} className="heat__row">
                <span>T{c.id}</span>
                {HOURS.map((h) => {
                  const local = all.some((r) => r.date === day && r.court === c.id && r.hour === h);
                  const seasonal = isSeasonal(day, c.id, h);
                  const sample = isDemoBooked(day, c.id, h);
                  return <span key={h} className={`heat__cell ${local ? 'is-local' : seasonal ? 'is-seasonal' : sample ? 'is-sample' : ''}`} title={`T${c.id} ${hh(h)}${seasonal ? ' · sezonski' : ''}`} />;
                })}
              </div>
            ))}
            <p className="legend">
              <i className="lg lg--sel" /> Demo rezervacija korisnika <i className="lg lg--seasonal" /> Sezonski termin <i className="lg lg--taken" /> Simulirano zauzeto <i className="lg lg--free" /> Slobodno
            </p>
          </div>
        </div>

        <div className="admin__panel">
          <div className="admin__filters">
            <h2 className="admin__h">Rezervacije</h2>
            <label className="field field--inline">
              <span className="field__label">Datum</span>
              <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="field field--inline">
              <span className="field__label">Teren</span>
              <select className="input" value={court} onChange={(e) => setCourt(e.target.value)}>
                <option value="all">Svi tereni</option>
                {COURTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            {(date || court !== 'all') && (
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setDate('');
                  setCourt('all');
                }}
              >
                Poništi filtere
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <p className="empty-inline">Nema demo rezervacija za izabrane filtere. Napravite rezervaciju na stranici Rezervacije.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Termin</th>
                    <th>Teren</th>
                    <th>Demo korisnik</th>
                    <th>Kreirano</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{fmtDate(r.date, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                      <td>
                        {hh(r.hour)}–{hh(r.hour + 1)}
                      </td>
                      <td>Teren {r.court}</td>
                      <td>{r.name}</td>
                      <td className="muted">{new Date(r.createdAt).toLocaleString('sr-Latn-RS', { timeZone: 'Europe/Belgrade', dateStyle: 'short', timeStyle: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
