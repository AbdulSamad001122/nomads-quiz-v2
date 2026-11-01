# Result page QC — where we stopped (30 Oct 2026)

All work is committed and pushed to origin. Nothing is merged into `main` yet.

**FOR ALEFIYA + YEMI'S REVIEW: branch `result-page-review`** (pushed 30 Oct to BOTH origin and alefiya, = qc-all-preview 7eb55bd: main + every result-page section branch + the other chat's row 5/7 work). Make its Vercel preview and share `<preview URL>/?results=fixture` (other views: capped, one-red, healthy, ad-design…). If more changes land later, update it with: `git checkout result-page-review && git merge qc-all-preview && git push`.

**SHARE LINK (verified 30 Oct, public, no login):** https://nomads-quiz-git-result-page-review-nomads-marketing.vercel.app/?results=fixture — always the latest `result-page-review` (Alefiya's Vercel). Snapshot: https://nomads-quiz-azbf9mclx-nomads-marketing.vercel.app/?results=fixture. The bare link (no `?results=`) opens the quiz start, not the results. Checked on the preview: every QC change present, all links right, no errors, no overflow at 375/1280.

- **Preview with all changes:** branch `qc-all-preview` on Vercel (needs the Vercel login; each push makes a new URL — find the latest under the branch's deployments)
- **On this computer:** http://localhost:3000/?results=fixture (start the `quiz-dev` server first)
- **On a phone (same Wi-Fi):** http://192.168.100.38:3000/?results=fixture (other views: swap `fixture` for capped, cap-small, capped4–7, healthy, one-red, ad-design, ad-fixed, ad-slider, ad-zero, ad-none, split-normal, split-low, split-noemail, split-hidden, no-blocks)
- **Final audit (30 Oct):** `final-audit-30oct/FINAL AUDIT - progress.md` — 178 requirements checked; fixes + open decisions listed there
- **Status page:** `Result page QC changes doc - STATUS 27 Oct.html` (in this folder)

## Done (built, checked 320–1920px, in the preview)
| QC item | Branch |
|---|---|
| Hero fixes, capped-taker line (C1), table decimals | `section/qc-hero-fixes` |
| Row 2 red metrics + "Answer all 10 questions" headline (item 6) | `section/qc-red-metrics-reason` |
| Row 3 data nerds (includes the calculator link) | `section/qc-data-nerds` |
| Row 4 "See How It Shows Up" | `section/qc-see-how-it-shows-up` |
| Row 5 stop at $1.5M / max, + row 6 GolfBays split layout with the founders image | `section/qc-stop-or-max` |
| GolfBays figure £96,000+ in 12 days (C5) | `section/qc-golfbays-figure` |
| Row 7 revenue per subscriber cards | `section/qc-rps-cards` |
| Row 8 "Here's the catch" blank scorecard | `section/qc-the-catch` |
| Row 9 team approach | `section/qc-team-approach` |
| Row 10 pillars | `section/qc-pillars` |
| Row 11 buttons match the top bar | `section/qc-buttons-match` |
| Item 5 ad budget | `section/qc-ad-budget` |
| Item 7 workshop buttons centred | `section/qc-workshop-buttons-centred` |
| Item 8 workshop page link + videos removed | `section/qc-workshop-youtube` |
| Responsive pass (headings, phone buttons) | `section/qc-responsive-pass` |
| One type scale for all new sections (headings 38/32/26px, subheadings 18–24px, body 16px) + white workshop line in the red-metric box | `section/qc-type-scale` |

All questions to Yemi are answered (C2 closed as answered: no change).

## Still to do
1. ~~GolfBays photo~~ done (`results-golfbays-photo.webp`).
2. **Brighter book-a-call colour** from the designer: change `--rbtn-book-bg` in `src/results/results.css`.
3. **Older September copy notes** (need Yemi's words): "brace yourself! lots of math tbd here" bullet; "Behind the number" lead-conversion line; Samar pie "20x"; Lara's title shown twice; Louis's numbers differ between quiz and results.
4. **Launch (Abdul):** merge the branches above into `main` (start with `section/qc-hero-fixes`; skip `section/qc-calculator-links`, row 3 contains it; rows 5 and 7 conflict in `ResultsPage.jsx` and `resolveTokens.js` — keep both sides), push to origin and alefiya, then click the workshop and booking buttons on the live page once.
5. **Before launch:** set `DEV_ROUTES_ENABLED = false` in `src/devRoutes.js` (the `?results=` test views are still switched on, also on the live site), and get Yemi/Alefiya's OK on the three draft lines on the new board ("1 of 4 pillars scored", "We'll fill in the rest together.", "We score this one together, live.") before `section/qc-catch-fill-together` goes to main.

## Rule from Alefiya (30 Oct)
Any new or rebuilt results section must match the new sections' style: big bold headlines, same colours, cards and buttons.

## Later on 30 Oct (user tweaks)
- Row 5: "to their max" is white; "stop at $1.5M" and row 2's "Reason Behind" now get the light-blue/dark-blue highlight sweep (the quiz's sweep, in the results page's blues).
- Row 5's sweep sits on its own branch `section/qc-stop-or-max-sweep`, because another session was committing to `section/qc-stop-or-max` at the same time. For launch, merge `section/qc-stop-or-max` first, then `section/qc-stop-or-max-sweep` (tested: they merge cleanly).
- Scorecard handwriting is now Caveat (clearer).
- New scorecard board (`section/qc-catch-fill-together`) is now IN the preview (user approved, 30 Oct): sticky note "1 of 4 pillars scored", arrow to the "?"s, hover bubble. The words are still draft; they need Yemi/Alefiya's OK. For launch, merge it after `section/qc-the-catch` (it builds on it).

## Final audit fixes (30 Oct, evening) — all pushed + in the preview
- Ad budget: "Call it $X a year" from the unrounded gain (Logic Doc example now $975,000), ROAS colour from the true ratio, bar figures never clipped — `section/qc-ad-budget`
- Pillar 3 demo: workshop thumbnail + pill open the workshop page (were `#`) — `section/qc-workshop-youtube`; its pills in the shared button look — `section/qc-buttons-match`
- Board: the other totals dim on hover; first tap sticks on phones — `section/qc-the-catch`
- Team approach: compass image pins on short laptops too — `section/qc-team-approach`
- Row 4: chat bubbles pop when you reach them; closing panel without forced line breaks — `section/qc-see-how-it-shows-up`

- Row 7 (30 Oct, evening): every card now has the same gap above the calculator box on phones (`section/qc-rps-cards` 8d795d7); in `result-page-review` d2e27cc on both remotes.
