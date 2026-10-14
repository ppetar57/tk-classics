// Builds a single-page preview for claude.ai Artifacts: JS + CSS inlined, images as relative files.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

execSync('npx vite build --base ./ --outDir dist-artifact --emptyOutDir', { stdio: 'inherit', env: { ...process.env, VITE_ARTIFACT: '1' } });
const dir = 'dist-artifact/assets/';
const files = readdirSync(dir);
const js = readFileSync(dir + files.find((f) => f.endsWith('.js')), 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(dir + files.find((f) => f.endsWith('.css')), 'utf8');

const html = `<title>TK Classics</title>
<meta name="description" content="Teniski klub Classics, Gramšijeva 11, Novi Beograd — V1 prototip sajta." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&display=swap" rel="stylesheet" />
<script>
  (function () {
    var r = document.documentElement, t = null;
    try { t = localStorage.getItem('tk-theme'); } catch (e) {}
    if (!t) t = r.getAttribute('data-theme');
    if (!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    r.setAttribute('data-theme', t);
  })();
</script>
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
writeFileSync('dist-artifact/tk-classics.html', html);
console.log('artifact page:', (html.length / 1024).toFixed(0) + ' KB');
