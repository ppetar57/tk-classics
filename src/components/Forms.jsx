import { useState } from 'react';
import { CLUB } from '../data.js';
import { Icon, DemoNote } from './ui.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s/-]{5,}$/;

/**
 * Generic demo form. fields: [{ name, label, type, required, options, validate }]
 * Simulated submission — nothing is sent to the club.
 */
export function DemoForm({ fields, submitLabel, successTitle, onDone }) {
  const init = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [v, setV] = useState(init);
  const [errs, setErrs] = useState({});
  const [state, setState] = useState('idle');

  function submit(e) {
    e.preventDefault();
    const er = {};
    for (const f of fields) {
      const val = String(v[f.name]).trim();
      if (f.required && !val) er[f.name] = 'Obavezno polje.';
      else if (val && f.validate) {
        const m = f.validate(val);
        if (m) er[f.name] = m;
      }
    }
    setErrs(er);
    if (Object.keys(er).length) {
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setState('sending');
    setTimeout(() => setState('done'), 700);
  }

  if (state === 'done')
    return (
      <div className="form-success" role="status">
        <span className="form-success__icon">
          <Icon name="check" size={28} />
        </span>
        <h3>{successTitle}</h3>
        <DemoNote>Ovo je demo forma — poruka NIJE poslata klubu. Za stvarni upit pozovite {CLUB.phone} ili pišite na {CLUB.email}.</DemoNote>
        <div className="row-gap">
          <a href={CLUB.phoneHref} className="btn btn--lime">
            <Icon name="phone" /> Pozovi klub
          </a>
          <a href={CLUB.emailHref} className="btn btn--ghost">
            <Icon name="mail" /> Pošalji e-mail
          </a>
          {onDone && (
            <button className="btn btn--ghost" onClick={onDone}>
              Zatvori
            </button>
          )}
        </div>
      </div>
    );

  return (
    <form className="form" onSubmit={submit} noValidate>
      {fields.map((f) => {
        const common = {
          id: `f-${f.name}`,
          className: 'input',
          value: v[f.name],
          onChange: (e) => setV({ ...v, [f.name]: e.target.value }),
          'aria-invalid': !!errs[f.name],
          'aria-describedby': errs[f.name] ? `f-${f.name}-err` : undefined,
        };
        return (
          <label key={f.name} className={`field ${errs[f.name] ? 'has-error' : ''} ${f.half ? 'field--half' : ''}`} htmlFor={common.id}>
            <span className="field__label">
              {f.label}
              {!f.required && <em> (opciono)</em>}
            </span>
            {f.type === 'textarea' ? (
              <textarea rows={4} {...common} />
            ) : f.type === 'select' ? (
              <select {...common}>
                <option value="">Izaberite…</option>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input type={f.type || 'text'} autoComplete={f.autoComplete} inputMode={f.inputMode} {...common} />
            )}
            {errs[f.name] && (
              <span className="field__error" id={`f-${f.name}-err`}>
                {errs[f.name]}
              </span>
            )}
          </label>
        );
      })}
      <DemoNote>Demo forma — poruka se ne šalje klubu.</DemoNote>
      <button className="btn btn--lime btn--lg btn--block" disabled={state === 'sending'}>
        {state === 'sending' ? 'Slanje…' : submitLabel} <Icon name="arrow" />
      </button>
    </form>
  );
}

export const validators = {
  contact: (val) => (EMAIL_RE.test(val) || PHONE_RE.test(val) ? '' : 'Unesite ispravan e-mail ili broj telefona.'),
  email: (val) => (EMAIL_RE.test(val) ? '' : 'Unesite ispravnu e-mail adresu.'),
  age: (val) => (/^\d{1,2}$/.test(val) && +val >= 3 && +val <= 18 ? '' : 'Unesite uzrast od 3 do 18 godina.'),
  min: (n) => (val) => (val.length >= n ? '' : `Unesite najmanje ${n} karaktera.`),
};
