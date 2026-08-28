# Pro Sound Office

React rebuild of the Pro Sound Office site, replacing the Wix original. Static
output, so it hosts free on Cloudflare Pages, Netlify or GitHub Pages.

**Stack:** Vite · React 19 · TypeScript · React Router · Tailwind CSS v4

---

## Quick start

```bash
npm install
cp .env.example .env      # then fill in the two keys, see below
npm run dev
```

`npm run dev` and `npm run build` both run `npm run data` first, so the
generated JSON in `src/data/` is never stale, which is why it isn't committed.

The mirrored product shots in `public/images/products/` **are** committed, so a
fresh clone and a host build both work offline. You only need `npm run images`
to pull in new or changed photos (`-- --force` to refetch everything).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run data` | Rebuild `src/data/*.json` and `public/sitemap.xml` from `data/*.csv` |
| `npm run images` | Refresh the 60 product shots in `public/images/products/` (`-- --force` to refetch all) |
| `npm run typecheck` | TypeScript, no emit |

## Configuration

Two environment variables, both in `.env` (see `.env.example`):

**`VITE_WEB3FORMS_KEY`** is the contact form endpoint. A static site has no
server, so the form posts to [Web3Forms](https://web3forms.com): enter
`info@prosoundoffice.com` there and a key arrives by email, no account needed.
Free tier is 250 submissions/month. Without a key the form renders a
mailto/phone fallback rather than failing silently.

**`VITE_DOWNLOADS_BASE_URL`** is where the product archives live, see below.
Without it the Downloads page still lists everything but disables the rows and
explains why.

Set both in your host's environment variables too, not just locally. Vite
inlines them at build time.

Contact details, nav items and the partner link live in `src/config.ts`.
Homepage and support copy lives in `src/content.ts`.

## The 1 GB of archives

`GroupDownloads/` holds 59 per-enclosure zips totalling ~1 GB, 14 of them over
25 MB. That does not fit free static hosting: Cloudflare Pages rejects files
over 25 MB and GitHub Pages caps a repo at 1 GB. So the directory is
**gitignored** and the archives are served from Cloudflare R2 instead.

They are already uploaded, under a `GroupDownloads/` prefix in the bucket. The
site just needs the public base URL of that folder:

```
VITE_DOWNLOADS_BASE_URL=https://pub-xxxx.r2.dev/GroupDownloads
```

No trailing slash. The Downloads page appends the filename, URL-encoded, so
`EVO 6E.zip` resolves to `.../GroupDownloads/EVO%206E.zip`. Until the variable
is set the page still lists every archive but disables the rows and says why.

To add or replace an archive, drop it in the bucket under the same prefix and
add the row to `data/GroupDownloads.csv`, then re-run `npm run data`. Anything
listed in that CSV but missing from the bucket will 404 rather than fail
visibly, so keep the two in step.

The local `GroupDownloads/` directory is still the only copy outside R2, so keep
it somewhere safe.

## Data pipeline

`data/*.csv` are the Wix CMS exports and remain the source of truth. Edit those,
run `npm run data`, and the site picks the changes up.
`scripts/build-data.mjs` resolves the relations between the 13 tables and cleans
the spreadsheet artifacts (stray tabs, Excel's leading apostrophe on `+5`,
newlines mid-cell). Things worth knowing about it:

- **`visible` controls the catalogue.** 5 of 11 ranges and 14 of 60 products are
  flagged visible; only those are listed. Everything else still has a working
  page and archive, it just isn't linked from a listing.
- **Crossover rows carry no order in the export.** They're sorted by high-pass
  frequency, which reproduces the low-to-high band order of the original site.
- **A few products are filed under two ranges.** Where both entries share a
  photo they're one product entered twice and get merged, with the union of
  their documents. Where the photos differ they're genuinely different
  enclosures (single vs. double Infrahorn) and both are kept. A product is
  addressed as `/products/<range>/<code>`, so their URLs don't clash.
- **Two crossovers were both called "RES 3 MKII".** They're now qualified by
  their lowest driver, e.g. `RES 3 MKII (21")`, so they can be told apart.
- The script fails loudly on unresolved slug collisions and prints an integrity
  report, so bad data can't slip through silently.

Product photos, technical drawings and the 269 manufacturer documents are all
Prismic-hosted. Photos are mirrored into the repo (~5 MB total) so the
site doesn't hotlink; drawings and documents stay remote so they always reflect
the current revision.

## Deploying

Build command `npm run build`, publish directory `dist`.

`public/_redirects` sends every path to `index.html`, which is what makes deep
links like `/products/compact/f101-2` work on a static host. Netlify and
Cloudflare Pages both honour it. On GitHub Pages you'd need the
`404.html` copy trick instead.

The site renders client-side, so crawlers see an empty shell on first load.
`sitemap.xml` and per-route titles are in place; if search visibility becomes
important, prerendering (`vite-plugin-prerender` or moving to a static-export
framework) is the next step.

## What changed from the Wix site

Deliberate differences, not omissions:

- **Contacts merged into Support.** One page with the contact details and the
  enquiry form; nav is now Products / Downloads / Crossovers / Support.
- **Footer rebuilt** around contact details. The old one had "Products" and
  "Our Partners" columns holding a single link each.
- **Blog section removed** from the homepage.
- **Copyright year** is computed, not hardcoded to 2024.
- **Homepage Products band** no longer repeats the Services paragraph verbatim
  (a copy-paste slip in the original); it uses the site's own "Audio Quality"
  lines, written for that spot.
- **Clean URLs.** The old dynamic pages were percent-encoded
  (`/crossovers/res-5-with-f121%2Ff221`); inch marks and ampersands are now
  spelled out (`/crossovers/res-3sh-eh-evo-with-15-inch-and-21-inch`).
- **Full lists.** The old Crossover Settings page showed only the first 12 of
  53 entries.
