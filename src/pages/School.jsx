import { useState } from 'react';
import { PHOTOS, CLUB } from '../data.js';
import { Photo, Reveal, Icon, Modal, SectionLabel, Counter } from '../components/ui.jsx';
import { DemoForm, validators } from '../components/Forms.jsx';

const STAGES = [
  { n: '01', title: 'Upoznavanje sa tenisom', text: 'Prvi kontakt sa reketom i lopticom kroz igru — osećaj za loptu, kretanje i radost igre.' },
  { n: '02', title: 'Tehnika i koordinacija', text: 'Pravilni udarci, rad nogu, ravnoteža i koordinacija — temelji na kojima se gradi igra.' },
  { n: '03', title: 'Ka takmičarskom tenisu', text: 'Za decu koja žele više: put ka turnirima i takmičarskom tenisu, uz klub koji je aktivni član TSB i TSS.' },
];

export const SCHOOL_FIELDS = [
  { name: 'parent', label: 'Ime roditelja / kontakt osobe', required: true, autoComplete: 'name', validate: validators.min(2) },
  { name: 'contact', label: 'E-mail ili telefon', required: true, autoComplete: 'email', validate: validators.contact, half: true },
  { name: 'age', label: 'Uzrast deteta', required: true, inputMode: 'numeric', validate: validators.age, half: true },
  { name: 'exp', label: 'Prethodno iskustvo u tenisu', type: 'select', options: ['Bez iskustva', 'Malo iskustva', 'Trenira tenis', 'Igra turnire'] },
  { name: 'msg', label: 'Poruka', type: 'textarea' },
];

export default function School() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className="page-hero page-hero--photo">
        <Photo id={PHOTOS.player} alt="Mladi teniser na treningu" eager position="center 30%" />
        <div className="page-hero__shade" />
        <div className="container page-hero__inner">
          <SectionLabel>Škola tenisa · 5–18 godina</SectionLabel>
          <h1 className="display-1">
            Škola
            <br />
            tenisa.
          </h1>
          <p className="lead">Programi za decu i mlade od 5 do 18 godina — od prvog udarca do takmičarskog tenisa.</p>
          <button className="btn btn--lime btn--xl" onClick={() => setOpen(true)}>
            Raspitaj se za školu tenisa <Icon name="arrow" />
          </button>
        </div>
      </section>

      <section className="school-stat">
        <div className="container school-stat__grid">
          <Reveal className="school-stat__num">
            <Counter value={2000} suffix="+" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-3">dece je prošlo kroz školu tenisa TK Classics.</h2>
            <p className="muted">Podatak koji objavljuje klub. Iskustvo u radu sa decom je u samom srcu kluba — iz godine u godinu, generacija za generacijom.</p>
          </Reveal>
        </div>
      </section>

      <section className="stages">
        <div className="container">
          <Reveal>
            <SectionLabel>Put kroz školu</SectionLabel>
            <h2 className="display-2">Tri koraka. Jedan pravac — napred.</h2>
          </Reveal>
          <ol className="stages__list">
            {STAGES.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 100} className="stage">
                <span className="stage__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2 className="display-2">Termini, grupe i cene?</h2>
            <p>Raspored i uslove škole najbolje ćete saznati direktno od kluba — pošaljite upit ili pozovite.</p>
          </div>
          <div className="row-gap">
            <button className="btn btn--dark btn--xl" onClick={() => setOpen(true)}>
              Raspitaj se <Icon name="arrow" />
            </button>
            <a href={CLUB.phoneHref} className="btn btn--outline-dark btn--xl">
              <Icon name="phone" /> {CLUB.phone}
            </a>
          </div>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Upit za školu tenisa">
        <DemoForm fields={SCHOOL_FIELDS} submitLabel="Pošalji upit" successTitle="Hvala! Upit je zabeležen (demo)." onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}
