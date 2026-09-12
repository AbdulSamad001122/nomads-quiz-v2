# rpv-landing-v2 — Project Instructions

## Git workflow (two-person team)

- Abdul Samad works on `main` and is the only one who merges branches into `main`.
- Everyone else: build each result-page section on its own branch, created FROM FRESH MAIN — never from another feature branch:
  1. `git checkout main`
  2. `git pull origin main`
  3. `git checkout -b section/<section-name>`
- One section per branch, only that section's commits on it. When done: `git push origin section/<name>` and stop — do not merge into `main` yourself.
- Never stack a new section branch on top of a previous section branch (chained branches can't be merged independently).

## Definition of done for any UI/frontend task

Never report a UI task as complete without verifying it in the running browser first. This applies to every task in this project, not just ones where the user explicitly asks for it.

1. Start (or reuse) the dev server preview and load the page.
2. Verify with **both**:
   - A real screenshot (`computer` action) — if the Browser pane isn't displaying (blank/squeezed/timeout), say so explicitly and fall back to DOM checks (`get_page_text`, `read_page`, `javascript_exec` for computed styles/geometry) rather than silently skipping verification.
   - The actual rendered content matching what was asked — text, line breaks, colors, spacing, images loaded.
3. If anything is wrong: fix it, then re-verify. Repeat until it's actually correct — don't stop after one fix-attempt without checking the result.
4. Only then tell the user it's done. If something couldn't be verified (tooling limitation), say that plainly instead of claiming success.

Don't ask the user to manually check — verify and show proof (screenshot or specific computed values) directly.

## Reference-image fidelity (see design-v2.md Section 0.8)

When the user gives a reference image for a section's design, match it exactly — this is a direct, standing user rule, not a one-time fix for whichever section prompted it:
- **Every word must be the same as the reference.** No word, character, or punctuation mark changes from what's shown in the image (cross-check against `copy.js`; if the two ever conflict, flag it, don't silently pick one).
- **Line breaks: NEVER use forced `<br>` tags just to copy the reference's text wrapping** (user rule, Sep 12 — supersedes the old exact-line-map rule). Text flows naturally; approximate the reference's line layout with `max-width`/column widths instead, so it reflows cleanly at every screen size. `<br>` is allowed only as a structural boundary between differently-styled text elements (e.g. a script-font line under a headline).
- Font size proportions match the reference, not just "bold and big."
- Every visible framing/border/graphic element gets built — don't skip something because its purpose is unclear.
- **Casing matches the reference, not whatever case `copy.js` happens to store.** If the reference shows a headline/button/label in sentence case, render it in sentence case — don't apply `text-transform: uppercase/capitalize`, and don't parrot an ALL-CAPS (or any other case) source string, unless the reference itself shows that casing or the user explicitly asks for it. If `copy.js`'s casing conflicts with the reference, flag it and default to matching the reference.

This is the standing process for every section built from a reference image, going forward.

## Responsiveness is mandatory for every section

Every section built in this project must be responsive — this is never optional and never left for later:
- Every new/edited section needs working styles across breakpoints (mobile, tablet, desktop) — don't ship a section that only looks right at one width.
- Before calling any section done, use the browser tool to actually check it at multiple viewport widths (e.g. via `resize_window` — mobile ~375px, tablet ~768px, desktop ~1280px+) and confirm: no horizontal overflow, no overlapping/clipped elements, text stays readable, images/layout adapt sensibly.
- If a section breaks or looks wrong at any checked width, fix it and re-check — same fix-then-reverify loop as the general verification rule above, applied specifically to each breakpoint.
- This applies to every section going forward, not just ones the user flags as broken.

## Design system

`design-v2.md` is the binding design system for this project (Section 0 = non-negotiable rules). Read it before building new sections.
