# Final QC audit (30 Oct) — progress file

If the laptop shuts down, continue from the "Fix list" below: anything not ticked is still to do.

## What was checked
Workflow wf_b0b22f2c-d9f: 5 auditors + 5 adversarial checkers, read-only, on `qc-all-preview` (5334035).
Sources: the QC doc + every comment, Alefiya's Loom, all 9 artifacts + design notes, the Added Logic doc, and the decisions log (memory/project-result-page-qc-oct.md).
Full results: `audit-result.json` in this folder (178 requirements: 114 done, 35 decided deviations, 13 partial, 4 wrong, 2 missing, 10 need a decision).
The maths was re-run in node over all 21 test scenarios, 900 ad combos and 56,592 metric combos. Only the edge cases below were found; the main formulas (hero RPV, 12× cap, max added revenue, row 7 figures) are correct.

## Fix list (our bugs — fix on the owning branch, merge into qc-all-preview, push)
- [x] hero-ad-30 Ad budget "Call it $X a year": use annualGain (Logic Doc fixture +$975,000/yr), not 12 × the rounded month — branch section/qc-ad-budget
- [x] hero-ad-28 Ad budget ROAS: decide "good" from the unrounded ratio (0.95–0.99 shows a green 1×); 0× beside a non-zero bar — section/qc-ad-budget
- [x] hero-ad-27 Ad budget bar label clipped when the bar is narrow and the spend line is past 78% — section/qc-ad-budget
- [x] buttons-08 Pillar 3 CRPV demo: "Watch the Nomads Diagnostic Workshop" thumbnail + pill still href="#" → workshop page, new tab — section/qc-workshop-youtube
- [x] buttons-18 Same CRPV demo pills: give them the shared light-blue workshop button style — section/qc-buttons-match
- [x] rows-8-9-08 The Catch: hovering a pillar doesn't dim the other totals (CSS specificity) — section/qc-the-catch
- [x] rows-8-9-09 The Catch: on phones the first tap only flashes (hover + click toggle cancel out) — section/qc-the-catch
- [x] rows-8-9-14 Team Approach: pin the compass image at every side-by-side width (≥861px), keep card stacking gated — section/qc-team-approach
- [x] rows-2-3-4-29 Row 4: chat bubbles pop before the reader scrolls there — start when in view — section/qc-see-how-it-shows-up
- [x] PROGRESS file: add "set DEV_ROUTES_ENABLED = false (src/devRoutes.js) before launch" + DRAFT copy sign-off to the merge steps

## Checked in the browser — left for the user to decide (another session is editing rows 5–7)
- rows-5-6-7-35-V Row 5 proof row: one card in a 3-column grid leaves 2/3 empty above 700px — seen at 1280, reads left-aligned; optional polish
- rows-5-6-7-22 Row 6 GolfBays for capped takers: right half continues the capped card's paper (seen at 1280); the maroon half still sets it apart — optional divider
- [x] rows-2-3-4-35 TwoPaths panel forced <br> — FIXED (see Done)
- hero-ad-29 Ad budget "today" bar stays red when today's ROAS ≥ 1

## Needs a decision (ask the user / Yemi / designer — do NOT change on our own)
- Booking button colour "big bold bright" — waiting for the designer (hero-ad-23, buttons-16, rows-8-9-28)
- Draft copy on the new board (3 strings) — needs Yemi/Alefiya OK before main (rows-8-9-24)
- 5 old September copy notes — waiting for Yemi (rows-8-9-29)
- hero-ad-16 Metric colour judged on the raw value but the cell shows the rounded value ($14.58 shows "$15" in red)
- hero-ad-33 Should the ad budget bars animate like row 5?
- hero-ad-35 Ad slider note says "adjust your ad spend" but the slider changes the traffic share
- hero-ad-40-V Does the 38/32/26 type scale also cover the hero, table and red callout?
- buttons-03 Capped Blocks 5–6: "Answer all 10" headline promises $125K/month (Yemi only)
- buttons-25 Two booking buttons have the arrow before the text (copy doc's own wording)
- rows-8-9-07 Board pencil hidden on phones (≤560px)
- Abdul's merge into main (rows-8-9-30)

## Done so far (tick as fixed, with commit)
- Ad budget (3 fixes): section/qc-ad-budget 3ba2149 + b279ad3, merged into qc-all-preview, PUSHED. VERIFIED in the browser: ad-design (year $750,000, design placement), ad-fixed ($81,200/mo, $975,000/yr = Logic Doc), fixture, ad-zero, ad-slider at 10–100% share, 1280 + 320px: no clipped figures, all in track. (Use the built-in browser for checks — headless Chrome runs the laptop out of memory.)
- Pillar 3 demo: workshop thumbnail + pill → workshop page, new tab (qc-workshop-youtube 503e7ab); demo pills in the shared light-blue look (qc-buttons-match 8023ea1). Merged + PUSHED (qc-all-preview 6c65ef9). VERIFIED in the browser (hrefs, target, colours, screenshot).
- Board: totals dim + first phone tap sticks (qc-the-catch d63e43a; merges clean with qc-catch-fill-together). Merged + PUSHED (qc-all-preview b0908ac). VERIFIED (mouse hover/click/leave, touch tap on/off).
- Team Approach: compass pins at every side-by-side width (qc-team-approach 0e6f345). Merged + PUSHED (qc-all-preview 40149b3). VERIFIED at 1366x657 + 1024x768 (pinned at top 100px; cards still unstacked there by design).
- Row 4 chat bubbles pop when the card comes into view (qc-see-how-it-shows-up 8b2d658). Merged + PUSHED (qc-all-preview 86d508d). VERIFIED in headless Chrome at 1280 + 375 (staggered 0.2/0.6/1.0/1.5s after scrolling in) + reduced motion (all shown). NOTE: the app's built-in browser pane stops drawing when hidden (no rAF / IntersectionObserver) — scroll-triggered checks need headless Chrome, one page at a time.
- Closing panel (TwoPaths): forced <br> removed, column widths give the design's desktop lines, last two words kept together (qc-see-how-it-shows-up aebe9c8 + 3311e48). Merged + PUSHED (qc-all-preview 4432ae2). VERIFIED at 320/375/900/1000/1280: 0 lone words, no overflow; "numbers" no longer stranded at ~860–1200px.

STATUS: all 10 fix-list items DONE, pushed, merged into qc-all-preview (4432ae2 at the time). What's left = the decisions list above (for the user / Yemi / designer).
