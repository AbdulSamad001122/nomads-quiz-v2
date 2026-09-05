# Compounding RPV™ OS — V2 Design System & Direction

## How this document was produced

Derived from a single full-page reference screenshot: `D:\Abdul Samad\Alefiya\rpv-landing-v2\Landing Page.png` (4087 × 32768px native — one continuous export of the whole page). Analyzed by splitting into 9 vertical segments and reviewing each in sequence, top to bottom.

**This is a direction document, not a pixel spec.** Per the brief: don't chase exact spacing/alignment from the reference — extract the *design system* (structure, visual language, color/type rules) and use it to build a better-executed V2, not a clone. **Copy/content stays identical to V1** (same headlines, same stats, same testimonials, same offer) — what changes is the visual execution wrapped around it. Where the reference doesn't show a section that exists in V1 (see "Reference coverage gap" below), this doc extrapolates the same visual system forward rather than leaving it undesigned.

**Reference coverage gap:** the reference image runs from Hero through the Founder/bio section and stops there — it does not show Workshop, Testimonials, the "Aren't you curious" stats section, or the Footer. Section 6 below designs those using the same visual system identified in the covered sections, flagged accordingly.

---

## 0. Governing Design Rules (non-negotiable — apply to every component built from here on)

These were handed down directly (not inferred from the reference image) and **override anything below that conflicts with them**. Sections 2–4 have been corrected to match; this section is the source of truth if a future conflict is ever spotted.

**0.1 Typography — strict per-font usage, no exceptions:**
| Font | Allowed use | Never use for |
|---|---|---|
| **Kilimanjaro** | Short accent words/phrases only — **1–3 words, 5 words absolute max**. | Full headlines. A headline set entirely in Kilimanjaro is a rule violation. |
| **Montserrat Extra Bold** | All main headlines. | — |
| **Montserrat Medium/Regular** | Body copy. | Headlines. |
| **Roboto Mono** | Small labels, captions, tags, single-line text only. | Paragraphs or any multi-line body copy. |
| **Better Brush / Script** | Decorative accents only. | Any text that needs to actually be read for meaning. |

Heading lines also need **open, generous spacing between them** — not tight/cramped leading — so a multi-line headline reads as easy, not dense.

**0.2 Color — foundation vs. accent, not interchangeable:**
| Role | Colors | Usage |
|---|---|---|
| **Foundation** (the page's actual visual weight lives here) | Deep Purple `#250F1C`, Stone `#E4C8BC`, Midnight Blue `#152638` | Backgrounds, large surfaces, the colors the page is "made of." |
| **Accent** (sparingly, for emphasis only) | Purple `#5D1B4E`, Ice Blue `#CAE1F4` | Highlights, small details — **not** the default choice for every highlight box or every section background. |

This is a real shift from V1's palette weighting, where plum (`#5D1B4E`) is the dominant/default color everywhere (buttons, highlight boxes, headers). In V2, plum becomes one accent among several, used deliberately, not by default.

**0.3 Visual richness over cards:** avoid stacking multiple text-only card sections back to back, and avoid reusing the exact same card layout repeatedly down the page. Combine photography, illustration, and text together for visual storytelling — the page should feel cleaner and more premium, not like a repeating grid of boxes.

**0.4 Hero layout:** always image + text side-by-side. The hero must communicate through visuals and copy simultaneously, not copy alone with an image as an afterthought.

**0.5 One focus per section:** every section picks exactly one of — a main headline, a key statistic, or a main graphic (paired with its headline) — as the thing the eye lands on. Supporting text stays simple and quiet so it doesn't compete. If a section currently has three things all shouting for attention, that's a rule violation to fix.

**0.6 Headlines are hand-set, not auto-wrapped:** line breaks in headlines are chosen deliberately (`<br>` / manual breaks) to control which words land together and which word ends a line — never left to the browser's automatic wrapping. Also: **don't over-use purple for text highlights** — balance highlight-box colors across Navy, Beige/Stone, and the other foundation colors instead of defaulting to plum every time (directly ties to 0.2 — plum is an accent, not the default highlight color).

**0.7 Let images overlap:** images/photos are allowed to overlap other elements (text, cards, section edges) when it adds depth — this is a deliberate layering technique for a premium feel, not a bug to fix. Don't force every element into its own separate box/card if overlap would look better.

**0.8 Reference-image fidelity is exact, not approximate — applies to every section, every time a reference image is given:**
- **Copy is verbatim.** Not one word, character, or punctuation mark changes from what's shown in the reference image (matched against copy.js's source string — if the two ever differ, flag it, don't silently pick one).
- **Line count and words-per-line are exact.** If the reference shows a headline broken into 3 lines with 7/3/4 words on each, the built version must break at those same 7/3/4 word boundaries — not "close enough," not left to auto-wrap. Manually verify this by reading the rendered page's text output (or DOM line-box positions) line by line against the reference, not just by eyeballing a screenshot.
- **Font size is matched proportionally to the reference**, not just "large and bold." If a headline reads smaller relative to its container in the reference than what got built, that's a fidelity bug — reduce it to match, don't leave it oversized.
- **Every framing/border/graphic element visible in the reference gets built**, including ones that look like they might be presentation artifacts (e.g. an outer keyline border framing a whole section). Don't silently drop an element because its purpose is unclear — build it, or ask.
- **This rule is not section-specific.** It's the standing process for any future section built from a reference image, not a one-time fix for whichever section prompted this rule.
- **Verification before calling a section done:** load the dev server in the browser tool and check the actual rendered output (text content, line breaks, computed font-size/geometry, and a screenshot when the tool is available) — don't report a reference-image build as complete without that check.

**0.9 Mobile heading alignment — line-count rule (mobile view only):**
- On mobile widths (≤760px), a section heading that renders in **3 lines or fewer is center-aligned**.
- A heading that renders in **more than 3 lines is left-aligned** (long centered headings read ragged and are harder to scan).
- Desktop/tablet alignment is unaffected by this rule — it applies only in the mobile view.
- Line counts are evaluated at ~375px with the uniform mobile heading size (see the `global.css` mobile block, where the current per-heading assignments live). If a heading's copy or mobile font size changes, re-measure its rendered line count and move it to the matching alignment group.
- This applies to every section heading, current and future — assign each new section's heading to the correct group when it's built.

**Known conflict already in the codebase — flagged, not yet fixed:** the Hero section built earlier this session uses the global `h1` rule (`font-family: var(--font-display)`, i.e. Kilimanjaro) for the *entire* headline, and its highlight box is plum-only. Both violate 0.1 and 0.2/0.6 as now defined. This needs a follow-up pass: swap the H1 to Montserrat Extra Bold with Kilimanjaro reserved for just the "$1.5 M/year" or "website visitors?" phrase (not the whole line), and consider whether that highlight box should be Navy or Stone instead of plum. Not fixed in this pass — surfacing it here so it isn't lost.

---

## 1. Page Structure & Sections

The reference keeps V1's information architecture (same funnel logic: hook → qualify → diagnose the mechanism → prove it → offer → objection-handle → prove the founder → close) but treats every section as its own **illustrated "page" in a travel journal/field-notebook**, not a flat content block. Each section reads like a stamped page in an explorer's log — distinct background art, its own border/frame treatment, its own accent color — rather than a uniform scroll of similarly-styled blocks.

| # | Section | Purpose | Connects to next via |
|---|---|---|---|
| A | **Header/Nav** | Minimal persistent wayfinding: logo pill + one-line value prop + CTA pill. | Sits above the fold, frames everything below like a page header in a field guide. |
| B | **Hero** | Hook + immediate proof. Headline with rotating pain-point word, 3-point qualifier list, RPV Snapshot result-card as a "preview of the payoff," trust bar. | Down-arrow + circular dashed-line squiggle graphic physically points down into the next section — a recurring "keep scrolling" wayfinding device. |
| C | **"Not this economy" statement** | Pattern interrupt / tension line. Short, bold, dark, almost a stop-sign. Paired with a realistic laptop photo + a polished analytics-dashboard mockup screenshot (upgrade from V1's plain text-only block) to make the "track real metrics" point concrete. | Circular rotating badge/stamp ("Playful, yet Highly Profitable") bridges the dark section into the next lighter one — a literal seal-of-approval motif marking the transition. |
| D | **Checklist / self-qualification** | "Do you have what it takes" — interactive-feeling checklist over a big **hand-drawn compass rose + antique map background**, reinforcing the "diagnostic as a journey/expedition" metaphor. Cards alternate accent colors (not one flat style) so the list doesn't read as monotonous. | "This way →" 3D signpost-arrow illustration physically directs the eye to the CTA button below the list. |
| E | **Mechanism ("the system")** | Explains the proprietary system. Paired with a **photo of a real whiteboard sketch** (hand-drawn diagram of the OS) inside a rounded dark frame — makes "proprietary system" feel tangible/real instead of abstract. | Direct scroll into the problem section; visual weight shifts from dark framed photo to a light, clinical two-column layout. |
| F | **The 97% problem** | Reframes the addressable market with a **radial/pie infographic** (100 people, 3% vs 97% split, cascading to sub-stats) — this replaces V1's dot-grid infographic with a more editorial, data-journalism-style chart, on a pale mint/sky background (signals "insight," calmer than the surrounding sections). | Puzzle-piece background art (torn-paper photo texture) + bold pull-quote heading bridges to the proof section. |
| G | **Before/After proof table** | Same before/after pairs as V1, but each pair gets a **distinct color treatment** (lavender, tan, sky, blush, mauve rotating through the set) instead of one repeated two-tone card — turns a repetitive list into something that feels like a curated case-file/stamp collection. | CTA button, then straight into the calculator section via a big gradient-purple full-bleed block. |
| H | **RPV Calculator setup** | "Before you spend another dollar" — sets up the two-number reveal (current vs. potential RPV). Large gradient plum→blush background, dashed-arrow + circle doodles, a **"This way" signpost graphic** pointing at the CTA, and a **framed browser-chrome mock screenshot** of the actual RPV calculator output (branded "NOMADS" bar) instead of a wireframe placeholder. | Direct scroll, gradient continues into the "In under 5 minutes" banner. |
| I | **Four areas of the OS** | Same 4 cards as V1, but each card gets its **own small hand-drawn icon** (arrow/target, compass, stopwatch, envelope) instead of a bare number, on a warm cream card over a near-black textured section bg. | CTA, then a circular "Who's Behind?" tab badge overlapping the section seam introduces the founder block. |
| J | *(Workshop — not shown in reference, see Section 6.7)* | | |
| K | **Founder / "Who's behind"** | Big, split treatment: dark map-textured intro band ("Wait… Meet the marketing nerd behind…") → founder photo block with a bold **poster-style nameplate** ("ALEFIYA KHORAKI") stamped under the photo like a passport/ID card → light sky-blue bio column with a big script **"Hey / I'm Alefiya!"** treatment, a numbered-badge 2-item list, and a **wax-seal-style circular badge** ("Every visitor lost is a potential customer gone") as a pull-quote device → closes with a second photo (different pose, rattan chair, warm environmental shot) pairing with the "today I've helped 15+ industries" line. | Direct scroll continuation within the same section (no separate visual break needed — it's one long "meet the person" flow). |
| L | *(Testimonials — not shown, see Section 6.7)* | | |
| M | *(Curious / stats — not shown, see Section 6.7)* | | |
| N | *(Footer — not shown, see Section 6.7)* | | |

**Reusable components implied by the reference (new vs. V1):**
- **Stamp/seal badge** — circular badge with curved text around the rim + icon/text in the center (used 3× in the reference: "Who's Behind?", "Playful yet Highly Profitable", "Every visitor lost..."). One component, reused as a section-transition marker and as a pull-quote device.
- **Signpost arrow** — a 3D-style directional arrow/sign graphic ("This way") used to physically point at CTAs. Decorative, not interactive.
- **Numbered circle badge** — small filled circle with a 2-digit number (01, 02...), replacing plain "1. / 2." list markers.
- **Multi-tone card** — the same card component (checklist item, before/after pair, proof card) but accepting a `tone` prop from a rotating palette instead of one fixed color, so repeated lists don't read as flat/monotonous.
- **Framed device/photo mock** — a rounded-corner dark frame wrapping a real photo or screenshot (whiteboard photo, dashboard screenshot, calculator screenshot), replacing V1's dashed-border `.todo` placeholder boxes now that real assets exist.
- **Hand-drawn doodle layer** — dashed arrows, loop-de-loop squiggles, footprint trails, small circles — a decorative SVG layer sprinkled through section backgrounds as connective tissue, independent of content.

---

## 2. Design Style & Visual Direction

**Overall theme:** premium **"field guide / explorer's journal"** — treats the diagnostic as an expedition ("you already track visitors, but have you mapped the terrain?"). Not corporate-SaaS, not minimal-flat, not futuristic/AI. It's warm, tactile, editorial, a little playful — closer to a well-designed print zine or a boutique travel brand's website than a typical B2B funnel page. This is a significant tonal upgrade from V1, which is clean/direct but visually flatter.

**Style category:** premium boutique-agency / editorial-illustrated. Sits between "modern SaaS" (it still has cards, CTAs, a calculator mock) and "lifestyle/travel brand" (map textures, compass, footprints, wax seals, hand lettering). The result reads as a lot more crafted and less templated than a standard quiz-funnel landing page.

**Visual hierarchy / how attention is guided:**
1. **Color blocking, not just size** — each section has a distinct full-bleed background (cream → dark navy → blush-map → light-mint → cream → dark-plum-gradient → near-black → dark-teal-map → sky-blue), so the eye always knows "I'm in a new chapter" without needing a heading to say so.
2. **Hand-drawn directional cues do real work** — arrows, signposts, and dashed paths are placed to physically aim at the next CTA or section, supplementing (not replacing) normal top-to-bottom reading order.
3. **One highlighted phrase per heading** (solid-color box behind key words) — same device as V1's highlight-sweep, confirmed as the right pattern to keep and carry forward, including its scroll-triggered animation.
4. **Badges/stamps mark "trust" or "transition" moments** — never used mid-paragraph, always at section boundaries or next to a claim that needs a visual stamp of credibility.

**Primary visual elements:** full-bleed textured section backgrounds, the highlighted-phrase text treatment, real photography (founder photos, laptop, whiteboard), stamp/seal badges, numbered circle badges, multi-tone repeating cards.

**Decorative elements:** hand-drawn compass rose, antique map contour lines, dice illustrations, footprint trail, dashed arrow paths, small hollow circles, torn-paper/puzzle-piece textures, a "This way" signpost icon.

**Patterns, gradients, shapes, illustrations, effects:**
- Paper-grain / canvas-grain texture as a base layer on light sections (visible tooth/noise, not flat color) — same technique V1 already uses for its paper-cream tones.
- Soft diagonal gradients on "big statement" sections, built from foundation colors per 0.2 (deep-purple→midnight-blue, stone→cream) rather than plum-heavy by default.
- Hand-illustrated line-art (compass, dice, footprints, arrows) in a muted single-color-on-tint style — never full-color illustration, always monochrome-on-background so it reads as texture, not competing content.
- No glassmorphism, no neon glow, no blur effects, no futuristic gradients — this is a warm/analog aesthetic, not a tech-glow one.

**Binding additions from Section 0, applied here:**
- **Fewer, richer sections over more, flatter cards (0.3):** don't default to "heading + grid of text cards" as the section pattern every time. Where a section currently would just be a card grid, look for a way to fold in a real photo, an illustration, or a layered visual instead of (or alongside) the cards.
- **One dominant focus per section (0.5):** before building a section, name the one thing it's built around — a headline, a stat, or a graphic+headline pair. Every other element in that section should visibly support that one thing, not compete with it. A section with a big headline *and* a big stat *and* a busy illustration all at once is a rule violation to simplify.
- **Overlap is a feature (0.7):** photos should be allowed to bleed over card edges, section boundaries, or sit partially behind/in front of text where it adds depth — this is why the Hero photo overlaps the RPV Snapshot card's top edge, and that pattern should recur elsewhere (founder photo over its nameplate, etc.), not be treated as an alignment bug.

---

## 3. Background & Color System

**Palette — corrected per Section 0.2, this supersedes the reference-only reading below.** Foundation colors carry the page's actual visual weight; accents are deliberate, occasional emphasis, not the default:

| Role | Color | Token to add |
|---|---|---|
| Foundation | Deep Purple `#250F1C` | already exists as `--bg-near-black-plum-2`; promote to primary foundation use |
| Foundation | Stone `#E4C8BC` | **new token needed** — `--stone` |
| Foundation | Midnight Blue `#152638` | already exists as `--bg-navy`; promote to primary foundation use |
| Accent (sparing) | Purple `#5D1B4E` | already exists as `--brand-plum`; **stop treating as the default** — reserve for occasional emphasis |
| Accent (sparing) | Ice Blue `#CAE1F4` | **new token needed** — `--ice-blue` (distinct from existing `--accent-sky-blue: #eaf1fd`, which is paler — don't conflate the two) |

The reference image itself leans heavily on plum/blush/mint tints throughout (see the raw observations below) — useful for texture and section-variety ideas, but the *ratio* of foundation-to-accent needs to shift per 0.2: more Deep Purple / Stone / Midnight Blue doing the heavy lifting, plum dialed back to genuine accent frequency.

**Raw observations from the reference (texture/variety ideas, filtered through the corrected palette above):**

| Element | Guideline |
|---|---|
| **Page background** | No single flat page color — every section is full-bleed and distinct; the "page background" concept doesn't apply the way it would on a flat SaaS site. |
| **Section backgrounds** | Alternate deliberately between light neutrals (cream, stone, blush, mint, ice-blue tints) for reading-heavy sections and dark foundation sections (midnight blue, deep purple) for tension/authority moments (the "not this economy" line, the founder intro, the 4-areas CTA block). Never two adjacent sections share the same background. |
| **Gradients** | Reserved for "big moment" sections only. Prefer foundation-color gradients (deep-purple → midnight-blue, or stone → cream) over plum-heavy ones now that plum is accent-only. |
| **Cards** | Solid fills rotating across a tone set built from the *foundation* palette first (deep purple, midnight blue, stone, cream) with plum/ice-blue appearing only occasionally in the rotation, not as one of the two-or-three main tones. All cards keep V1's hard-edge, hard-shadow language (no soft blur shadows) — this is preserved, not softened. |
| **Buttons** | Same as V1 structurally: light fill, dark ink text, hard offset shadow, hover inverts to a solid dark fill with white text — but the hover fill should be reconsidered as Midnight Blue or Deep Purple rather than automatically plum, per 0.2. |
| **Text colors** | Dark sections → cream/white text. Light sections → ink-dark text. Sample-before-you-choose rule stands unchanged. |
| **Accent colors** | Purple and Ice Blue only — used sparingly (0.2), and highlight boxes should rotate through Navy/Stone/occasional-Purple per 0.6, not default to plum every time. |
| **Glow / blur effects** | None. Zero soft-UI/neumorphism/glow — everything flat, hard-edged, printed-paper in feel. |
| **Borders** | Thin (1–2px) solid borders in ink-dark or white on cards and framed photos/mocks — a "cut paper" edge, not a soft rounded-card edge (radius stays 0 throughout, same as V1). |
| **Shadows** | Hard offset shadows only (no blur radius) — same `shadow-hard` / `shadow-hard-on-dark` tokens V1 already defines. Confirmed correct, keep as-is. |

---

## 4. Typography & Text Hierarchy

**Corrected per Section 0.1 — this is the binding version, not the reference-only reading.** V1 uses Kilimanjaro as the default headline font (via the global `h1, h2, h3 { font-family: var(--font-display) }` rule). **That default is now wrong for V2.** The four-font system stays the same four fonts, but the *job* of each one changes:

| Font | V1's actual usage | V2's required usage |
|---|---|---|
| Kilimanjaro (`--font-display`) | Every heading, full headline text | **Short accent phrases only, 1–3 words (5 max)** — never a full headline |
| Montserrat Extra Bold | Not used for headings | **All main headlines** — this is the new default heading font |
| Montserrat Medium/Regular (`--font-body`) | Body copy | Unchanged — body copy |
| Roboto Mono (`--font-mono`) | Highlight-box text, subheadings | **Small labels/captions/tags/single-line text only** — not for the highlight-box phrases themselves if they run more than one line, and never for anything paragraph-length |
| Better Brush (`--font-script`) | Rare accent word ("nerd", "Hey") | Unchanged — decorative accents only, never load-bearing text |

Practically: a V2 heading like "What would it take to add an additional $1.5 M/year with your current website visitors?" should render in **Montserrat Extra Bold**, with only the short highlighted phrase ("$1.5 M/year") optionally set in Kilimanjaro for contrast — not the whole line. This directly contradicts the global-`h1`-in-Kilimanjaro approach already built for the Hero (flagged in 0.1's "known conflict").

**Heading style:** bold (Montserrat Extra Bold), **generous open spacing between lines** (0.1 — not tight/cramped), left-aligned within their column by default; centered only for full-bleed banner moments not paired with a side visual.

**Line breaks are manual, not automatic (0.6):** every headline's line breaks should be explicitly chosen in the copy/markup, not left to the browser to wrap wherever it runs out of width. This also means headline copy needs to be reviewed per-breakpoint — a manual break that reads well on desktop may need a different break on mobile.

**Highlighted/boxed text:** every major heading still gets one short phrase in a solid-color box with inverted text color (`HighlightSweep`, unchanged as a mechanism) — but per 0.2/0.6, **rotate the box color through Navy, Stone, and occasional Purple**, not plum by default every time.

**Script accent usage:** unchanged from the original reading — decorative only, two patterns: a single accent word inside a bold headline, or a standalone greeting word paired with a bold name/line beneath it (the "Hey / I'm Alefiya!" treatment already built in V1, still valid — note its "I'm Alefiya!" line must be Montserrat Extra Bold, not Kilimanjaro, to comply with 0.1).

**Subtitle/body text:** Montserrat Medium/Regular, generous line-height, comfortable constrained measure (~600–700px equivalent). Bold inline spans pull out the one sentence that matters per paragraph.

**CTA text style:** short, imperative, Montserrat Extra Bold or Bold, paired with a lighter smaller sub-line beneath — two-tier CTA pattern unchanged.

**Defined styles for V2:**
| Style | Spec direction |
|---|---|
| Hero heading | Montserrat Extra Bold, manual line breaks, generous line spacing, one short Kilimanjaro-or-highlight-box phrase (not the whole line), left-aligned. |
| Section heading | Montserrat Extra Bold, manual line breaks, one highlighted phrase (color rotated per 0.6); centered on full-bleed banner sections, left-aligned when paired with a side visual/card. |
| Founder greeting | Script "Hey" (large) directly above Montserrat Extra Bold "I'm Alefiya!" (also large) — tight gap between the two lines. |
| Body text | Montserrat Medium/Regular, ~1.05–1.15rem, constrained measure, selective inline bold. |
| Button text | Montserrat Bold/Extra Bold, short. |
| Card heading | Montserrat Extra Bold, smaller than section headings, sits above 1–3 lines of body copy. |
| Small labels/captions/tags | Roboto Mono — this is now its *only* correct use case. |

---

## 5. Content Structure

**Copy is unchanged from V1 — this section is about presentation, not new messaging.** The reference confirms V1's copy/content strategy is already correct; it just wraps it more richly.

**Messaging pattern per section (unchanged from V1, confirmed by reference):**
- Hero: **benefit-focused** hook + proof preview.
- Not-this-economy: **problem-focused** pattern interrupt, minimal text, maximum visual weight.
- Checklist: **problem-focused** self-qualification, short situational statements.
- Mechanism: **feature-focused**, explains the "how."
- 97% problem: **problem-focused**, reframing/education via infographic.
- Proof table: **benefit-focused**, pure social proof via before/after pairs.
- Calculator: **benefit-focused**, sets up the core value mechanic.
- Four areas: **feature-focused**, program contents.
- Founder: **trust-focused**, origin story + credibility.

**How screenshots/illustrations are used (this is the biggest content-presentation upgrade over V1):** the reference replaces several of V1's placeholder/`todo` boxes with **real, polished visual artifacts** — an actual dashboard screenshot mock, an actual whiteboard-sketch photo, an actual calculator-output screenshot framed in a branded browser chrome. This is the single highest-leverage improvement to carry into V2: wherever V1 currently has a dashed-border "add real asset later" placeholder, V2 should render a realistic, styled mock (even if using a generic/stand-in graphic) rather than an obvious placeholder box — it materially changes how finished the page feels.

**V2 content placement recommendations:**
1. Keep every section's copy byte-for-byte identical to V1 (per the project's standing "copy fidelity is non-negotiable" rule).
2. Upgrade every `.todo` placeholder mock (Mechanism's binoculars box, Workshop's pen box, Calculator's existing screenshot mock) to a fully-styled framed visual, matching the reference's "real artifact in a branded frame" treatment.
3. Introduce the multi-tone card rotation for the Checklist scenarios and the Before/After proof pairs — same content, more varied container styling.
4. Add the stamp/seal badge component at the three transition points identified in Section 1, and the signpost-arrow graphic pointing at the two calculator/checklist CTAs.
5. Add small hand-drawn icons to each of the Four Areas cards (already partially done in V1 with the tick-icon addition — extend that pattern with per-card distinct icons rather than one repeated icon).

---

## 6. Components & Implementation Plan

### 6.1 Section-by-section breakdown (build order, top to bottom)
1. Header (unchanged structurally from V1)
2. Hero — background upgraded to a soft blush/cream diagonal gradient with paper grain; components (`HeroRotator`, `RpvSnapshotCard`, `HighlightSweep`) keep their structure, but the H1 needs its font-family fixed to Montserrat Extra Bold (currently inherits Kilimanjaro from the global heading rule — see 0.1's flagged conflict) and its highlight-box color reconsidered away from plum-by-default per 0.6
3. LogosStrip (unchanged — not addressed by reference, no reason to change)
4. NotThisEconomy — add framed laptop photo + dashboard-mock visual; add the circular rotating stamp badge as the section's closing transition element
5. ChecklistSection — add compass/map background art layer; switch scenario cards to the multi-tone rotation; add signpost-arrow graphic near the CTA
6. Mechanism — add framed whiteboard-photo visual in place of the icon-only mock
7. Problem (97%) — swap the dot-grid infographic for a radial/pie-chart infographic component
8. ProofTable — switch before/after card pairs to the multi-tone rotation
9. Calculator — background upgraded to plum→blush gradient; add framed calculator-screenshot mock in place of the current mock; add signpost-arrow graphic
10. FourAreas — add one distinct hand-drawn-style icon per card (extends the tick-icon work already done)
11. Workshop — no reference shown; extend the system: dark map-textured band consistent with section 5/13's treatment, keep existing copy/CTA structure (see 6.7)
12. MeetTheNerdHeading + Founder — restructure into the reference's richer flow: dark map-texture intro band (already matches current V1 heading section) → photo block gets the poster-style nameplate treatment → bio column gets a wax-seal pull-quote badge for the "Buy or Bye" line → second founder photo added near the closing "today" paragraph
13. Testimonials — no reference shown; extend the system: apply multi-tone card treatment across the two testimonial cards instead of one repeated style (see 6.7)
14. Curious/stats — no reference shown; extend the system: this is a natural home for the stamp/seal badge component next to the stat row (see 6.7)
15. Footer — no reference shown; keep V1's structure, apply the section's established dark-map-texture + gradient-photo-panel language already built (see 6.7)

### 6.2 Component hierarchy (new/changed primitives)

```
primitives/
  HighlightSweep         (existing — confirmed correct, no changes)
  Reveal                 (existing — confirmed correct, no changes)
  StampBadge   [NEW]      circular badge, curved rim text optional, icon/text center
  SignpostArrow [NEW]     decorative SVG, positioned near a CTA, no interaction
  NumberedBadge [NEW]     small filled circle + 2-digit number, replaces plain "1./2." markers
  FramedMock    [NEW]     rounded dark frame wrapping a photo/screenshot, replaces `.todo` placeholders
  ToneCard      [NEW]     card primitive accepting a `tone` prop cycling a defined palette array
```

### 6.3 Styling direction
- Keep all existing design tokens (spacing scale, radius-flat, shadow-hard) — no token system rewrite needed, this is additive.
- **Add two new color tokens** to `tokens.css`: `--stone: #E4C8BC` and `--ice-blue: #CAE1F4` (distinct from the existing paler `--accent-sky-blue`). `--bg-near-black-plum-2` (`#250F1C`) and `--bg-navy` (`#152638`) already exist and should be promoted to primary/foundation use per 0.2.
- Add new section-background texture assets (map/compass art, torn-paper/puzzle texture) following the exact same pattern already established in `Section.jsx`'s `TEXTURES` map + matching text-color rule in `Section.css`.
- `CARD_TONES` array should draw primarily from foundation colors (`[deep-purple, midnight-blue, stone, cream]`) with plum/ice-blue appearing only occasionally in the rotation, not as two of only four tones — per 0.2, they're accents, not equal partners with the foundation set.
- Before building each section, apply 0.5 explicitly: write down its one focal element first, then build supporting parts around it — don't build all elements at equal visual weight and sort out hierarchy after.

### 6.4 Background specifications
- Every new section background must have its **average brightness sampled before choosing text color** (the rule already established and learned the hard way in V1 — see design-v1's Section 5.6 equivalent guidance) — no assuming a new textured asset is dark or light without checking.
- Map/compass/doodle art layers render as a low-contrast background layer (behind content, `z-index` below the `.wrap` content), never competing with foreground text for attention.

### 6.5 Typography guidelines
- No new font files — but the global `h1, h2, h3 { font-family: var(--font-display) }` rule inherited from V1 must be overridden per Section 0.1/4: **headlines use Montserrat Extra Bold**, `--font-display` (Kilimanjaro) is reserved for short 1–3-word accent phrases only. This likely means removing the blanket heading rule from `global.css` and setting heading font-family explicitly per-component instead, since "headline vs. short accent phrase" isn't something a blanket tag-selector rule can distinguish.
- `--font-mono` (Roboto Mono) usage narrows to labels/tags/captions only — audit any existing usage that spans more than one line or reads as a sentence, and move it to `--font-body` instead.
- `--font-script` (Better Brush) stays decorative-only, unchanged.
- Continue the `HighlightSweep` pattern for one phrase per major heading, but vary its color per 0.6 (Navy/Stone/occasional-Purple) rather than defaulting every instance to plum.

### 6.6 UI patterns
- Stamp/seal badges and signpost arrows are **decorative only** — no click targets, no `aria-hidden` omission (mark them `aria-hidden="true"` since they carry no unique information beyond what the surrounding text already says).
- Multi-tone cards must keep sufficient contrast for every tone in the rotation (test each tone × text-color pairing, don't assume one contrast check covers all of them).

### 6.7 Sections not covered by the reference — extrapolated direction
- **Workshop:** apply the dark map-textured band treatment (same visual family as the Founder intro band and the 4-areas CTA block) — it's thematically a "next step" section, fitting the same "authority/dark" section rhythm already established at similar points in the page.
- **Testimonials:** apply `ToneCard` — two testimonial cards, two different tones from the rotation, instead of both sharing one fixed style.
- **Curious/stats:** natural placement for a `StampBadge` next to or above the stat row (a "proof stamp" moment, consistent with how badges are used elsewhere as credibility markers).
- **Footer:** no change needed beyond what V1 already has (gradient photo panel, highlighted signature line) — it already matches this system's visual language; if anything, add one small doodle-arrow accent near the CTA for consistency with the rest of the page's wayfinding motif.

### 6.8 Responsive behavior considerations
- Full-bleed textured/gradient backgrounds must remain full-bleed at every breakpoint (same `cover`/`center` background rules V1 already uses).
- Decorative illustration layers (compass, footprints, signpost arrows) should be **de-prioritized or hidden below a tablet breakpoint** rather than shrunk — at narrow widths they compete with content for limited space; V1's existing pattern of hiding/simplifying decorative elements on mobile (established across this build) applies directly here.
- Multi-tone cards and framed mocks must degrade to full-width single-column stacking below the existing grid breakpoints already defined per-section in V1 — no new breakpoint values needed, reuse what's there (760px/860px/640px as applicable per section).
- Stamp badges that overlap a section seam (e.g. "Who's Behind?") need a mobile fallback position (typically: inline above the heading instead of absolutely-positioned overlapping the boundary) since absolute overlap positioning is fragile at narrow widths — this project already hit and fixed several absolute-positioning mobile bugs (hero badge, footer photo) this session; apply the same "test the narrowest viewport before shipping" discipline to every new absolutely-positioned decorative element.
