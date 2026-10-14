// Local demo state. NOT production-secure: everything lives in this browser's localStorage.
import { useEffect, useState } from 'react';
import { CLUB } from './data.js';

const TZ = 'Europe/Belgrade';
const K = { users: 'tk-demo-users', session: 'tk-demo-session', res: 'tk-demo-reservations', admin: 'tk-demo-admin' };

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new Event('tk-store'));
}

export function useStore(selector) {
  const [v, setV] = useState(selector);
  useEffect(() => {
    const on = () => setV(selector());
    window.addEventListener('tk-store', on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener('tk-store', on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return v;
}

// ---------- Time (Europe/Belgrade) ----------
function tzOffset(ts) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(new Date(ts))
      .map((x) => [x.type, x.value])
  );
  return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(ts / 1000) * 1000;
}
/** UTC timestamp for a Belgrade wall-clock date ("YYYY-MM-DD") and hour. */
export function belgradeTs(date, hour) {
  const [y, m, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, hour);
  return guess - tzOffset(guess - tzOffset(guess));
}
export function todayBelgrade(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 864e5);
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
}
export function fmtDate(date, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('sr-Latn-RS', { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
export const hh = (h) => `${String(h).padStart(2, '0')}:00`;

export function currentSeason(now = new Date()) {
  const [, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now).split('-').map(Number);
  const md = m * 100 + d;
  const summer = md >= 416 && md <= 1014;
  return summer
    ? { key: 'summer', label: 'Letnja sezona', range: '16. april – 14. oktobar' }
    : { key: 'winter', label: 'Zimska sezona', range: '15. oktobar – 15. april' };
}

// ---------- Auth (demo only) ----------
async function hash(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const norm = (e) => e.trim().toLowerCase();

export const getUsers = () => read(K.users, {});
export function getCurrentUser() {
  const email = read(K.session, null);
  const u = email && getUsers()[email];
  return u ? { email, name: u.name, phone: u.phone, createdAt: u.createdAt } : null;
}

export async function register({ name, email, phone, password }) {
  const users = getUsers();
  const key = norm(email);
  if (users[key]) throw new Error('Demo nalog sa ovom adresom već postoji na ovom uređaju.');
  const salt = crypto.getRandomValues(new Uint32Array(4)).join('-');
  users[key] = { name: name.trim(), phone: phone.trim(), salt, hash: await hash(password, salt), createdAt: Date.now() };
  write(K.users, users);
  write(K.session, key);
}
export async function login({ email, password }) {
  const key = norm(email);
  const u = getUsers()[key];
  if (!u || (await hash(password, u.salt)) !== u.hash) throw new Error('Pogrešan e-mail ili lozinka.');
  write(K.session, key);
}
export function logout() {
  write(K.session, null);
}

// ---------- Reservations (demo only) ----------
export const getReservations = () => read(K.res, []);

/** Deterministic sample occupancy, so the grid looks realistic. Not real club data. */
export function isDemoBooked(date, court, hour) {
  let h = 2166136261;
  for (const c of `${date}|${court}|${hour}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const peak = hour >= 17 && hour <= 20 ? 0.55 : hour <= 8 ? 0.2 : 0.3;
  return ((h >>> 0) % 1000) / 1000 < peak;
}

/**
 * Sample seasonal bookings: the same court and hour every week for the whole season
 * (a regular group or player renting a fixed slot). Repeats by weekday; changes with the season. Not real club data.
 */
export function isSeasonal(date, court, hour) {
  const [y, m, d] = date.split('-').map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 12));
  const key = `${currentSeason(noon).key}|${noon.getUTCDay()}|${court}|${hour}`;
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const p = hour >= 17 && hour <= 21 ? 0.3 : hour <= 9 ? 0.14 : 0.07;
  return ((h >>> 0) % 1000) / 1000 < p;
}

export function slotsFor(date, court) {
  const all = getReservations();
  const now = Date.now();
  const out = [];
  for (let h = CLUB.openHour; h < CLUB.closeHour; h++) {
    const own = all.find((r) => r.date === date && r.court === court && r.hour === h);
    const past = belgradeTs(date, h) <= now;
    let state = 'free';
    if (own) state = 'taken';
    else if (isSeasonal(date, court, h)) state = 'seasonal';
    else if (isDemoBooked(date, court, h)) state = 'taken';
    if (past) state = 'past';
    out.push({ hour: h, state, mine: own && own.email === read(K.session, null) });
  }
  return out;
}

export function createReservation({ date, court, hour }) {
  const user = getCurrentUser();
  if (!user) throw new Error('Prijavite se da biste rezervisali termin.');
  if (belgradeTs(date, hour) <= Date.now()) throw new Error('Termin je već prošao.');
  const all = getReservations();
  if (isSeasonal(date, court, hour)) throw new Error('Ovo je sezonski termin — rezervisan je svake nedelje tokom cele sezone.');
  if (all.some((r) => r.date === date && r.court === court && r.hour === hour) || isDemoBooked(date, court, hour))
    throw new Error('Ovaj termin je u međuvremenu zauzet. Izaberite drugi.');
  const r = { id: crypto.randomUUID(), email: user.email, name: user.name, date, court, hour, createdAt: Date.now() };
  write(K.res, [...all, r]);
  return r;
}

export const canCancelFree = (r) => belgradeTs(r.date, r.hour) - Date.now() >= 24 * 3600e3;

export function cancelReservation(id) {
  const user = getCurrentUser();
  const all = getReservations();
  const r = all.find((x) => x.id === id);
  if (!r || !user || r.email !== user.email) throw new Error('Možete otkazati samo svoje rezervacije.');
  if (!canCancelFree(r)) throw new Error('Manje od 24 h do termina — za otkazivanje kontaktirajte klub.');
  write(K.res, all.filter((x) => x.id !== id));
}

export const myReservations = () => {
  const u = getCurrentUser();
  return u ? getReservations().filter((r) => r.email === u.email) : [];
};

// Demo admin view flag (presentation only — no credentials, not a security boundary).
export const isAdminDemo = () => read(K.admin, false);
export const setAdminDemo = (v) => write(K.admin, v);
