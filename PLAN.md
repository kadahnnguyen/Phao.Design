# PLAN.md — Phào Design

Build plan for request 33, Nguyễn Khánh Đan.
Written against `CLIENT-BUILD-CONTEXT.md`. Every decision below was taken by Khoa on
2026-08-17 unless marked OPEN or CLIENT.

---

## 1. Archetype and scope check

**Archetype:** portfolio, dual-audience, with a services arm attached.

**Tier: Custom**, of the "Standard, only bigger" kind. Not separate work.
The request landed as "Chưa rõ, cần tư vấn". Sizing it against section 3:

| | Standard allows | This request | Over by |
|---|---|---|---|
| Pages | 3 | 7 templates, ~34 rendered pages across 2 locales | ~11x |
| Sections/page | 6 | 8 on the homepage, 9 on a project page | modest |
| Photos | 30 | 60+ extractable from the portfolio PDFs | 2x+ |
| Words | 2,500 | ~3,500 per locale, 7,000 total | ~3x |
| Perks | none included | all 8 switched on | whole catalogue |
| Features | budget-consuming | 17 ticked | collapses to ~8 |

Revisions run 10 days from preview, per Custom. Payment is per-project.
**Nothing has been quoted. Khoa quotes, never this plan and never Claude.**

---

## 2. Feature consolidation

Đan ticked all 16 features plus "Khác". They collapse into 8 build units.
Consolidation was made a priority under decision A2.

| Ticked feature | Where it lands |
|---|---|
| Thư viện ảnh | inside **Dự án** |
| Danh sách sản phẩm / danh mục | inside **Dự án** |
| Video nhúng từ YouTube | inside **Dự án**, per-project field (no links supplied) |
| Biểu mẫu liên hệ | **Liên hệ** |
| Nút chat Zalo / Messenger | **Liên hệ**, quick-contact rail |
| Nút gọi nhanh trên di động | **Liên hệ**, quick-contact rail |
| Đặt lịch / booking | merged into the contact form as an optional "thời gian muốn trao đổi" field |
| Thực đơn / bảng giá | **Dịch vụ & Báo giá** |
| Tin tức / blog | **Tin tức & Hoạt động**, one collection with categories |
| Đánh giá từ khách hàng | **Testimonials** section, blocked on content |
| Câu hỏi thường gặp | **FAQ** section |
| Tải tài liệu / brochure | **Downloads**, four PDFs listed with file sizes (D4) |
| Liên kết mạng xã hội | footer, blocked on handles |
| Đăng ký nhận tin qua email | **deferred**, not cut. No publishing cadence exists yet |
| Bản đồ Google | **cut** (B2), Đan has no physical location |
| Đếm ngược tới ngày sự kiện | **cut**, no event exists. Returns via the D1 toggle if one appears |
| Khác: ẩn/hiện tính năng | becomes the **CMS section toggle + reorder** (D1) |

---

## 3. Page list and sections

Locales: `vi` (primary) and `en`. URL per locale, `hreflang` pairs, switcher that
remembers the choice. Plumbing built for 4 locales, only 2 shipped (B1).

### 3.1 Trang chủ `/`
Motion perk names the homepage as what matters most. Dual CTA is a direct instruction.

1. **Hero** — a single still image, the Forti Halo workspace render, with a one-line
   caption naming the project. No slideshow.
   **This narrows what Đan asked for.** Their perk detail says "Hero: 3-4 sản phẩm/dự
   án ấn tượng nhất". Khoa chose a single image on 2026-08-17. Reversible: the other
   three renders (Gravity, Aeterna, Awake and Seek) are already curated and sized, so
   restoring a set is a content change, not a rebuild. An alternative that satisfies
   both is a static mosaic of 3 to 4 renders, no rotation.
   Consequence: the motion perk now has two effects, not three, which is still inside
   the "two or three" the brief allows.
2. **Positioning line** — "Mình là Đan, Industrial Designer chuyên về thiết kế công
   nghiệp và 3D, hiện đang nhận một số dự án tự do bên cạnh công việc chính."
   Positioned as a person, never as "Công ty thiết kế ABC". Đan's own wording.
3. **Dual CTA** — "Xem Portfolio đầy đủ" for recruiters, "Yêu cầu tư vấn dự án" for
   clients. Two visually equal paths, not a primary and a secondary.
4. **Highlights** — the 5 highlight projects as cards.
5. **Thế mạnh** — the four strengths from the `Content` field. This is the only
   original Vietnamese copy Đan supplied and it should be used close to verbatim.
6. **Dịch vụ, tóm tắt** — teaser into the services page.
7. **Tin tức, mới nhất** — 3 cards. Hidden until the blog has posts.
8. **Liên hệ, rút gọn** — form entry point plus quick-contact rail.

Sections 4 through 8 are toggleable and reorderable. 1 through 3 are pinned.

### 3.2 Dự án `/du-an`
Index of 10 projects, filterable by the portfolio's own split.

- **Highlights (5):** Forti Halo, Gravity, Aeterna, WH Just Pure Bottle, Awake and Seek Perfume
- **Other projects (5):** Aerodynamic Car Design, Bent.ch Chair, Ươm Hoa, AAS Graphic Portfolio, Soft Skills & Jobs

All ten project pages are written in both locales as of 2026-08-17. Five carry real
imagery (Forti Halo, Gravity, Aeterna, Awake and Seek, Aerodynamic Car). Five are
text-only and marked `_blocked` in their own content file, because their PDF pages were
flattened spreads: WH Just Pure Bottle, Bent.ch, Ươm Hoa, AAS identity, Other work.

Note on the tenth: the portfolio's own index calls page 31 "Other projects &
activities", a catch-all of ceramics, sculpture, drawing and teaching. It is published
as a project titled "Tác phẩm khác" / "Other work" rather than folded into About,
because recruiters do want to see hand skills, but it is the weakest card in the grid
and the first candidate to hide if the set needs tightening.

### 3.3 Dự án chi tiết `/du-an/<slug>`
One template, 9 slots, each optional so short projects do not look broken.
This is where the Kickstarter density reference applies (C4): sticky summary rail,
long scrolling narrative, clear chaptering, stats strip. No crowdfunding machinery.

1. Hero render
2. Tóm tắt (role, year, tools, materials, dimensions) in the sticky rail
3. Vấn đề / bối cảnh
4. Nghiên cứu thị trường và người dùng
5. Phát triển ý tưởng (sketches)
6. Kỹ thuật và cấu tạo
7. Thành phẩm (render gallery)
8. Video (empty for all 10)
9. Next / previous project

### 3.4 Giới thiệu `/gioi-thieu`
Portrait, WHO AM I bio, timeline of experience, software skills with the CV's own
star ratings, certificates, exhibitions and competitions, CV download.

### 3.5 Dịch vụ & Báo giá `/dich-vu`
Service list with tiers. **Blocked**: no services and no prices were supplied,
despite the goal naming "nhiều mức giá". Ships as marked scaffolding, hidden by default.

### 3.6 Tin tức & Hoạt động `/tin-tuc`
Placeholder page per D3. Collection, templates and categories built. Zero posts.
Real material exists in the CV if Đan wants it seeded later: SEE+ Design Fair 2023,
RMIT Accessibility Design Competition 2023 (top 25), Bien Hoa Ceramics internship.

### 3.7 Liên hệ `/lien-he`
Form fields exactly as Đan specified, no additions:
bạn là (khách hàng / nhà tuyển dụng / khác), tên, số điện thoại, yêu cầu dịch vụ
hoặc lời mời làm việc, thông tin khác. Plus the optional booking-time field from
the consolidation. Honeypot, rate limit, server-side validation, "đã gửi" screen.

### 3.8 `/admin`
Git-based CMS. Section toggle and reorder, both locales per field.

Plus `404`, `sitemap.xml`, `robots.txt`, and `og` images per page.

---

## 4. Content mapping

Every section traced to its source file. "Extract" means cropped out of a PDF page
spread at full resolution, with the baked-in layout text removed.

| Section | Source |
|---|---|
| Hero renders | `1_1.pdf` p10, `1_2.pdf` p5 and p9, `1_3.pdf` p7 |
| Positioning line, dual CTA | request, Perk details, Motion & animation |
| Thế mạnh | request, `Content` field |
| WHO AM I bio | `1_1.pdf` p3 (English, to be rewritten Vietnamese-first) |
| Portrait | `1_1.pdf` p2, `1_4.pdf` p6 |
| Forti Halo | `1_1.pdf` p6 to p10, `1_2.pdf` p1 to p4 |
| Gravity | `1_2.pdf` p5 to p8 |
| Aeterna | `1_2.pdf` p9, `1_3.pdf` p1 to p5 |
| WH Just Pure Bottle | `1_3.pdf` p6, including the 8-row BOM table |
| Awake and Seek Perfume | `1_3.pdf` p7 |
| Aerodynamic Car Design | `1_3.pdf` p8, 14 annotated improvements |
| Bent.ch Chair | `1_4.pdf` p1, has full VI and EN copy already, 1000x375x500, plywood |
| Ươm Hoa | `1_4.pdf` p2 |
| AAS Graphic Portfolio | `1_4.pdf` p3 |
| Soft Skills & Jobs | `1_4.pdf` p4 |
| Experience timeline, skills, certificates | `CV_...pdf` |
| Contact details | request header, `1_4.pdf` p5 |

**Bent.ch is the only project with finished bilingual copy.** Everything else needs
writing. Under D2 the Vietnamese is written first from the English source and Đan's
own wording, then English is derived from the Vietnamese. The PDF English is raw
material, not final copy.

---

## 5. Blocked on missing material

Each ships as marked scaffolding, switched off via the D1 toggle, never as lorem ipsum.

| Blocked | Why | Interim |
|---|---|---|
| Original render files | `Images: Đã có` but only PDFs arrived | extracted, see 5.1 |
| 1200x630 cover | "Mình đã có sẵn", never uploaded | crop from a hero render |
| Social links | ticked, no handle anywhere in the files | footer marked pending |
| Zalo / Messenger | the analytics conversion depends on them | see OPEN-4 |
| Services and prices | goal names "nhiều mức giá", none supplied | hidden scaffolding |
| Testimonials | Đan has no clients yet | hidden scaffolding |
| Blog posts | none written | placeholder page (D3) |
| YouTube videos | ticked, no links | per-project field, empty |

---

### 5.1 Render extraction, done 2026-08-17

Run `python tools/extract-images.py` then `python tools/prepare-images.py`. Both are dev
tooling. `node build.mjs` has no dependencies and never touches either.

Pages were not rasterised, because that bakes headings and captions into the picture.
The embedded raster objects were pulled out instead, and soft masks recomposited, so
cut-outs like the portrait come out clean. From 196 embedded objects: **76 clean unique
renders**, duplicates dropped, and **23 quarantined**.

**The quarantine matters.** Twenty-three extractions are whole PDF pages flattened into
a single raster, layout text included. `part-4/p01-000` is the Bent.ch page and carries
Đan's student ID 2172104020023, class code and second email, which F1 says must not be
published. They sit in `tools/extracted/_flattened-do-not-publish/`, the whole
`tools/extracted/` tree is gitignored, and only curated files under `static/img/` ship.

That folder was sorted by hand until 2026-08-17, which meant it did not survive the
`rmtree` at the top of the extractor and had to be re-sorted after every run. It is now
the `QUARANTINE` list in `tools/extract-images.py`, so a re-run reproduces it. The list
was built by comparing each extraction's aspect ratio against its own page's and
checking every hit by eye; re-run that sweep if a source PDF is ever replaced.
Automatic detection was tried and dropped: a flattened raster carries the page's
pictures but not its live vector text, so it does not score as a copy of its own page,
and a filter that silently misses is worse here than no filter.

**Five of the ten projects have no clean imagery at all**, because those pages were
placed as flattened spreads:

| Project | Usable renders |
|---|---|
| Forti Halo | yes, 8 curated |
| Gravity | yes, 6 curated |
| Aeterna | yes, 15 curated, the largest set on the site |
| Aerodynamic Car Design | yes, 4 available |
| Awake and Seek Perfume | 1 only, rest flattened |
| WH Just Pure Bottle | rescued by crop, see below |
| Bent.ch Chair | **none** |
| Ươm Hoa | **none** |
| AAS Graphic Portfolio | **none** |
| Soft Skills & Jobs | **none** |

**Sub-threshold renders.** `MIN_WIDTH` and friends exist to throw away logos and
decorative fragments, and lowering them lets hundreds of those back in across four
PDFs. A few genuine renders sit just under the line, because a tight crop of a surface
finish is a small file by nature rather than a small picture. Those are named one at a
time in `EXTRAS` and extracted regardless of size. Currently one: the Aeterna vent and
wordmark detail, 586px.

**Rescue crops.** A flattened page can still contain a text-free region showing only
the product. Where it does, that region is cropped back out at native resolution by
`CROPS` in `tools/extract-images.py`, using fractional boxes so they survive any source
resolution. This recovered the WH Just Pure Bottle hero and card from the render panel
on its page. Every box must be checked by eye first and must contain no layout text and
no personal data: the Bent.ch page is why that rule exists, since its raster carries a
student ID, class code and personal email. Bent.ch, Ươm Hoa, AAS and Other work have no
text-free region worth cropping, so they remain image-less.

This sharpens CLIENT item 1. The ask is no longer "send the original files", it is
**"send the source images for these five projects"**, which is a far easier request.

**Second ceiling, and it is the binding one.** The embedded renders top out at 1312px
(Forti Halo) and 1451px (Gravity), and they are already heavily compressed inside the
PDF, with pdfimages reporting ratios under 3%. Consequences and what was done:

- Re-encoding at quality 80 stacked a second generation of loss and looked like mush.
  Large variants now encode at 90, small ones at 82.
- The hero was full bleed at 1265px+ against a 1312px source, and cropped to 2:1
  against a 1.61:1 original, so it was both soft and badly cut. It is now held inside
  the shell at 1088px painted, at the source's own 16/10, so nothing is upscaled at 1x
  and nothing is cropped.
- Variants now include each source's native width, and the build discovers widths by
  reading the directory instead of using a fixed list, so no resolution is stranded.

**Still true: on a 2x display the hero can only reach about 0.6x coverage.** No
processing fixes that. It needs higher-resolution originals, which is CLIENT item 1.
Until then the hero stays contained rather than full bleed.

Live now: 37 curated sources, one file each at the source's own native width, 3.7MB
total. Content names an image by base path only
(`/img/projects/gravity/hero`) and the build generates `srcset` from whichever variants
exist on disk, so a content file can never point at a file that is not there.

## 6. Perks, concretely

All eight are on. Each is paid work with its own deliverable.

**`animations`** — three effects, hand-written, no library (C3): scroll reveal on
section entry, slow scale on project cards, cross-fade between project images.
IntersectionObserver plus CSS. `prefers-reduced-motion` honoured.

**`self-edit`** — Git-based CMS at `/admin`, GitHub OAuth via a Cloudflare Worker
broker. Editable: all copy in both locales, project entries, image drop zone, blog
posts, FAQ, services, testimonials, **plus section on/off and reordering** (D1).
Header, hero and footer are pinned and not reorderable. Every reorderable section is
self-contained and derives its background from its rendered position, so no two
adjacent sections can collide. Each section verified at first, middle and last position.

**`link-preview`** — OG and Twitter card tags per page. Title and description exactly
as supplied: "Phào Design – Thiết kế sản phẩm 3D & Industrial Design. Xem portfolio và
quy trình thiết kế từ ý tưởng đến sản phẩm hoàn chỉnh." Split into title and
description at the full stop. Cover image cropped from a render until Đan sends theirs.

**`seo-aeo`** — real titles and meta descriptions per page and per locale, semantic
headings, JSON-LD (Person plus ProfessionalService, **no LocalBusiness**, per B2),
`sitemap.xml`, `robots.txt`, real text in markup rather than words baked into images.
The keyword list runs to roughly 50 terms, which no small site can target. Mapping:
service and process terms onto `/dich-vu` and project pages; "industrial designer",
"3D product designer" and the discipline terms onto the homepage and `/gioi-thieu`;
**"fresher", "junior", "sinh viên thiết kế công nghiệp" restricted to `/gioi-thieu`
only**, since they undercut the paid-services pitch on service-facing pages.

**`analytics`** — GA4 plus GTM in Đan's own Google account (`kadahnnguyen@gmail.com`).
Conversion is Zalo and Messenger taps, which cannot be built until handles arrive.
Wiring sits behind a consent gate defaulting to off. **Analytics is disconnected in
the preview entirely.** See OPEN-3.

**`domain`** — availability check, DNS, HTTPS, www folding, redirects, re-declaring to
Google. Đan buys and owns it, pays the registrar directly, Khoa takes no cut.
**Both names Đan proposed are invalid.** See OPEN-1.

**`languages`** — `vi` and `en` only (B1). URL per locale, `hreflang`, switcher with
memory, locale-correct dates and numbers. Proper nouns, brand names and project names
stay untranslated as Đan asked: Phào Design, Forti Halo, Gravity, Aeterna, Bent.ch,
Ươm Hoa, AAS, Van Lang, SEE+. Plumbing supports 4 locales for later `ko` and `zh`.

**`contact-form`** — Resend to `kadahnnguyen@gmail.com`, reply-to set to the visitor,
via a Cloudflare Worker holding the API key. Fields exactly as specified above.

---

## 7. Technical decisions

- Static site, GitHub Pages, HTTPS, phone first, verified at 320px.
- Two Cloudflare Workers: OAuth broker for the CMS, mail endpoint for the form.
  Both written account-agnostic, every secret and account ID listed in `HANDOVER.md`
  as a swap value. Nothing hard-codes Khoa's account, domain or tracking IDs.
- Content lives in one obvious place, `/content/<locale>/`, readable after handover
  even without the CMS.
- Palette: warm off-white and grey ground, yellow accent near `#F2CB05` on CTAs,
  links, active states and section markers. Renders stay the loudest element.
- Type: condensed black display face for headings via a self-hosted open-source
  equivalent of Đan's own portfolio type. Humanist sans for Vietnamese body copy,
  diacritics checked.
- Images: extract, resize, compress, `srcset`, lazy load below the fold, alt text in
  the page's own language. The four source PDFs total 15MB and must not set the budget.
- Dev server will not use port 4321.
- No commits, no pushes, no deploys without Khoa saying so each time.

---

## 8. OPEN, needs Khoa

**OPEN-1. The domain names do not exist.** Đan proposed
`phaodesign-dannguyen.designer.com` and `phaodesign-dannguyen.designer.vn`.
`.designer` is not a TLD, so neither is buyable. `.design` is real, which makes
`phaodesign-dannguyen.design` the closest valid match, and `phaodesign.com` or
`phaodesign.vn` the shorter options. The `domain` perk is paid and on, so this needs
an answer. Buying, registrar accounts and credentials are all section 11 escalations.
*I did not raise this in the earlier conflict pass. It belongs there.*

**OPEN-2. Cloudflare ownership: SETTLED 2026-08-17.** Khoa hosts both Workers on his
own account for the build and preview, and they move to Đan after payment clears.
Section 2's promise holds only once the move actually happens, so the migration is a
delivery step, not an optional tidy-up.

Cloudflare has no transfer operation for Workers. Zones move between accounts, Workers
do not. The move is a redeploy of the same source under Đan's `account_id`. What gets
recreated:

| Item | How it moves |
|---|---|
| Worker code | redeploy via wrangler under their `account_id` |
| Secrets | recreated by hand: `RESEND_API_KEY`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` |
| GitHub OAuth App | re-registered under Đan's GitHub, new ID, secret and callback URL |
| Resend account | Đan's own, new API key |
| Worker endpoint URLs | change from Khoa's `workers.dev` subdomain to theirs |
| GA4 / GTM | nothing to move, already in Đan's Google account |

**Code constraint from this:** the static site calls both Workers by URL, so neither
URL may appear in markup. Both live in one config file, referenced everywhere, listed
in `HANDOVER.md` as swap values. `account_id` stays out of the repo entirely.

Two knock-ons. The GitHub OAuth App is a second migration outside Cloudflare,
registered under Khoa now and re-registered under Đan later, which fits A3. And
`gmail.com` cannot be verified as a Resend sending domain, so the from-address will be
Khoa's verified domain or Resend's default until Đan owns a domain. Mail still arrives
at their Gmail with reply-to set to the visitor, as the brief specifies. This is a
second reason OPEN-1 wants an early answer.

**OPEN-3. Cookie consent.** Deferred by F4. Must land before go-live, not before
preview. GA4 stays disconnected in the preview until it does.

**OPEN-4. Wire `zalo.me/0766002264`?** Zalo resolves by phone number, so this is very
likely already live and would unblock the analytics conversion goal. Offered, not
answered. Not wiring it until told.

**OPEN-5. Build approach.** Two locales across 7 templates plus 10 projects is roughly
34 rendered pages. Hand-writing that is unmaintainable, but section 10 wants near-zero
dependencies and no toolchain the client cannot run. Proposal: a small hand-written
Node build script with no runtime dependencies. The alternative is Astro. Needs a call
before any markup gets written.

**OPEN-6. Timeline.** Never asked, never answered. No deadline was given by Đan.
Section 3's "under 3 days" does not apply to a Custom build of this size.

**OPEN-7. Patch `CLIENT-BUILD-CONTEXT.md`?** Section 12 says "six perks" where the
request has eight. Section 6 describes a `client/` folder that does not exist in this
project. Offered, not answered.

**OPEN-9. The contact form needs an email field Đan did not ask for.** Đan specified
exactly five fields: bạn là, tên, số điện thoại, yêu cầu, thông tin khác. No email.
But section 4 requires the Resend mail to carry reply-to set to the visitor, which is
impossible without their address. The two instructions cannot both be met, so an email
field was added and marked required. Say if you would rather keep Đan's list exactly and
drop reply-to, in which case replies happen by phone only.

**OPEN-10. Display line-height is set for worst-case Vietnamese, at a cost.** Measured
in Anton at 100px: Latin caps rise 87px, Vietnamese caps rise 117px and drop 19px below
the baseline, so 1.36 is the smallest line-height where a wrapped heading cannot collide
with itself. That is looser than a condensed display face normally wants. Tightening it
to roughly 1.15 looks better and will occasionally collide on wrapped headings carrying
both a tone mark and a dot-under. Currently correct rather than tight, via `--lh-display`.

**OPEN-12. The homepage hero contains photographs of identifiable children.** Khoa chose
the portfolio cover as the hero on 2026-08-17. Its collage includes a classroom
photograph from Đan's teaching work showing roughly six children's faces clearly, plus a
second frame with a child's hands. F1 covered Đan's own data, not third parties, so this
is new.

On a private PDF sent to one recruiter this is unremarkable. On a public page built to
rank in search it is different: those children are identifiable, they are minors, and
neither they nor their parents agreed to appear on a commercial website. Under Vietnam's
Decree 13 on personal data, images of identifiable people are personal data, and consent
for a minor normally comes from a parent.

Options:
1. Ask Đan whether the school or the parents gave permission for public use. If they did,
   nothing more is needed.
2. Use the cover with that frame replaced or blurred. It is one cell of a six-cell
   collage, so the composition survives.
3. Use a different hero image.

Not blocking a preview, since nothing is live. Must be settled before go-live.

**OPEN-11. The downloadable PDFs republish the data F1 excluded.** F1 says date of
birth and student ID stay off the site. D4 says all four portfolio PDFs plus the CV are
offered as downloads. Those two cannot both hold, because the files themselves carry:

| File | Carries |
|---|---|
| `nguyen-khanh-dan-cv.pdf` | D.O.B 12/08/2003 |
| `...phan-4.pdf`, page 1 | MSSV 2172104020023, lớp K27TKCN02, `nguynkhanhdan1208@gmail.com` |

I quarantined the extracted *images* of that page for exactly this reason, then copied
the *source PDFs* into `static/files/` and linked them. Same data, published anyway.
Nothing is live, so nothing is exposed yet, but this has to be settled before go-live.

Options, in the order I would pick them:
1. Ask Đan for a public version of the CV and of portfolio part 4 with the student
   block removed. Designers usually keep one. Cleanest, and it is their call to make.
2. Hide the downloads section via the D1 toggle until that arrives. One switch.
3. Ship as-is, accepting that DOB and student ID are public and indexed.

Secondary: `static/files/` holds 15MB of PDFs that get committed and pushed. That is
intentional under D4, but it is most of the repo, and it duplicates what now sits in the
gitignored `client-resources/`.

**OPEN-8. B6 positioning, treated as accepted by silence.** Dual CTA built as Đan
specified, their freelance wording kept, employer names not presented as endorsements,
student-seeking keywords confined to `/gioi-thieu`. Reversible on request.

---

## 9. CLIENT, needs Đan

Khoa collects these. Claude never contacts the client.

1. **Source images for five specific projects**, narrowed by the extraction in 5.1:
   WH Just Pure Bottle, Bent.ch Chair, Ươm Hoa, AAS Graphic Portfolio, and Soft Skills
   & Jobs. Those pages were placed in the PDF as flattened spreads, so nothing clean can
   be recovered from them. The other five projects are covered. Higher-resolution
   originals of anything else are welcome but no longer blocking.
2. **Zalo, Messenger and social handles.** Analytics conversion and the social links
   section both depend on them.
3. **The 1200x630 cover image** they said they already had.
4. **Service list and prices.** The goal names "nhiều mức giá" and the price list was
   ticked, but nothing was supplied.
5. **Which domain** they actually want, once OPEN-1 is decided.
6. **Does `phaodesign-dannguyen.designer` exist as a live account?** If so, which
   platform, so it can go in the footer.
7. **Blog:** seed with the three real events from the CV, or leave empty?
8. **Testimonials:** any client willing to give one, or keep the section off?
9. **Two emails appear in the files.** `kadahnnguyen@gmail.com` is being used
   throughout. `nguynkhanhdan1208@gmail.com` appears once on a 2023 student page.
   Worth confirming the second is dead.

---

## 10. Decisions on record

Noted so the reasoning survives, per section 11.

- **F2, third-party marks.** Khoa decided on 2026-08-17 to publish everything as it
  appears in the PDF, including the Dove logo used as a sample inside Đan's own logo
  system for the ticketing kiosk project, the Maserati Ghibli photo and grille badge,
  the stadium photography, and the Van Lang, SEE+, ELLE and c.space marks. Claude
  flagged the Dove logo as the one live commercial mark and recommended swapping it.
- **F3, employer projects.** Khoa decided to publish both the MOVE Viet Nam electric
  vehicle work, which is current employment running to July 2026, and the Bien Hoa
  Ceramics internship, without waiting for clearance. Claude recommended building them
  and shipping hidden until Đan confirmed.
- Both are one toggle away from being switched off if Đan ever objects.
- **F1, personal data.** Phone, email and "Quận 1, TP. Hồ Chí Minh" publish. Date of
  birth 12/08/2003, student ID 2172104020023 and the Điện Biên Phủ street address
  do not.
- Several renders, particularly the Gravity street scenes and the Aeterna kitchen and
  cafeteria scenes, read as AI-generated or heavily composited. Not raised as a
  question and not acted on. Noted only because the site is aimed at recruiters.

---

## 11. Build order

1. OPEN-5 answered, skeleton and content structure stood up.
2. Render extraction and compression from all four PDFs.
3. Vietnamese copy written, homepage and the 5 highlight projects first.
4. Homepage, project index, project template, about.
5. English derived from the Vietnamese.
6. Contact form and the mail Worker.
7. CMS, OAuth broker, section toggle and reorder.
8. SEO, link preview, analytics wiring behind the consent gate.
9. Definition of done, section 9. Checked at 320px, not assumed.
10. `HANDOVER.md`.
11. After payment: repo to Đan's GitHub, both Workers redeployed to their Cloudflare,
    OAuth App re-registered, Resend moved, endpoint URLs swapped in config, live check,
    Khoa removes himself. See OPEN-2 for the full list.
