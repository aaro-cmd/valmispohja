// Builds static pages into dist/: a front page plus one SEO page per document.
// Usage: node build.js [siteUrl]
const fs = require('fs');
const path = require('path');
const { DOCS } = require('./src/docs.js');

const SITE_NAME = 'Valmispohja';
const SITE_URL = (process.argv[2] || process.env.SITE_URL || '').replace(/\/$/, '');
const out = path.join(__dirname, 'dist');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page({ title, description, slug, body, prefix, jsonLd }) {
  const canonical = SITE_URL ? `<link rel="canonical" href="${SITE_URL}/${slug ? slug + '/' : ''}">` : '';
  return `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${canonical}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="stylesheet" href="${prefix}style.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body${slug ? ` data-slug="${slug}"` : ''}>
<header><a class="brand" href="${prefix}">${SITE_NAME}</a></header>
<main>
${body}
</main>
<footer>
<p>${SITE_NAME} tarjoaa ilmaisia asiakirjapohjoja. Tietoja ei lähetetä eikä tallenneta mihinkään: kaikki tapahtuu omassa selaimessasi.</p>
<p>Pohjat ovat yleisiä malleja eivätkä korvaa juridista neuvontaa. Tarkista aina oma sopimuksesi ja tilanteesi.</p>
</footer>
${slug ? `<script src="${prefix}docs.js"></script><script src="${prefix}app.js"></script>` : ''}
</body>
</html>
`;
}

function docPage(doc) {
  const faq = doc.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n');
  const others = DOCS.filter(d => d !== doc).map(d => `<li><a href="../${d.slug}/">${esc(d.title)}</a></li>`).join('');
  const body = `
<h1>${esc(doc.h1)}</h1>
<p class="intro">${esc(doc.intro)}</p>
<div class="grid">
  <form id="form" class="card" autocomplete="off" onsubmit="return false"></form>
  <section class="card">
    <div class="actions">
      <button id="print" type="button">Tulosta tai tallenna PDF</button>
      <button id="copy" type="button" class="secondary">Kopioi teksti</button>
    </div>
    <pre id="preview"></pre>
  </section>
</div>
<p class="note no-print">Vinkki: valitse tulostusikkunassa "Tallenna PDF-tiedostona", niin saat PDF:n sähköpostiin liitettäväksi.</p>
<section class="faq no-print">
<h2>Usein kysyttyä</h2>
${faq}
</section>
<section class="no-print"><h2>Muut pohjat</h2><ul>${others}</ul></section>`;
  return page({
    title: `${doc.title} – ilmainen pohja | ${SITE_NAME}`,
    description: doc.metaDescription,
    slug: doc.slug,
    prefix: '../',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: doc.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  });
}

function indexPage() {
  const list = DOCS.map(d => `<li class="card"><a href="${d.slug}/"><strong>${esc(d.title)}</strong>${esc(d.metaDescription)}</a></li>`).join('\n');
  return page({
    title: `${SITE_NAME} – ilmaiset asiakirjapohjat suomeksi`,
    description: 'Ilmaiset suomenkieliset asiakirjapohjat: irtisanomisilmoitus, vuokrasopimuksen irtisanominen, valtakirja, auton kauppakirja ja reklamaatio. Täytä, esikatsele ja tallenna PDF.',
    slug: '',
    prefix: '',
    body: `
<h1>Ilmaiset asiakirjapohjat suomeksi</h1>
<p class="intro">Täytä lomake, näe valmis asiakirja heti ja tallenna se PDF:ksi. Ei rekisteröitymistä, eikä tietojasi tallenneta mihinkään.</p>
<ul class="doclist">
${list}
</ul>`,
  });
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['style.css', 'app.js', 'docs.js']) fs.copyFileSync(path.join(__dirname, 'src', f), path.join(out, f));
fs.writeFileSync(path.join(out, 'index.html'), indexPage());
for (const doc of DOCS) {
  fs.mkdirSync(path.join(out, doc.slug), { recursive: true });
  fs.writeFileSync(path.join(out, doc.slug, 'index.html'), docPage(doc));
}
if (SITE_URL) {
  const urls = ['', ...DOCS.map(d => d.slug + '/')].map(u => `<url><loc>${SITE_URL}/${u}</loc></url>`).join('');
  fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}
console.log(`Built ${DOCS.length + 1} pages into dist/`);
