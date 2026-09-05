# rpv-landing-v2 — Project Instructions

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
- **Number of lines must be the same as the reference.** If the reference shows a 4-line headline, the build has exactly 4 lines — not 3, not 5, not auto-wrapped to whatever fits.
- **Quantity of words per line must be the same as the reference.** If line 2 of the reference has 3 words, line 2 of the build has those same 3 words — verify this by reading the rendered text/line-boxes line by line against the reference, not by eyeballing.
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
