/*
 * Phao Design site generator.
 *
 * No dependencies. Node 18+ only.
 *
 *   node build.mjs          build once into dist/
 *   node build.mjs --serve  build, then serve dist/ and rebuild on change
 *
 * Content lives in content/. Markup lives in src/. Nothing else is read.
 */

import { readFile, writeFile, mkdir, rm, cp, readdir, stat } from 'node:fs/promises';
import { existsSync, readdirSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIRS = {
  content: path.join(ROOT, 'content'),
  src: path.join(ROOT, 'src'),
  static: path.join(ROOT, 'static'),
  dist: path.join(ROOT, 'dist'),
};

/* ------------------------------------------------------------------ *
 * Template engine
 *
 * Supports exactly five things, deliberately:
 *   {{ path.to.value }}      escaped interpolation
 *   {{{ path.to.value }}}    raw interpolation
 *   {{> partial/name }}      include, may nest
 *   {{#if path}} … {{else}} … {{/if}}      also #unless
 *   {{#each path}} … {{/each}}             this, @index, @first, @last
 * ------------------------------------------------------------------ */

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function resolvePath(expr, ctx) {
  const key = expr.trim();
  if (key === 'this' || key === '.') return ctx.this;
  if (key.startsWith('@')) return ctx[key];
  let value = key.startsWith('this.') ? ctx.this : ctx;
  const parts = (key.startsWith('this.') ? key.slice(5) : key).split('.');
  for (const part of parts) {
    if (value == null) return undefined;
    value = value[part];
  }
  return value;
}

const truthy = (v) => !(v == null || v === false || v === '' || (Array.isArray(v) && v.length === 0));

// Finds the {{/tag}} matching the {{#tag}} that ends at `from`, and the {{else}}
// belonging to it, if any. Depth counts every block type, not just this one, so an
// {{else}} inside a nested {{#if}} is never mistaken for this block's own.
const BLOCK_TOKEN = /\{\{(#(?:if|unless|each)\s[^}]*?|\/(?:if|unless|each)|else)\}\}/g;

function findBlockEnd(tpl, tag, from) {
  BLOCK_TOKEN.lastIndex = from;
  let depth = 1;
  let elseAt = -1;
  let match;
  while ((match = BLOCK_TOKEN.exec(tpl))) {
    const body = match[1];
    if (body.startsWith('#')) {
      depth += 1;
    } else if (body.startsWith('/')) {
      depth -= 1;
      if (depth === 0) {
        const closing = body.slice(1);
        if (closing !== tag) throw new Error(`expected {{/${tag}}} but found {{/${closing}}}`);
        return { elseAt, closeStart: match.index, closeEnd: BLOCK_TOKEN.lastIndex };
      }
    } else if (body === 'else' && depth === 1 && elseAt === -1) {
      elseAt = match.index;
    }
  }
  throw new Error(`unclosed {{#${tag}}} block`);
}

// Walks the template, interpolating each literal run against the context that is
// actually in scope there. Interpolating in one pass at the end would evaluate
// {{ this.x }} outside the {{#each}} that gave `this` its meaning.
function renderTree(tpl, ctx) {
  const open = /\{\{#(if|unless|each)\s+([^}]+?)\}\}/;
  const match = open.exec(tpl);
  if (!match) return interpolate(tpl, ctx);

  const [full, tag, expr] = match;
  const bodyStart = match.index + full.length;
  const { elseAt, closeStart, closeEnd } = findBlockEnd(tpl, tag, bodyStart);

  const truthyBody = tpl.slice(bodyStart, elseAt === -1 ? closeStart : elseAt);
  const falsyBody = elseAt === -1 ? '' : tpl.slice(tpl.indexOf('}}', elseAt) + 2, closeStart);

  const value = resolvePath(expr, ctx);
  let out = '';

  if (tag === 'each') {
    const list = Array.isArray(value) ? value : [];
    out = list
      .map((item, i) =>
        renderTree(truthyBody, {
          ...ctx,
          this: item,
          '@index': i,
          '@first': i === 0,
          '@last': i === list.length - 1,
        }),
      )
      .join('');
    if (list.length === 0) out = renderTree(falsyBody, ctx);
  } else {
    const pass = tag === 'if' ? truthy(value) : !truthy(value);
    out = renderTree(pass ? truthyBody : falsyBody, ctx);
  }

  return interpolate(tpl.slice(0, match.index), ctx) + out + renderTree(tpl.slice(closeEnd), ctx);
}

function interpolate(tpl, ctx) {
  return tpl
    .replace(/\{\{\{\s*([^}]+?)\s*\}\}\}/g, (_, e) => {
      const v = resolvePath(e, ctx);
      return v == null ? '' : String(v);
    })
    .replace(/\{\{\s*(?!["#/>])([^}]+?)\s*\}\}/g, (_, e) => {
      const v = resolvePath(e, ctx);
      return v == null ? '' : escapeHtml(v);
    });
}

function expandPartials(tpl, partials, depth = 0) {
  if (depth > 12) throw new Error('partial nesting too deep, check for a cycle');
  const re = /\{\{>\s*([\w./-]+)\s*\}\}/g;
  if (!re.test(tpl)) return tpl;
  const out = tpl.replace(re, (_, name) => {
    if (!(name in partials)) throw new Error(`missing partial: ${name}`);
    return partials[name];
  });
  return expandPartials(out, partials, depth + 1);
}

function render(tpl, ctx, partials) {
  return renderTree(expandPartials(tpl, partials), ctx);
}

/* ------------------------------------------------------------------ *
 * Loading
 * ------------------------------------------------------------------ */

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// Vietnamese text can arrive precomposed (ế as one code point) or decomposed
// (e + combining circumflex + combining acute). Both look identical in an editor,
// but they are different bytes: they sort differently, they fail string comparison,
// browser find-in-page misses them, and search engines index them as distinct words.
// macOS and some CMS paths hand back decomposed text, so everything is normalised to
// NFC on the way in and the rest of the build never has to think about it again.
function toNfc(value) {
  if (typeof value === 'string') return value.normalize('NFC');
  if (Array.isArray(value)) return value.map(toNfc);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k.normalize('NFC'), toNfc(v)]));
  }
  return value;
}

async function loadJson(file) {
  try {
    return toNfc(JSON.parse(await readFile(file, 'utf8')));
  } catch (err) {
    throw new Error(`${path.relative(ROOT, file)}: ${err.message}`);
  }
}

async function loadPartials() {
  const dir = path.join(DIRS.src, 'partials');
  const partials = {};
  for (const file of await walk(dir)) {
    if (!file.endsWith('.html')) continue;
    const name = path.relative(dir, file).replace(/\\/g, '/').replace(/\.html$/, '');
    partials[name] = await readFile(file, 'utf8');
  }
  return partials;
}

// Content names an image by its base path, without a width or an extension:
//   "heroImage": "/img/projects/forti-halo/hero"
// The widths are then discovered by reading the directory, rather than guessed from a
// list. That means this file never has to stay in sync with tools/prepare-images.py,
// and a source that yields an odd native width (1312px, say) is picked up for free.
// Cleared at the start of every build. In watch mode this map would otherwise remember
// a lookup made while the image tree was mid-regeneration, and keep serving that empty
// answer for the life of the process even after the files reappeared.
const variantCache = new Map();
const unresolvedImages = new Set();

function findVariants(base) {
  if (variantCache.has(base)) return variantCache.get(base);

  const dir = path.join(DIRS.static, path.dirname(base));
  const stem = path.basename(base);
  let widths = [];
  try {
    widths = readdirSync(dir)
      .map((name) => new RegExp(`^${stem}-(\\d+)\\.webp$`).exec(name))
      .filter(Boolean)
      .map((match) => Number(match[1]))
      .sort((a, b) => a - b);
  } catch {
    widths = [];
  }

  variantCache.set(base, widths);
  return widths;
}

function expandImages(node) {
  if (Array.isArray(node)) {
    node.forEach(expandImages);
    return node;
  }
  if (!node || typeof node !== 'object') return node;

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') {
      if (!value.startsWith('/img/') || path.extname(value)) continue;
      const found = findVariants(value);
      if (!found.length) {
        // Never fail silently. Left alone, this emits <img src="/img/.../hero"> with an
        // empty srcset, which renders as a broken image on a page that still builds
        // "successfully". Collect it and shout at the end of the build instead.
        unresolvedImages.add(value);
        continue;
      }
      node[key] = `${value}-${found[found.length - 1]}.webp`;
      node[`${key}Set`] = found.map((w) => `${value}-${w}.webp ${w}w`).join(', ');
    } else {
      expandImages(value);
    }
  }
  return node;
}

async function loadCollection(locale, name) {
  const dir = path.join(DIRS.content, locale, name);
  const items = [];
  for (const file of await walk(dir)) {
    if (!file.endsWith('.json')) continue;
    const data = expandImages(await loadJson(file));
    data.slug ||= path.basename(file, '.json');
    items.push(data);
  }
  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/* ------------------------------------------------------------------ *
 * URLs
 *
 * Vietnamese is primary and sits at the root. English lives under /en/.
 * Every path produced here is absolute and starts with a slash.
 * ------------------------------------------------------------------ */

function localePrefix(site, locale) {
  return locale === site.defaultLocale ? '' : `/${locale}`;
}

function pageUrl(site, locale, slug) {
  const prefix = localePrefix(site, locale);
  return slug === 'index' ? `${prefix}/` : `${prefix}/${slug}/`;
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

// Windows keeps a handle on a file while it is being read, so deleting dist/ can fail
// with ENOTEMPTY or EBUSY if the dev server happens to be serving a request. Watch mode
// rebuilds into the directory it is serving from, so this is a normal race, not an edge
// case. Retry briefly, then fall back to emptying the directory rather than removing it.
async function cleanDist() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(DIRS.dist, { recursive: true, force: true });
      return;
    } catch (err) {
      if (!['ENOTEMPTY', 'EBUSY', 'EPERM'].includes(err.code) || attempt === 4) {
        if (attempt < 4) continue;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 60 * (attempt + 1)));
    }
  }

  // Last resort: clear the contents and leave the directory itself in place.
  for (const entry of await readdir(DIRS.dist, { withFileTypes: true }).catch(() => [])) {
    await rm(path.join(DIRS.dist, entry.name), { recursive: true, force: true }).catch(() => {});
  }
}

// Sections are ordered and switched on or off by the content file alone, which is
// what makes the CMS toggle and reorder work without touching markup.
function renderSections(sections = [], ctx, partials) {
  return sections
    .filter((s) => s.visible !== false)
    .map((section, i) => {
      const name = `sections/${section.type}`;
      if (!(name in partials)) throw new Error(`unknown section type: ${section.type}`);
      // `band` comes from rendered position, not from the section's identity, so
      // reordering in the CMS can never place two identical backgrounds together.
      return render(
        partials[name],
        { ...ctx, section, band: i % 2 === 0 ? 'band-a' : 'band-b', index: i },
        partials,
      );
    })
    .join('\n');
}

async function build() {
  const started = Date.now();
  variantCache.clear();
  unresolvedImages.clear();

  const site = await loadJson(path.join(DIRS.content, 'site.json'));
  const partials = await loadPartials();
  const layout = await readFile(path.join(DIRS.src, 'layouts', 'base.html'), 'utf8');

  await cleanDist();
  await mkdir(DIRS.dist, { recursive: true });
  if (existsSync(DIRS.static)) await cp(DIRS.static, DIRS.dist, { recursive: true });

  const written = [];
  // Kept so the 404 can be built once, after the loop, from the default locale's
  // context. Cloudflare serves one 404 for every unmatched path, locale included.
  const contexts = {};

  for (const locale of site.locales) {
    const strings = await loadJson(path.join(DIRS.content, locale, 'strings.json'));
    const projects = await loadCollection(locale, 'projects');
    const posts = await loadCollection(locale, 'posts');
    const pages = await loadCollection(locale, 'pages');

    for (const project of projects) {
      project.url = pageUrl(site, locale, `du-an/${project.slug}`);
    }

    const nav = site.nav.map((item) => ({
      ...item,
      label: strings.nav[item.id] ?? item.id,
      url: pageUrl(site, locale, item.slug),
    }));

    for (const post of posts) {
      post.url = pageUrl(site, locale, `tin-tuc/${post.slug}`);
    }

    const featuredProjects = projects.filter((p) => p.featured);

    const base = {
      site,
      locale,
      strings,
      nav,
      projects,
      posts,
      featuredProjects,
      otherProjects: projects.filter((p) => !p.featured),
      homeUrl: pageUrl(site, locale, 'index'),
      projectsUrl: pageUrl(site, locale, 'du-an'),
      contactUrl: pageUrl(site, locale, 'lien-he'),
    };
    contexts[locale] = base;

    const targets = [
      ...pages.map((page) => ({ page, template: page.template ?? 'page', slug: page.slug })),
      ...projects.map((project) => ({
        page: { ...project, sections: project.sections ?? [] },
        template: 'project',
        slug: `du-an/${project.slug}`,
        project,
      })),
    ];

    for (const target of targets) {
      const url = pageUrl(site, locale, target.slug);
      const ctx = {
        ...base,
        page: target.page,
        project: target.project,
        url,
        // Every locale variant of this page, for the switcher and for hreflang.
        alternates: site.locales.map((l) => ({
          locale: l,
          url: pageUrl(site, l, target.slug),
          current: l === locale,
        })),
      };

      const templateFile = path.join(DIRS.src, 'templates', `${target.template}.html`);
      if (!existsSync(templateFile)) throw new Error(`missing template: ${target.template}.html`);

      const sections = renderSections(target.page.sections, ctx, partials);
      const body = render(await readFile(templateFile, 'utf8'), { ...ctx, sections }, partials);
      const html = render(layout, { ...ctx, sections, body }, partials);

      const outFile = path.join(DIRS.dist, url === '/' ? 'index.html' : path.join(url, 'index.html'));
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, html);
      written.push({ url, locale });
    }
  }

  await write404(site, contexts, layout, partials);

  // An empty site.url means the site has no public address yet, which is the state for
  // as long as OPEN-1 is open. Everything needing an absolute URL is skipped rather
  // than written against a placeholder host, and the preview is shut to crawlers twice
  // over: robots.txt asks, X-Robots-Tag tells, and only the second survives a link
  // someone shares. Filling in site.url turns the whole lot on.
  if (site.url) {
    await writeSitemap(site, written);
    await writeFile(
      path.join(DIRS.dist, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
    );
  } else {
    await writeFile(path.join(DIRS.dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
    await writeFile(path.join(DIRS.dist, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
  }

  if (unresolvedImages.size) {
    console.warn(
      `\nWARNING: ${unresolvedImages.size} image path(s) have no files in static/img.` +
        `\nThese render as broken images. Run: python tools/prepare-images.py\n` +
        [...unresolvedImages].map((p) => `  ${p}`).join('\n'),
    );
  }

  console.log(
    `built ${written.length} pages${site.url ? '' : ' + 404, unindexed preview'} in ${
      Date.now() - started
    }ms`,
  );
  return written;
}

// One 404 for the whole site, because Cloudflare answers every unmatched path with the
// same file and cannot pick a locale. Built in the default locale with the other locale
// carried underneath as `alt`, and kept out of `written` so it never reaches the
// sitemap or the page count.
async function write404(site, contexts, layout, partials) {
  const base = contexts[site.defaultLocale];
  if (!base) throw new Error(`no context for default locale: ${site.defaultLocale}`);
  const other = site.locales.find((l) => l !== site.defaultLocale) ?? site.defaultLocale;

  const ctx = {
    ...base,
    page: {
      titleFull: `${base.strings.notFound.title} | ${site.brand}`,
      description: base.strings.notFound.body,
    },
    alt: contexts[other].strings,
    url: '/404.html',
    alternates: [],
  };

  const template = await readFile(path.join(DIRS.src, 'templates', '404.html'), 'utf8');
  const body = render(template, ctx, partials);
  await writeFile(path.join(DIRS.dist, '404.html'), render(layout, { ...ctx, body }, partials));
}

async function writeSitemap(site, written) {
  const urls = written
    .map(
      ({ url }) =>
        `  <url>\n    <loc>${site.url}${url}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    )
    .join('\n');
  await writeFile(
    path.join(DIRS.dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}

/* ------------------------------------------------------------------ *
 * Dev server. Port 4318, because 4321 is taken.
 * ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function serve(port = 4318, watchFiles = true) {
  createServer(async (req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    let file = path.join(DIRS.dist, rel);
    if (!file.startsWith(DIRS.dist)) return res.writeHead(403).end();
    if (!existsSync(file)) file = path.join(DIRS.dist, '404.html');
    if (!existsSync(file)) return res.writeHead(404).end('not found');
    const body = await readFile(file);
    res.writeHead(existsSync(path.join(DIRS.dist, rel)) ? 200 : 404, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  }).listen(port, () => console.log(`serving http://localhost:${port}`));

  // Two watchers on one dist/ will race each other, so a second instance meant only
  // for looking at the built output should run with --no-watch.
  if (!watchFiles) return;

  let pending = null;
  for (const dir of [DIRS.content, DIRS.src, DIRS.static]) {
    if (!existsSync(dir)) continue;
    watch(dir, { recursive: true }, () => {
      clearTimeout(pending);
      pending = setTimeout(() => build().catch((err) => console.error(`build failed: ${err.message}`)), 80);
    });
  }
}

// --port 4319, --port=4319, or PORT=4319. Defaults to 4318, because 4321 is spoken for.
function readPort(argv) {
  const inline = argv.find((a) => a.startsWith('--port='));
  if (inline) return Number(inline.split('=')[1]);
  const at = argv.indexOf('--port');
  if (at !== -1 && argv[at + 1]) return Number(argv[at + 1]);
  if (process.env.PORT) return Number(process.env.PORT);
  return 4318;
}

const serveFlag = process.argv.includes('--serve');
try {
  await build();
  if (serveFlag) await serve(readPort(process.argv), !process.argv.includes('--no-watch'));
} catch (err) {
  console.error(`build failed: ${err.message}`);
  process.exit(1);
}
