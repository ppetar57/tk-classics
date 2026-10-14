import { Link } from 'react-router-dom';
import { Icon } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <section className="success">
      <div className="container success__inner">
        <p className="section-label">404 · Aut</p>
        <h1 className="display-1">Lopta je van terena.</h1>
        <p className="lead muted">Stranica koju tražite ne postoji.</p>
        <div className="row-gap row-gap--center">
          <Link to="/rezervacije" className="btn btn--lime btn--lg">
            Rezerviši teren <Icon name="arrow" />
          </Link>
          <Link to="/pocetna" className="btn btn--ghost btn--lg">
            Početna
          </Link>
        </div>
      </div>
    </section>
  );
}
