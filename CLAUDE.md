# Phào Design — build guide

Static site for client Nguyễn Khánh Đan. **Zero dependencies**: a hand-written
generator (`build.mjs`, Node 18+) turns JSON content + HTML partials into `dist/`.
There is no `node_modules`, no framework, no bundler. Do not reach for one.

```
node build.mjs            # build once into dist/
node build.mjs --serve    # build, serve http://localhost:4318, rebuild on change
node build.mjs --serve --no-watch --port 4319   # second instance, just to look
```

Two watchers on one `dist/` race each other — a second instance needs `--no-watch`.

## Where things live

| Path | What it is |
|---|---|
| `content/site.json` | Brand, locales, nav, contact, endpoints, analytics |
| `content/{vi,en}/strings.json` | UI chrome: nav labels, buttons, footer, 404 |
| `content/{vi,en}/pages/*.json` | One file per page — **the copy and the section order** |
| `content/{vi,en}/projects/*.json` | One file per project, rendered at `/du-an/<slug>/` |
| `src/layouts/base.html` | The `<html>` shell, wraps every page |
| `src/templates/*.html` | `page` (just `{{{ sections }}}`), `project`, `404` |
| `src/partials/sections/*.html` | **One file per section type** — the markup |
| `src/partials/*.html` | header, footer, project-card |
| `static/css/main.css` | The entire stylesheet, one file, ~1150 lines |
| `static/js/main.js` | The entire script |
| `static/img/`, `static/files/` | Copied verbatim into `dist/` |

**Never edit `dist/`** — it is wiped and regenerated on every build, and gitignored.
**Never read or search `client-resources/`** — 31 MB of the client's source PDFs,
gitignored, not site source. Same for `static/files/portfolio2026.pdf` (15 MB).

## Which file do I change?

- Words, section order, whether a section shows → `content/{vi,en}/...` JSON
- Structure of a section's markup → `src/partials/sections/<type>.html`
- Appearance → `static/css/main.css`

Most tasks touch all three plus a second locale. Plan for that up front.

## The template engine

`build.mjs` supports **exactly five** constructs. Anything else is not available:

```
{{ path.to.value }}      escaped interpolation
{{{ path.to.value }}}    raw interpolation
{{> partials/name }}     include, may nest (max depth 12)
{{#if path}} … {{else}} … {{/if}}    also {{#unless}}
{{#each path}} … {{/each}}           this, @index, @first, @last
```

No helpers, no filters, no expressions, no comparisons. If markup needs a computed
value, compute it in `build.mjs` and put it in the context.

## Sections

A page's `sections[]` array drives everything. Each entry has a `type`, which maps
by filename to `src/partials/sections/<type>.html`. Unknown type = build error.

- `"visible": false` hides a section without deleting it.
- `"pinned": true` is a CMS hint only; the build does not read it.
- `.band-a` / `.band-b` backgrounds are assigned by **rendered position**, not by
  section identity, so reordering never puts two identical backgrounds together.
  Never hard-code a band in a partial — use `{{ band }}`.
- Keys starting with `_` (`_note`, `_sections`) are author notes. Not rendered.

**Adding a section type**: create `src/partials/sections/<type>.html`, add a
`/* ---------- <name> ---- */` block to `main.css`, add the entry to the page JSON in
**both** locales. No `build.mjs` change needed.

## Bilingual rules

Vietnamese is the default locale and sits at the root (`/du-an/`); English lives under
`/en/` (`/en/du-an/`). Slugs are Vietnamese in both locales — they are not translated.

`content/vi/` and `content/en/` must stay **structurally identical**: same page files,
same section types in the same order, same keys. A section present in one locale and
missing in the other is a bug, not a feature. Every content change is two files.

Vietnamese text is normalised to NFC on load, so precomposed vs. decomposed diacritics
never reach the templates. Do not hand-normalise.

## Images

Content names an image by **base path, no width and no extension**:

```json
"cardImage": "/img/projects/forti-halo/card"
```

The build scans `static/img/` for `card-<width>.webp` files, rewrites the key to the
largest, and adds a sibling `cardImageSet` with the full `srcset`. So a partial uses
`{{ this.cardImage }}` and `{{ this.cardImageSet }}` together. Any `/img/` value with
no matching files is collected and warned about at the end of the build — it would
otherwise render as a broken image on a page that "built successfully".

⚠️ That warning tells you to run `python tools/prepare-images.py`. **That script is not
on disk.** `tools/` is gitignored and currently holds only `extract-part4.py` and
`redact-pdfs.py`; `extract-images.py` and `prepare-images.py` are referenced by
`build.mjs` and `PLAN.md` but missing. Ask before assuming you can regenerate images.

## Deploy

Cloudflare static assets, no Worker (`wrangler.jsonc`). Cloudflare runs
`node build.mjs` itself on push, so `dist/` stays gitignored.

While `site.url` in `content/site.json` is empty, the build treats this as a preview:
no canonical/hreflang/og/sitemap, `robots.txt` Disallow, `X-Robots-Tag: noindex`.
Filling in the live origin (no trailing slash) switches all of it on at once.

The mail and OAuth Workers are separate deployments. Their URLs come from
`content/site.json` `endpoints` — **never hard-code either URL in markup.**

## Before starting work

Open questions that block real decisions are tracked in `PLAN.md` §8 (OPEN, needs Khoa)
and §9 (CLIENT, needs Đan). Check there before inventing an answer. `PLAN.md` §3 is the
page-by-page spec; §10 records decisions already made — don't relitigate them.
