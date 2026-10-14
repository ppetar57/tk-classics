// VITE_ARTIFACT=1 builds a self-contained preview (in-memory routing, relative assets, no map embed).
export const ARTIFACT = import.meta.env.VITE_ARTIFACT === '1';
export const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '');
