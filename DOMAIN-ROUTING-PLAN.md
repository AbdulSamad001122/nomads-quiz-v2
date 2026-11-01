# Domain routing + results saving: detailed plan

Working notes, not committed to either repo.

**Status (Oct 6 2026):** built, locally verified, and reviewed by independent reviewers. Committed and pushed:
- Quiz `section/domain-routing` @ `7dcc450` (origin + alefiya).
- Landing `section/domain-routing` @ `2df2f38` (origin + alefiya).

Vercel built both previews; both sit behind Vercel login. **Next:** Share links from the user (or a merge decision), then the real-Vercel checks in section 6.5.

**Maintenance rule (from review):** the 10 font files both repos ship in `public/fonts` must stay byte-identical. The landing's copy is what the domain serves. Never add a file to the landing's lowercase `/assets/` or `/fonts/` that shares a name with a quiz file.

## 1. Final addresses

| Address | Shows | Served by |
|---|---|---|
| `diagnostic.nomadsmarketing.co/` | redirects to `/opt-in` | landing project |
| `diagnostic.nomadsmarketing.co/opt-in` | landing page | landing project (its own `index.html`) |
| `diagnostic.nomadsmarketing.co/diagnostic-start-now` | quiz (welcome → questions → opt-in) | quiz project, passed through by the landing |
| `diagnostic.nomadsmarketing.co/diagnostic-results` | results page | quiz project, passed through by the landing |

Both projects stay separate (own Vercel project, own GitHub repo, own folder). The domain is added to the **landing** project only. `nomads-quiz.vercel.app` stays live, because it's what the landing passes through to.

## 2. Hard rules from the user
- **No design and no copy changes.** Only link targets, routing config, analytics tags and the results address/saving logic change.
- **Never show old results once a new attempt starts.** Saved results are deleted the moment "Start the Diagnostic" is pressed, and a new quiz never pre-fills old answers.
- **Kit stays quiz-only.** The landing gets GA4 and Clarity (same IDs as the quiz), not Kit.
- **Git:** a branch per repo from fresh `main`; push the branches; never merge into `main` without the user saying so.
- **Testing:** only `@example.com` test emails, all listed for deletion afterwards.

## 3. Quiz repo changes (`Quiz`, branch `section/domain-routing`)

| File | Change |
|---|---|
| `vercel.json` (new) | `trailingSlash: false`; rewrites `/diagnostic-start-now` and `/diagnostic-results` → `/index.html`, so both addresses also work (and survive refresh) on `nomads-quiz.vercel.app`. `/` keeps working as before. |
| `src/routes.js` (new) | `START_PATH`, `RESULTS_PATH`, `currentRoute()` (ignores trailing slashes). |
| `src/results/savedResults.js` (new) | `saveResults`, `loadResults`, `clearResults`. Uses localStorage key `nomadsRpvResults`. Saves `{ v, fp, savedAt, answers, manualValues }`: version number, quiz fingerprint (question + option ids), timestamp, and the answers. No name, email or free text (those live outside `answers`). Expires 30 days after completion. Every storage call is wrapped in try/catch; invalid, expired, future-dated or other-version data is deleted and ignored. |
| `src/results/savedResults.test.js` (new) | Node tests: round trip, expiry, future date, wrong version, changed quiz, corrupt JSON, wrong shapes, blocked storage (getItem/setItem/removeItem throw), quota error, clear. |
| `src/App.jsx` | On `/diagnostic-results`: load the saved answers and check they still calculate. If yes, show the results (`<QuizFlow restored>`); if not, delete them and `location.replace('/diagnostic-start-now' + query)`. Dev query routes (`?results`, `?slides`, …) keep priority, as today. |
| `src/components/quiz/QuizFlow.jsx` | (a) Start click deletes saved results. (b) On reaching valid results in a live run: save the answers and `history.replaceState` the address to `/diagnostic-results`. (c) A restored page starts on the results screen and does **not** fire `quiz_complete` / `results_view` again; Kit is never involved (Kit only fires on the opt-in submit). (d) Dev `?goto=` jumps don't save or switch the address. |
| `src/DevSlides.jsx`, `src/DevAdCopy.jsx`, `src/DevAnswerCheck.jsx` | Dev links `/?…` → `/diagnostic-start-now?…`, because `/` on the domain now goes to the landing page. Dev pages only. |
| Later, once the domain is live | Pillar 3 demo link (`rpv-landing-page-v3.vercel.app`) → `diagnostic.nomadsmarketing.co/opt-in` (through the CRPV generator, never by hand-editing generated files). |

## 4. Landing repo changes (`rpv-landing-v3`, branch `section/domain-routing`)

| File | Change |
|---|---|
| `vercel.json` | Keep the existing `headers`. Add `trailingSlash: false`, a redirect `/` → `/opt-in` (temporary), and rewrites: `/opt-in` → `/index.html`; `/diagnostic-start-now` and `/diagnostic-results` → `https://nomads-quiz.vercel.app/`; `/assets/:path*`, `/fonts/:path*`, `/api/:path*` → the same paths on the quiz project. The landing's own files are served first, so only quiz files pass through. |
| 9 CTA buttons | `https://nomads-quiz-v2.vercel.app/` (the OLD quiz) → `/diagnostic-start-now` (same tab, as now). |
| `src/analytics/ga.js`, `src/analytics/clarity.js` (new), `src/main.jsx` | GA4 `G-HP0WTDLWJ7` + Clarity, the same IDs and the same production/dev split as the quiz (production → live projects; local dev → Clarity test project, GA off unless `VITE_GA_DEV=true`). Base tags only, no new events. |

## 5. Edge cases (expected behaviour)

| # | Case | Expected |
|---|---|---|
| 1 | Finish quiz | Results show; address becomes `/diagnostic-results`; answers saved |
| 2 | Refresh on results | Same results, same numbers; no second Kit push; no second `quiz_complete`/`results_view` |
| 3 | Close tab, come back within 30 days (same browser) | Results show |
| 4 | Come back after 30 days | Sent to start; old data deleted |
| 5 | Open results link with nothing saved, on another device, or in incognito | Sent to `/diagnostic-start-now` (query kept); no error |
| 6 | Start a new attempt ("Start the Diagnostic") | Old results deleted immediately |
| 7 | New attempt abandoned, then results link opened | Sent to start (no old results) |
| 8 | New attempt finished | Only the new results are saved and shown |
| 9 | Disqualified | Nothing saved; results link goes to start |
| 10 | "Missing numbers" fallback | Nothing saved; no address switch |
| 11 | Storage blocked or full | Quiz and results work as today; refresh on results goes to start |
| 12 | Corrupt or old-version saved data, or the quiz questions changed | Deleted and ignored → start; never a crash or wrong numbers |
| 13 | Browser back from results | Goes to the page before the quiz (the landing), not into a broken quiz |
| 14 | Trailing slash (`/opt-in/` etc.) | Redirects to the address without the slash, then works |
| 15 | `?utm_…` on any address | Kept through the `/` → `/opt-in` redirect and the pass-through; GA4 sees it on the landing page |
| 16 | Unknown address | 404, not the quiz |
| 17 | `nomads-quiz.vercel.app` direct | Still works at `/`, `/diagnostic-start-now`, `/diagnostic-results` |
| 18 | Dev routes (`?results=…`, `?slides`, `?goto=…`) | Still work at `/diagnostic-start-now?…`; never touch saved data |
| 19 | Two tabs | Latest finished quiz wins; no errors |
| 20 | Ad-spend slider | Resets to its default on refresh (only answers are saved) |

## 6. Verification plan
1. **Unit tests:** the 3 existing suites plus the new saved-results suite.
2. **Builds:** both projects build with no new warnings.
3. **Local integration test:** a throwaway local server that reads the landing's real `vercel.json` and applies its redirect/rewrite rules, with the quiz build and the real Kit handler (test tag `crpv-quiz-test`). Walk every edge case in the browser, with console and network checks.
4. **Proof of no design or copy change:** before/after screenshots and rendered-text comparison of the landing page and quiz screens at 375 / 768 / 1280 px.
5. **Real Vercel previews:** same journey on the preview links. Kit check (API 200 + subscriber lookup), GA4 (`/g/collect` hits: landing `page_view`, quiz events, results `page_view`, no duplicates after refresh), Clarity (uploads accepted; the user confirms one recording from their own browser, since Clarity hides the test browser).
6. **Speed:** page timings through the domain pass-through vs. the direct quiz URL.
7. **Independent review:** separate reviewers check the diffs for bugs, missed edge cases, and any design/copy change.

## 7. Order and the user's steps
1. Quiz branch → tests → preview check → **user merges** (works on `nomads-quiz.vercel.app` at every step).
2. Landing branch → full journey on its preview → **user merges**.
3. **User adds the domain** to the landing project in Vercel and the CNAME at the DNS provider.
4. Final live test on the real domain; update the Pillar 3 demo link; list the test subscribers to delete in Kit.

## 8. Known limits
- Safari (including iPhone) may wipe saved site data after about 7 days without a visit, so the visitor goes to the start (handled by case 5).
- Results can't be reopened on a different device or browser (no server storage, by design).
- Preview links may need a Vercel "Share" link from the user if they're protected.
