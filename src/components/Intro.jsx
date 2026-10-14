import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Icon } from './ui.jsx';

/** Black entry screen: the logo spins in, then one action leads to the booking page. */
export default function Intro({ onDone }) {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const btn = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => btn.current?.focus({ preventScroll: true }), 3300);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  function enter() {
    if (leaving) return;
    navigate('/rezervacije');
    window.scrollTo(0, 0);
    setLeaving(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(onDone, reduce ? 0 : 650);
  }

  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="TK Classics">
      <div className="intro__stage">
        <div className="intro__spin">
          <Logo variant="dark" className="intro__logo" />
        </div>
        <span className="intro__shadow" aria-hidden="true" />
      </div>
      <button ref={btn} className="btn btn--lime btn--xl intro__cta" onClick={enter}>
        Rezerviši teren <Icon name="arrow" />
      </button>
    </div>
  );
}
