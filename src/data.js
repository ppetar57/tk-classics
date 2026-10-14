import { asset } from './env.js';

// Verified public club information (source: tkclassics.rs, as supplied by the club).
export const CLUB = {
  name: 'Teniski klub Classics',
  short: 'TK Classics',
  street: 'Gramšijeva 11',
  city: 'Novi Beograd, Beograd',
  country: 'Srbija',
  phone: '+381 63 201 813',
  phoneHref: 'tel:+38163201813',
  email: 'tkclassics@gmail.com',
  emailHref: 'mailto:tkclassics@gmail.com',
  hours: 'Svaki dan, 07:00–23:00',
  openHour: 7,
  closeHour: 23,
  website: 'https://www.tkclassics.rs/',
  mapsQuery: 'Gramšijeva 11, Novi Beograd, Beograd, Serbia',
};

export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(CLUB.mapsQuery)}&z=16&output=embed`;
export const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CLUB.mapsQuery)}`;

// Club-reported figures (as published on the official website).
export const STATS = [
  { value: 2000, suffix: '+', label: 'dece je prošlo kroz našu školu tenisa' },
  { value: 200, suffix: '+', label: 'organizovanih turnira' },
  { value: 4000, suffix: '+', label: 'dece od 5 do 18 godina učestvovalo je na turnirima' },
];

export const COURTS = [
  { id: 1, name: 'Teren 1' },
  { id: 2, name: 'Teren 2' },
  { id: 3, name: 'Teren 3' },
];

// Aerial court photos, keyed by explicit court ID (never by array position).
// Crops of the supplied triptych /images/courts/courts-aerial.png (left = 1, middle = 2, right = 3).
export const COURTS_AERIAL = asset('/images/courts/courts-aerial.webp');
export const COURT_IMAGES = {
  1: { full: asset('/images/courts/court-1.webp'), sm: asset('/images/courts/court-1-sm.webp') },
  2: { full: asset('/images/courts/court-2.webp'), sm: asset('/images/courts/court-2-sm.webp') },
  3: { full: asset('/images/courts/court-3.webp'), sm: asset('/images/courts/court-3-sm.webp') },
};

export const NAV = [
  { to: '/rezervacije', label: 'Tereni / Rezervacije' },
  { to: '/pocetna', label: 'Početna' },
  { to: '/skola-tenisa', label: 'Škola tenisa' },
  { to: '/liga', label: 'Liga' },
  { to: '/players', label: 'Igrači' },
  { to: '/turniri', label: 'Turniri' },
  { to: '/o-klubu', label: 'O klubu' },
  { to: '/kontakt', label: 'Kontakt' },
];

// Tennis photography (Unsplash). Each <Photo> falls back to an art-directed court graphic if a
// remote image fails, so a broken image is never shown. Replace with genuine club photos when available.
export const PHOTOS = {
  hero: '1554068865-24cecd4e34b8',
  player: '1622279457486-62dcc4a431d6',
  court: '1595435934249-5df7ed86e1c0',
  action: '1542144582-1ba00456b5e3',
  ball: '1530915365347-e35b749a0381',
};

// Club players (photos supplied by the club).
export const PLAYERS = [
  {
    slug: 'zoran-jovanovic',
    name: 'Zoran Jovanović',
    tag: '#1',
    title: 'Najverniji igrač Classicsa',
    photo: asset('/images/players/zoran-jovanovic.webp'),
  },
];

// ---------- DEMO DATA (sample only, not real club results) ----------
export const DEMO_LEAGUE = [
  { name: 'Igrač A. (demo)', p: 8, w: 7, l: 1, sets: '15:4', pts: 21, form: ['W', 'W', 'L', 'W', 'W'] },
  { name: 'Igrač B. (demo)', p: 8, w: 6, l: 2, sets: '13:6', pts: 18, form: ['W', 'L', 'W', 'W', 'W'] },
  { name: 'Igrač C. (demo)', p: 8, w: 5, l: 3, sets: '11:8', pts: 15, form: ['L', 'W', 'W', 'L', 'W'] },
  { name: 'Igrač D. (demo)', p: 8, w: 4, l: 4, sets: '9:9', pts: 12, form: ['W', 'L', 'L', 'W', 'L'] },
  { name: 'Igrač E. (demo)', p: 8, w: 3, l: 5, sets: '8:11', pts: 9, form: ['L', 'W', 'L', 'L', 'W'] },
  { name: 'Igrač F. (demo)', p: 8, w: 2, l: 6, sets: '5:13', pts: 6, form: ['L', 'L', 'W', 'L', 'L'] },
  { name: 'Igrač G. (demo)', p: 8, w: 1, l: 7, sets: '3:14', pts: 3, form: ['L', 'L', 'L', 'W', 'L'] },
];

export const DEMO_MATCHES = [
  { a: 'Igrač A.', b: 'Igrač C.', when: 'Subota · 10:00', court: 'Teren 1', status: 'zakazan' },
  { a: 'Igrač B.', b: 'Igrač D.', when: 'Subota · 12:00', court: 'Teren 2', status: 'zakazan' },
  { a: 'Igrač E.', b: 'Igrač F.', when: 'Danas · 18:00', court: 'Teren 3', status: 'u toku' },
  { a: 'Igrač G.', b: 'Igrač A.', when: 'Prošle nedelje', court: 'Teren 1', status: 'završen', score: '2:6, 3:6' },
];

export const DEMO_TOURNAMENTS = [
  { title: 'Jesenji turnir mladih (primer)', cat: 'Uzrast 10–14', date: '—', status: 'Prijave otvorene', tone: 'open' },
  { title: 'Klupski kup Classics (primer)', cat: 'Rekreativci', date: '—', status: 'Uskoro', tone: 'soon' },
  { title: 'Zimski mini tenis (primer)', cat: 'Uzrast 5–9', date: '—', status: 'Uskoro', tone: 'soon' },
  { title: 'Letnji turnir juniora (primer)', cat: 'Uzrast 14–18', date: '—', status: 'Završen', tone: 'done' },
];
