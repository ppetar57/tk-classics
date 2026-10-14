# TK Classics — V1 prototip

Vite + React 18 + React Router. Bez backenda: nalozi, rezervacije i forme su **demo** (localStorage, samo u ovom pregledaču).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produkcijski build u dist/
```

Vercel: framework "Vite", build `npm run build`, output `dist` (SPA rewrites u `vercel.json`).

- Logo: `public/images/logo-light.webp` (tamna slova, za svetlu pozadinu) i `logo-dark.webp` (original).
- Tereni: `public/images/courts/court-{1,2,3}.webp`, mapirani po ID-u u `src/data.js` (`COURT_IMAGES`).
  Stilizovani renderi iz `scripts/render-courts.py`, nacrtani prema satelitskim snimcima — nisu fotografije.
  Zamenite fajlove istog imena ako dobijete AI-generisane ili prave fotografije.
- Fotografije (Unsplash) se učitavaju u runtime-u, uz dizajnirani fallback; zamenite ID-jeve u `PHOTOS` pravim fotografijama kluba.
