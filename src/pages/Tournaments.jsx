import { useState } from 'react';
import { DEMO_TOURNAMENTS, PHOTOS, CLUB } from '../data.js';
import { Photo, Reveal, Icon, Modal, SectionLabel, DemoNote, Counter } from '../components/ui.jsx';
import { DemoForm, validators } from '../components/Forms.jsx';

const FIELDS = [
  { name: 'name', label: 'Ime i prezime', required: true, autoComplete: 'name', validate: validators.min(2) },
  { name: 'contact', label: 'E-mail ili telefon', required: true, validate: validators.contact },
  { name: 'cat', label: 'Kategorija', type: 'select', options: ['Deca 5–9', 'Deca 10–14', 'Juniori 14–18', 'Rekreativci', 'Ne znam još'] },
  { name: 'msg', label: 'Poruka', type: 'textarea' },
];

export default function Tournaments() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className="tour-hero">
        <div className="container tour-hero__grid">
          <div className="tour-hero__copy">
            <SectionLabel>Turniri</SectionLabel>
            <h1 className="display-1">Turniri.</h1>
            <p className="lead">Takmičenje je deo identiteta kluba. TK Classics je, prema podacima kluba, organizovao više od 200 turnira za decu i mlade.</p>
            <button className="btn btn--lime btn--xl" onClick={() => setOpen(true)}>
              Upit za turnir <Icon name="arrow" />
            </button>
          </div>
          <div className="tour-hero__photo">
            <Photo id={PHOTOS.action} alt="Teniser tokom meča" eager sizes="(min-width: 900px) 45vw, 100vw" />
            <div className="tour-hero__chip">
              <strong>
                <Counter value={4000} suffix="+" />
              </strong>
              <span>dece 5–18 na turnirima kluba</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tour-list">
        <div className="container">
          <div className="panel-head">
            <h2 className="display-2">Kalendar</h2>
            <span className="tag tag--demo">Primer · demo</span>
          </div>
          <DemoNote className="demo-note--strong">
            Turniri ispod su primeri rasporeda, ne stvarni događaji. Aktuelni kalendar turnira proverite u klubu: <a href={CLUB.phoneHref}>{CLUB.phone}</a>.
          </DemoNote>
          <div className="tour-cards">
            {DEMO_TOURNAMENTS.map((t, i) => (
              <Reveal key={t.title} delay={i * 80} className={`tour-card tour-card--${t.tone}`}>
                <span className="tour-card__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className={`status status--${t.tone}`}>
                  <i /> {t.status}
                </span>
                <h3>{t.title}</h3>
                <p className="muted">{t.cat}</p>
                <p className="tour-card__date">
                  <Icon name="calendar" size={16} /> Datum: proverite u klubu
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Upit za turnir">
        <DemoForm fields={FIELDS} submitLabel="Pošalji upit" successTitle="Hvala! Upit je zabeležen (demo)." onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}
