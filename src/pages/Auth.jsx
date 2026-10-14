import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { login, register, getCurrentUser, useStore } from '../store.js';
import { Logo, Icon, Photo, DemoNote, useToast } from '../components/ui.jsx';
import { PHOTOS } from '../data.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function AuthShell({ title, sub, children }) {
  return (
    <section className="auth">
      <div className="auth__visual">
        <Photo id={PHOTOS.ball} alt="Teniska loptica na terenu" sizes="50vw" />
        <div className="auth__visual-shade" />
        <div className="auth__visual-copy">
          <Logo variant="dark" className="auth__logo" />
          <p>Tvoj teren. Tvoj ritam. Tvoj sledeći poen.</p>
        </div>
      </div>
      <div className="auth__panel">
        <div className="auth__form-wrap">
          <Logo className="auth__logo-mobile" />
          <h1 className="display-3">{title}</h1>
          <p className="muted">{sub}</p>
          <DemoNote>Demo nalog — čuva se samo u ovom pregledaču. Nije stvarni klupski nalog i nije bezbedan za produkciju. Ne koristite pravu lozinku.</DemoNote>
          {children}
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, id, ...props }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      <input id={id} className="input" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      {error && (
        <span className="field__error" id={`${id}-err`}>
          {error}
        </span>
      )}
    </label>
  );
}

function useAfterAuth() {
  const navigate = useNavigate();
  const { state } = useLocation();
  return () => navigate(state?.from || '/profil', { replace: true });
}

export function Login() {
  const user = useStore(getCurrentUser);
  const after = useAfterAuth();
  const toast = useToast();
  const { state } = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  if (user && !busy) return <Navigate to={state?.from || '/profil'} replace />;

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!EMAIL_RE.test(f.email)) er.email = 'Unesite ispravnu e-mail adresu.';
    if (!f.password) er.password = 'Unesite lozinku.';
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await login(f);
      toast('Dobrodošli nazad.');
      after();
    } catch (x) {
      setErrs({ form: x.message });
      setBusy(false);
    }
  }
  return (
    <AuthShell title="Prijava" sub="Prijavite se da biste rezervisali teren i pratili svoje termine.">
      <form className="form" onSubmit={submit} noValidate>
        <Field id="email" label="E-mail" type="email" autoComplete="email" value={f.email} error={errs.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <Field id="password" label="Lozinka" type="password" autoComplete="current-password" value={f.password} error={errs.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {errs.form && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={18} /> {errs.form}
          </p>
        )}
        <button className="btn btn--lime btn--lg btn--block" disabled={busy}>
          {busy ? 'Prijavljivanje…' : 'Prijavi se'} <Icon name="arrow" />
        </button>
        <p className="form__alt">
          Nemate demo nalog?{' '}
          <Link to="/registracija" state={state}>
            Registrujte se
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const user = useStore(getCurrentUser);
  const after = useAfterAuth();
  const toast = useToast();
  const { state } = useLocation();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', terms: false });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  if (user && !busy) return <Navigate to={state?.from || '/profil'} replace />;

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Unesite ime i prezime.';
    if (!EMAIL_RE.test(f.email)) er.email = 'Unesite ispravnu e-mail adresu.';
    if (f.phone && !/^[+\d][\d\s/-]{5,}$/.test(f.phone)) er.phone = 'Unesite ispravan broj telefona.';
    if (f.password.length < 8) er.password = 'Lozinka mora imati najmanje 8 karaktera.';
    if (!f.terms) er.terms = 'Potvrdite da razumete da je ovo demo nalog.';
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await register(f);
      toast('Demo nalog je kreiran.');
      after();
    } catch (x) {
      setErrs({ form: x.message });
      setBusy(false);
    }
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <AuthShell title="Registracija" sub="Napravite demo nalog i isprobajte rezervacije.">
      <form className="form" onSubmit={submit} noValidate>
        <Field id="name" label="Ime i prezime" autoComplete="name" value={f.name} error={errs.name} onChange={set('name')} />
        <Field id="email" label="E-mail" type="email" autoComplete="email" value={f.email} error={errs.email} onChange={set('email')} />
        <Field id="phone" label="Telefon (opciono)" type="tel" autoComplete="tel" value={f.phone} error={errs.phone} onChange={set('phone')} />
        <Field id="password" label="Lozinka (min. 8 karaktera)" type="password" autoComplete="new-password" value={f.password} error={errs.password} onChange={set('password')} />
        <label className={`check ${errs.terms ? 'has-error' : ''}`}>
          <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} />
          <span>Razumem da je ovo demo nalog sačuvan samo u ovom pregledaču.</span>
        </label>
        {errs.terms && <span className="field__error">{errs.terms}</span>}
        {errs.form && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={18} /> {errs.form}
          </p>
        )}
        <button className="btn btn--lime btn--lg btn--block" disabled={busy}>
          {busy ? 'Kreiranje…' : 'Napravi demo nalog'} <Icon name="arrow" />
        </button>
        <p className="form__alt">
          Već imate nalog?{' '}
          <Link to="/prijava" state={state}>
            Prijavite se
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export { Field, EMAIL_RE };
