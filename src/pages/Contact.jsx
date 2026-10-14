import { CLUB, MAPS_EMBED, MAPS_DIRECTIONS } from '../data.js';
import { Icon, SectionLabel, MapFrame } from '../components/ui.jsx';
import { DemoForm, validators } from '../components/Forms.jsx';

const FIELDS = [
  { name: 'name', label: 'Ime i prezime', required: true, autoComplete: 'name', validate: validators.min(2) },
  { name: 'contact', label: 'E-mail ili telefon', required: true, validate: validators.contact },
  { name: 'topic', label: 'Tema', type: 'select', options: ['Rezervacija terena', 'Škola tenisa', 'Liga', 'Turniri', 'Ostalo'] },
  { name: 'msg', label: 'Poruka', type: 'textarea', required: true, validate: validators.min(10) },
];

export default function Contact() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <SectionLabel>Kontakt</SectionLabel>
          <h1 className="display-1">Tu smo.</h1>
          <p className="lead">Svaki dan od 07:00 do 23:00, u Gramšijevoj 11 na Novom Beogradu.</p>
        </div>
      </section>

      <section className="contact">
        <div className="container contact__grid">
          <div className="contact__cards">
            <a href={CLUB.phoneHref} className="contact-card contact-card--lime">
              <Icon name="phone" size={26} />
              <span className="contact-card__k">Telefon</span>
              <strong>{CLUB.phone}</strong>
              <span className="contact-card__go">
                Pozovi <Icon name="arrow" size={18} />
              </span>
            </a>
            <a href={CLUB.emailHref} className="contact-card">
              <Icon name="mail" size={26} />
              <span className="contact-card__k">E-mail</span>
              <strong>{CLUB.email}</strong>
              <span className="contact-card__go">
                Piši <Icon name="arrow" size={18} />
              </span>
            </a>
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer" className="contact-card">
              <Icon name="pin" size={26} />
              <span className="contact-card__k">Adresa</span>
              <strong>
                {CLUB.street}, {CLUB.city}
              </strong>
              <span className="contact-card__go">
                Uputstva <Icon name="arrowUpRight" size={18} />
              </span>
            </a>
            <div className="contact-card contact-card--static">
              <Icon name="clock" size={26} />
              <span className="contact-card__k">Radno vreme</span>
              <strong>Svaki dan, 07:00–23:00</strong>
              <span className="muted">Objavljeno radno vreme kluba</span>
            </div>
          </div>
          <div className="contact__form">
            <h2 className="display-3">Pošalji poruku</h2>
            <DemoForm fields={FIELDS} submitLabel="Pošalji poruku" successTitle="Hvala! Poruka je zabeležena (demo)." />
          </div>
        </div>
        <div className="container">
          <div className="contact__map">
            <MapFrame />
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer" className="btn btn--lime contact__map-btn">
              <Icon name="pin" /> Otvori u mapama
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
