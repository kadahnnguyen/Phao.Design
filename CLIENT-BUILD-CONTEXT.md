# Client Build Context

**Read this file first, in full, before touching anything in a client project.**

This is the standing brief for every website I build for a client. It tells you what
my service is, what I am contractually promising the client, how to read the request
form they filled in, and how to turn that request into a site without asking me
twenty questions first.

Copy this file into the root of each client project. Alongside it there will be a
`client/` folder holding the actual request:

```
client/
  request-<id>-<client-name>.md   the filled-in request form (the work order)
  content-files/                  what the client uploaded: text, photos, logo, PDFs
  visual-references/              screenshots, moodboards, sketches of styles they like
```

The request file is the work order. It is the client's own words, captured by a form
on my site, `website4u`. Everything in it maps onto something defined below.

---

## 1. The service, in one paragraph

I am a solo operator. I build small, fast, hand-written **static websites** for
individuals and small businesses in Vietnam, mostly portfolios, personal profiles,
service landing pages and small shop or restaurant pages. The client pays once. There
is no subscription, no monthly fee, no hosting bill. The finished site is published to
the client's own GitHub account and belongs to them outright. Typical turnaround is
under three days for a simple site. My intake and marketing site is
`website4u.khoa-nguynxun.workers.dev`; the client came from there.

Because I am one person, everything has to be self-service and low-maintenance. A
build that needs me on call every week is a failed build.

---

## 2. What I actually deliver (hard technical constraints)

| | |
|---|---|
| **Type** | Static site. No server, no database, no user accounts, no cart, no logins. |
| **Hosting** | GitHub Pages, free, on the **client's own** GitHub account, at `theirname.github.io`. |
| **HTTPS** | Automatic through GitHub Pages. Never build anything that assumes plain HTTP. |
| **Responsive** | Phone first, then tablet, then desktop. Vietnamese clients' visitors are overwhelmingly on phones. |
| **Ownership** | 100% of the source goes to the client. No licence, no lock-in, no service of mine they depend on. |

Anything that needs a server is **out of scope by default** and must be raised with
me rather than improvised. If the client asked for something dynamic (orders, member
logins, comments, a live inventory), say so explicitly in your build plan and stop:
that is either a Custom-tier conversation or a different platform, and it changes the
price.

Two sanctioned exceptions, both perks the client has to have paid for:

- **Self-edit admin panel** — a Git-based CMS at `/admin` that commits content back
  into the client's own repo, using their GitHub login. Publishing is not instant; a
  rebuild takes one to two minutes.
- **Contact form** — submitted through Resend, which sends the message to the
  client's inbox with reply-to set to the visitor. Free tier is 3,000 mails/month.

If neither perk is ticked, the site has no moving server-side parts at all.

---

## 3. Tiers: they are about SIZE, not features

Tiers are decided by how much site there is. Features and perks are billed separately
on top and never define a tier. Prices below are guide prices in USD; the Vietnamese
side of my site currently shows the VND figures as hidden, and the final quote is
always confirmed by me after the request arrives. **Never quote a price to a client
yourself.**

**Starter (~$49)**
- 1 page, no multi-page navigation
- Up to 3 sections on that page
- Up to 10 photos, 1,000 words
- Static contact details only: email, phone, social links
- Unlimited revisions for 5 days from the preview
- Live in under 3 days

**Standard (~$99)** — everything in Starter, plus:
- Up to 3 pages
- Up to 6 sections per page
- Up to 30 photos, 2,500 words
- Shared navigation bar and footer across pages
- Live in roughly 3 to 4 days

**Custom (quoted)** — two different things wear this label:
1. *Standard, only bigger*: 4+ pages, no section limit, structured content such as
   product lists or articles, several forms, revisions for 10 days instead of 5.
2. *Separate work*: company sites, redesigns of an existing site, adding features to
   a live site, custom software, admin dashboards, anything needing a server,
   migrations off WordPress/Wix/Squarespace.

Overage on Starter/Standard: extra sections ~$10 each, every extra 10 photos ~$5. If a
client blows well past the limit, the next tier up is cheaper and I tell them so.

**Every tier includes:** responsive layout, fast loading, HTTPS, free hosting, no
monthly fees, free technical bug fixes for 14 days after delivery.

**Payment:** 15% deposit on Starter, 30% on Standard, per-project on Custom, balance
on delivery. Nothing is due at request time. I do not hand the site to the client's
account until payment clears.

---

## 4. The perks catalogue

Perks are the optional extras. **None of them are included by default.** Each one the
client ticked is a paid line item and a real block of work with its own deliverables.
When a perk is on, the request file will carry a **Perk details** block with the
client's answers to that perk's follow-up questions. Build exactly what those answers
say.

| Slug | Name | What ticking it obligates you to build |
|---|---|---|
| `animations` | Motion & animation | Scroll reveals, tilt cards, counters, typing text and similar. Lightweight, no external library. Two or three effects for a whole site, not eight. Respect the intensity the client picked. |
| `self-edit` | Edit your own content | Git-based CMS at `/admin`, GitHub OAuth login, list/add/edit/reorder UI, image drop zone, publishes by committing to the repo. Only the parts declared editable are editable; layout changes remain my job. |
| `link-preview` | Link preview cards | Open Graph and Twitter card tags, a 1200x630 cover image, the exact title and description the client supplied. |
| `seo-aeo` | SEO & AEO | Real titles and meta descriptions, semantic headings, JSON-LD structured data, sitemap.xml, robots.txt, real text in the markup rather than words baked into images. Aimed at both search engines and AI answer engines. |
| `analytics` | Analytics & tracking | GA4 plus Google Tag Manager in the **client's own** Google account. Declare the events that matter to them, mark conversions, test every event in DebugView on desktop and phone, then show them how to read it. Cookie consent is mandatory if they have European visitors. |
| `domain` | Your own domain | Name availability check, DNS records, HTTPS, folding www and non-www into one address, redirects from the old address, re-declaring to Google. The client buys and owns the domain and pays the registrar directly. I take no cut. |
| `languages` | A site in several languages | A real URL per language, `hreflang` declarations, a switcher that remembers the choice, locale-correct dates, numbers and currency. Never machine-translate and publish straight. |
| `contact-form` | Contact form to your inbox | Form on the page, spam trap, submission limit, server-side validation, a "sent" confirmation screen, mail via Resend to the client's inbox with reply-to set to the visitor. Fields are exactly the ones the client asked for. |

The eight above are the whole catalogue. If the client described something that is not
one of these, it is either a plain feature (section 6, **Features**) or a custom
request that needs my sign-off.

---

## 5. Handover model (why the repo is mine until it is not)

1. I build in **my own** GitHub account and give the client a preview link at an
   obscure URL. They review it; they never hold the code.
2. Payment clears.
3. The client creates their free GitHub account. Their chosen username *is* the
   product: the site lives at the clean root `theirname.github.io`. They add me as a
   collaborator, or I transfer the repo.
4. I push the finished site, confirm it is live, hand over a short written guide, and
   remove myself.
5. A custom domain, if bought, is pointed afterwards.

Practical consequence for you: **do not** write anything into the code that assumes my
account, my paths, my analytics IDs or my domain. Everything account-specific has to be
a value that gets swapped at handover, and listed in the handover notes.

---

## 6. How to read the request file, field by field

The request markdown always has this shape. Here is what each field means and what you
are supposed to do with it.

**Header block**
- `Submitted` — timestamp, UTC+7.
- `Status` — my triage state. `New` means I have not replied yet.
- `Tags` — budget/tier tag plus the language the form was filled in (`vi` or `en`).
  That language is a strong hint for the language of my correspondence, not
  necessarily the language of the site.
- `Contact` — email, preferred channel (Zalo, Discord, Email, Phone call, Other) and
  handle. Never contact the client yourself; this is here so you know who they are.

**Scope fields**
- `Type` — one of: Personal profile / CV, Portfolio, Business / service landing page,
  Cafe / restaurant / shop, Event / wedding, Other. `Other type` carries their own
  description when they picked Other. This drives the overall page archetype.
- `Tier` — Starter / Standard / Custom / "Not sure, advise me". If unsure, do not
  guess a price; size the work from the content they sent and flag which tier it
  lands in.
- `Brand` — the website or brand name. Use it verbatim, including diacritics and
  odd punctuation. It is their name, not a slug to tidy up.
- `Goal` — what the site is for. This is the single most important line in the file.
  Every layout decision should trace back to it.
- `Audience` — who is reading. If there are two distinct audiences, the homepage
  usually needs two clear paths, not one blended one.
- `Size` — A single page / 2 to 4 pages / 5 or more / Not sure. Cross-check it against
  the tier and against how much content actually arrived.
- `Languages` — Vietnamese / English / Both / Other. "Both" or "Other" implies the
  multi-language perk, which should also appear under Perks.

**Content fields**
- `Content ready` — Yes, all ready / Some of it / Not yet, guide me. Tells you how
  much real copy exists versus how much is placeholder work.
- `Content` — pasted text or a link to a doc. Treat as raw material to arrange, not
  as final copy unless it reads finished.
- `Images` — Yes / Not yet / I need help.
- `Content files` — a list at the bottom of the file, linking into `content-files/`.
  These are things that go **on** the site: copy documents, photos, logo, portfolio
  PDFs, a CV. Open every one of them before planning.

**Design fields**
- `Style` — the adjectives and colours they want. Take the colour words literally;
  take the adjectives as a direction.
- `References` — links to sites they like, often with a note explaining *which part*
  of each site they mean. Read that note carefully: they usually want the layout or
  the transition, not a copy of the site.
- `Visual references` — a list at the bottom linking into `visual-references/`.
  Screenshots and moodboards. These show style, never content.

**Features**
- `Features` — a multi-select from a fixed list: Contact form, Photo gallery, Google
  map, Booking / calendar, Social media links, Menu / price list, News / blog, Product
  list / catalogue, Customer testimonials, FAQ section, Embedded YouTube video, Zalo /
  Messenger chat button, Tap-to-call button on mobile, Email newsletter signup,
  Countdown to an event, Downloadable file / brochure, Other.
- `Other feature` — free text when they ticked Other.

  **Important:** ticking a feature is not the same as buying a perk. "Contact form"
  in this list switches on the `contact-form` perk. The rest are ordinary sections
  and are covered by the tier, **but they still consume the section budget**. A client
  who ticks twelve features on a Starter tier has ordered a Standard or Custom site,
  and you should say so plainly in your plan rather than cramming them in.

**Perks and Perk details**
- `Perks` — the perks they switched on, by name.
- `Perk details` — an indented block per perk, holding the answer to that perk's
  pick-one question and its free-text follow-up. These are build instructions. Read
  them as specifications.

**Logistics**
- `Domain` — Yes / No, a free address is fine / I'd like help buying one.
- `GitHub` — Yes / No / What is GitHub? The last answer means handover will need the
  full hand-holding guide.
- `Budget` — a bracket, or "Not sure, advise me".
- `Deadline` and `Notes` — appear when filled.

---

## 7. What to do with a fresh request

Work in this order. Do not start writing markup at step 1.

**Step 1 — Read everything.** The request file, then every file in `content-files/`
and `visual-references/`. PDFs and images included. You cannot plan a portfolio
without looking at the portfolio.

**Step 2 — Write a build plan** and put it in `PLAN.md` at the project root. It must
contain:
- the archetype and the page list, with the sections inside each page
- which content maps to which section, naming the source file
- what is missing and needs the client to supply it
- every perk that is on, and what it concretely means for this build
- an honest scope check: does this fit the tier they picked? If not, say which tier
  it really is and by how much
- open questions for me, gathered in one place at the bottom

**Step 3 — Ask me the questions.** Do not invent answers to scope, price or anything
in section 11 below. Everything that does not depend on an answer, keep building.

**Step 4 — Build.** Content-first: real copy and real images from day one. Never ship
lorem ipsum into a preview.

**Step 5 — Check against the definition of done** in section 9.

---

## 8. Copy and language rules

- **Never use em-dashes.** Not in Vietnamese, not in English, not in code comments,
  not in commit messages. Use a comma, a colon, or a full stop.
- Vietnamese is the default language for most clients. Write natural, warm, plain
  Vietnamese, and get the diacritics right. Do not write Vietnamese that reads like
  translated English.
- Any Korean, Japanese or Chinese copy has to round-trip: if you translate it back
  through Google Translate it should come out matching the English or Vietnamese
  source. If it does not, it is wrong.
- Keep proper nouns, brand names, dish names and addresses untranslated unless the
  client said otherwise.
- Do not machine-translate and publish. Every language on the site is content someone
  has to maintain, and a bad translation is worse than none.
- Match the client's own register. A one-person design studio does not write like a
  corporation, and the request file usually shows you their voice.

---

## 9. Definition of done

- Every section on every page carries real client content, or is explicitly listed in
  `PLAN.md` as blocked on missing material.
- Works at 320px wide. Checked, not assumed.
- No horizontal scroll anywhere at any width.
- Every image has alt text, in the site's language.
- Titles and meta descriptions written for every page, even without the SEO perk.
- No console errors, no broken links, no 404 images.
- Nothing in the code hard-codes my account, my domain or my tracking IDs.
- Loads fast: images sized and compressed, no unnecessary JavaScript.
- Perks that are on are actually implemented and demonstrably working, not stubbed.
- A short `HANDOVER.md` listing every value that must be swapped at handover and every
  account the client needs to own.

---

## 10. Working conventions

- Match the surrounding code. If a client project already has a style, follow it
  rather than importing a new one.
- Content lives in one obvious, separate place, so the client can find it after
  handover even without the self-edit perk. This is a promise I make on the site: the
  content is separated out and readable.
- Keep the dependency count near zero. A static site that needs a build toolchain the
  client cannot run is a liability after handover.
- Never commit or push without my explicit say-so, each time.
- If the project has a dev server, do not use port 4321. I run my own there.

---

## 11. Escalate to me, do not decide yourself

- Anything about **price, quote, deposit, refund or timeline** promised to the client.
- Whether a request fits a tier or needs to be re-quoted.
- Anything requiring a server, a database, logins, payments or an ongoing paid service.
- Buying a domain, creating accounts, or entering anyone's credentials anywhere.
- Contacting the client, in any channel, for any reason.
- Publishing, deploying, or pushing to any account.
- A request that would need me to maintain the site after handover.

---

## 12. Worked example

The request in `client/request-33-nguy-n-kh-nh-an.md` is a good reference for how a
real one reads. Summarised, so you can see the shape of the reasoning:

- **Type:** "Other" — a 3D product design and industrial design portfolio, brand
  "Phào Design". So: portfolio archetype, close to the `3d-artist` template.
- **Tier:** not sure. But four portfolio PDFs, seventeen requested features, six
  perks and four languages put it firmly in **Custom**, not Starter. That gap is the
  first thing to flag rather than to build around.
- **Audience:** two of them, recruiters and design clients. The client already worked
  this out and asked for a **dual CTA** on the homepage, one path each. Build that.
- **Perks on:** animations (moderate, homepage matters most), self-edit (a few times
  a month, wants everything editable), link-preview (has their own cover image, gave
  exact title and description), seo-aeo (online only, supplied a very long keyword
  list), analytics (conversion is Zalo/Messenger taps, gave their Gmail), domain
  (wants advice on buying), languages (Vietnamese primary, plus English, Korean,
  Chinese, proper nouns untranslated), contact-form (to personal Gmail, and they
  specified the exact fields: who you are, name, phone, the request, other info).
- **The "Other feature" line** asks for something unusual: the ability to hide or show
  features they end up not using, so the page does not distract. That is a real
  requirement, and it interacts with the self-edit perk. It needs a design answer, and
  it is exactly the kind of thing to raise in `PLAN.md` rather than silently skip.
- **References:** two links, each with a note saying which aspect they mean. One for
  the portfolio layout, transitions and typography; one for the density and structure
  of the secondary pages. Read the notes, not just the links.
- **Style:** impressive, modern, energetic, yellow, refined, light and clean overall.
  Yellow is a literal instruction. The rest is direction.

The point of the example: the request file already contains almost every decision.
Your job is to read it properly, notice where it exceeds what the client thinks they
ordered, and turn the rest into a plan.
