# Valmispohja

Free Finnish document templates (resignation letter, lease termination, power of attorney, car sale contract, consumer complaint). Fill in a form, preview the document live, print or save as PDF. Everything runs in the browser; nothing is sent anywhere.

- Templates live in `src/docs.js`. Add a new document by adding an entry there.
- `node build.js [siteUrl]` builds static pages into `dist/` (one SEO page per document, plus sitemap and robots.txt when a site URL is given).
- Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
