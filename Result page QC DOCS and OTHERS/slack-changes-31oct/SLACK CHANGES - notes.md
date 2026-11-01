# Alefiya's Slack changes (31 Oct) — notes

The user pastes the messages one at a time. For each: what she asks, where it is in the code, clear or not. NOTHING is built yet — wait for the user's go.

## Message 1 (4 requests in one message)

### 1a · "make this number big green like in the hero"
- Where: row 2 light half, the bold "Answer all 10 questions… move your RPV™ toward **$6.42** and add $125K/month…" headline (RED_METRICS.answerBefore/answerAfter in copy.js ~233; RedMetricsWorkshop.css ~468). $6.42 = the taker's {{goal_rpv}} (dynamic).
- Now: small stone/pink box, plum text.
- Hero goal card: green #72e2a7 text, green tint box, border #6fd6a0, weight 800, up to 76px — on dark navy.
- Clear: YES. Note: the hero's light green is unreadable on this white card → use the darker brand goal green (#2a9a5e, row 5's goal green on light backgrounds) in the same green box style, and bigger.

### 1b · "Pick a day and time, and bring your Revenue Per Visitor (RPV) number to the C-RPV Game Plan Call with me." — "make this bigger pls - and open the abbreviations here"
- Where: RED_METRICS_CALL.body (copy.js ~253), the booking box right after the red-metrics section ("Already know you want a second set of expert eyes on your business?"). GamePlanCta component, .rgp__body = 16px (shared with the later game-plan box).
- Bigger: clear (e.g. 20px).
- Abbreviations: "C-RPV" → "Compounding Revenue Per Visitor™"; "(RPV)" dropped. Proposed: "Pick a day and time, and bring your Revenue Per Visitor number to the Compounding Revenue Per Visitor™ Game Plan Call with me." (OUR wording — needs the user's OK.)
- Open: bigger in both booking boxes (same component) or only this one?

### 1c · Row 5 stop card ("Stop here · your goal") — "The copy here isn't clear. It needs to be clear: by increasing your revenue per visitor from 2.25 to 6.25, you'll add 1.5 million a year without adding a penny to your current marketing or ad spend."
- Where: STOP_OR_PUSH stop* (copy.js ~1622–1628), StopOrPush.jsx ~176–189.
- Clear: one plain sentence; numbers stay per taker ($2.25 → $6.42 in the sample; her "6.25" is loose typing); "marketing OR ad spend".
- Open: keep the big "+$1.5M/year ($125K/mo)" figure or replace it with the sentence? Keep "And nope, you don't need to max out all 5 metrics to get there."?

### 1d · Row 5 max card — "Buuuuuuut...if you hit the maximum benchmark across all five conversion points, **your existing traffic could add** ____"
- Where: STOP_OR_PUSH maxIf/maxLead (copy.js ~1635–1637) + the joint "But… what if you did?" (c.but).
- Change: "Buuuuuuut..." (7 u's) in front of the max sentence; ____ = the taker's max figure (already there).
- Open: the joint already says "But… what if you did?" — keep both or replace? Bold moves to "your existing traffic could add" (now on "maximum benchmark…").

Status: waiting for the next messages (1c/1d may continue there).

## DONE (31 Oct)
- 1a + 1b built on NEW branch `result-page-slack-changes` (from qc-all-preview d2e27cc = all previous changes), commit b070972, pushed to origin. $6.42 green box #1f7a48 text, 1.4em; call line spelled out, 20px desktop / 18px phones (only this booking box; the later one stays 16px). Local: http://localhost:5201/?results=fixture (worktree D:/Abdul Samad/Alefiya/Quiz-slack).
- 1c, 1d: waiting for answers / next messages.
- 1d DONE: max card opens "Buuuuuuut...if you hit the maximum benchmark across all five conversion points," (only the box text; the "But… what if you did?" line between the cards unchanged) — 8845763, pushed.
- 1c WAITING: asked Alefiya (31 Oct) whether to remove the "And nope, you don't need to max out all 5 metrics to get there." line. Decided by user: keep the big "+$1.5M/year" number and make it BIGGER; rewrite the card text as her sentence. Do NOT build until the user passes on her reply.

## Message 2 (31 Oct) — DONE on result-page-slack-changes (fd35ab0 + fixes, f2638f6), pushed
- Block 1 "Around X% of your revenue…" line = big bold headline, shared scale 38/32/26 (results.css list + .rsb__head font in ResultBlocks.css), max-width 900.
- Calculator moved OUT of row 7's box into its own full-width section `.rcs-calc` right after `.rcs`: left = copy on plain cream #f7f1e6, right = preview on maroon crumple texture (like GolfBays); stacks (copy, then preview) up to 1100px; button plum #5d1b4e / white (user: theme colour); arrow kept with last word. Verified 1280/1180/1100/900/375/320, no overflow, no errors.

## Message 3 (31 Oct) — DONE on result-page-slack-changes (7b48915, 135cfb4 + intro balance), pushed
- Ad budget: inner 1000 to 1180px; chart title = light-blue chip; bigger Today / At your RPV goal labels (18px) + ROAS chips (13px); more gaps; only the figure in each verdict picked out ($2.50 / $7.20, 1.4em); dim grey text brighter; +$81,200 in a hero-style green goal box (#72e2a7 on green tint, 64px); Call it $975,000 a year bigger with the figure picked out.
- Data nerds Calculate button: white, plum text, pink shadow.
- Calculator left side: GolfBays lined paper texture (005195b).

## Message 4 (31 Oct)
- 4.1 DONE: WEAKEST_PILLAR.para2After ". An action with a number attached to it." (Alefiya punctuation), pushed.
- 4.2 waiting: italics on *who* / *what* in CLIENT_DAVID box line? (words already identical)
- 4.3 waiting: row 4 steps advance on scroll (desktop pinned stepper; phones stacked) — user to confirm.
- 4.2 DONE: CLIENT_DAVID first box line with <em>who</em> / <em>what</em> (boxEmFirst + Italics in ClientDavid.jsx), pushed. Bold figures in the weakest-pillar line now same colour as the line (fc7016c).
- 4.3 DONE: row 4 steps move with scrolling (SeeHowItShowsUp): mode "pin" when the tallest card fits (desktop windows ~770px+ tall, >=861 wide) — buttons + card stick under the top bar, 01→04 over ~0.55 screen of scroll each, step 04 held too, then the page carries on; mode "stack" (phones, short laptops like 1366x657) — all cards follow one another, step buttons stuck at the top light up. Back/Next removed. .rsh overflow hidden→clip (sticky). Verified 1920x1080, 1440x900 (pin), 1366x657, 375x812 (stack), clicks, no overflow, no errors. Pushed.
- 4.3 REDONE (user: horizontal carousel, not bottom-to-top): 923d3cc — pin mode (>=861 wide, scale >= 0.72; 1366x657 runs at 0.80): sticky stage, page scroll slides .rsh__rail left via --rsh-p (hold 35% then ease), step 04 held; swipe mode (phones): horizontal scroll-snap strip, 88% cards with peek, strip height follows card, steps follow, auto scroll-back if reader was low on a tall card. Verified 1440x900 + 1366x657 scroll, 375 + 320 real touch swipes + tap. Pushed. Review workflow wf_fd258e02-8b6 running.
- 4.3 gap + review fixes (198860c, f125a3d): pinned strip height follows the card in view (no band under 04; next part 17-20px below); scaled stage margin pulled up; review wf_fd258e02-8b6 fixes — Back/Next back in swipe mode (mouse users + phones, between steps and card), always measure in pin layout (.rsh--measure) + hysteresis 0.76 in / 0.72 out, swipe height + scroll-back only after the swipe settles and only after a real swipe, track scrollLeft reset in pin + overflow clip, keep card on pin<->swipe switch, ignore <120px height-only resizes (phone toolbars), pin only where overflow: clip is supported, card 04 shadow room. Verified 1920x1080/1440x900/1366x657 pin, 375 swipes, 1100x520 fallback Back/Next, tablet rotation. Pushed.

## 31 Oct (later)
- JITTER FIXED (user video): cause = pinned strip height changing at each card settle -> browser scroll anchoring shifted the page -> strip moved back -> height flipped again (cards shook ±10px, up to 410px). Fix a10f189: no height changes inside the pinned stage; a fixed negative margin on .rsh__scrolly (tuck) keeps the next part ~20px under card 04; overflow-anchor: none while pinned. Proven with jitterprobe.cjs (real mouse wheel, ~900 frames): before 56-60 wrong-way page scrolls + ~30 strip reversals; after 0/0/0 at 1366x657, 1280x720, 1440x900.
- 1c DONE (Alefiya: keep the nope line; she + Yemi revise this section logic on Monday): stop card = "By increasing your Revenue Per Visitor(TM) from $2.25 to $6.42, you will add" + big "+$1.5M/year ($125K/mo)" (bigger, sized to the card: min(52px, 15cqi)) + "without adding a penny to your current marketing or ad spend." + nope line kept. 8a9ba2d + fit fix. Verified 1440/1280/900/375/320, fits, no overflow. Pushed.
- JITTER ROOT CAUSE (user: "still jitter, fix the root cause"): d8a045a + 43f508c — the strip was moved frame by frame from JS while the browser scrolls on its own thread, so slow frames left it a frame behind (little catch-up jumps). Now scroll only picks the card (dead band 0.66 / 0.46) and the slide is a 0.6s CSS transition run by the compositor. 6c6f170: re-checks the card when the page above changes height with no scroll (late images after a reload, a pillar opening) and jumps straight to it; watched on .results-page because html/body/#root are height:100% (global.css), so body never resizes.
  Verified (headless, scripts in %TEMP%/qcverify): edgecases.cjs 19/19 (1440x900, 1366x657, 1536x730@1.25: boundary wiggle 0 flips, fast scroll down/up 0 wrong-way, stage still, reverse mid-slide smooth, step buttons land + stay); edgecases2.cjs 4/4 (reload mid-section = right card, 0 sliding frames; reduced motion instant; resize pin->swipe->pin; no errors); filmprobe + filmanalyse2 1366x657 trackpad / 1920x1080 fling / 1536x730@1.25 wheel = 1263 frames, 0 wrong-way, 0 up-down, step row still; carousel2 phone swipes/Back/short window/tablet OK; gapfit 17-20px under card 04.
- WORKSHOP CTA MOCKUP (d542a54): Alefiya's tablet mockup ("Untitled design (51).png" -> Design Assets/Result Page Assets/Images/Workshop Tablet Mockup.png; web copy public/assets/results-workshop-tablet.webp, 860px, 94 KB) on the LEFT of both workshop CTA blocks (row 2 "Answer all 10 questions…" + workshop invite "Grab a pen and paper…"), text + button on the right, button lined up with the text (no longer centred). Mockup = link to https://nomadsmarketing.co/workshop, new tab, scale 1.1 on hover. Phones (<=760): stacked, mockup 250px centred, button full text width. Tablet: more top padding under the "See What's Working" stamp. Verified 1440/1280/1024/820/768/414/375/320, 0 overflow.
- STRETCH SECTION (b29bf19): "It is a stretch, which is why nobody gets there in one jump." now in the shared headline scale (38 desktop / 32 tablet / 26 phone, same as the other headlines); "Yes, 12× sounds like a stretch" = maroon #641d4f chip, white mono caps 12px (caps kept as the design shows them). Card column minmax(0,1fr) so it never outgrows the card at 320px. Verified 1440/1024/768/375/320.
- All pushed to origin result-page-slack-changes (b29bf19). NOT on alefiya remote, NOT on main, NOT on the Vercel review link (result-page-review is still d2e27cc).
- NAVY CARD (user, 31 Oct, ref = row 4 "Two paths" card): both workshop CTA blocks — mockup + text + button now on one #0f1c2a card (radius 20, 8px 8px 0 rgba(0,0,0,.35) shadow, padding clamp(24px,4vw,52px)); sections stay white. Text white; $6.42 chip = hero green #72e2a7 on green tint. Workshop half top padding 128 (desktop) / 104 (<=1100) / 88 (phones) so the card starts below the stamp. "hands-on" + "RPV ™" held on one line (holdTogether in WorkshopInvite.jsx; words unchanged). navycheck.cjs 18/18 at 9 sizes (1920 → 320). Independent review workflow wf_a78732e6-a84 running; commit + push after it (backup commit c8f1f70).
  - then (user): card max width 1100px (was 1080), grey card shadow removed. navycheck 18/18 again (1100 wide from 1200px up, shadow none).
  - review wf_a78732e6-a84 (3 lenses, each finding re-checked): 2 confirmed + fixed — row 2 button's plum keyboard focus ring vanished on navy -> white ring; workshop card came within 3px of the keyline frame at 1101-1180px -> 48px side padding above 1100 (11px gap). Rejected: tablet bezel on navy (still visible), dark button shadow on navy (page's standard dark-bg button look). reviewfix.cjs all pass. Committed e82f188, pushed to origin (supersedes backup c8f1f70).
- GOLFBAYS HEADLINE (2cf5ca8, pushed): user asked for one h2 with no inner spans + lines straight on both sides. Decided with user: keep the two coloured figures (£96,000+, 12 days) as the only spans; everything else plain text in the h2. Fully justified tried and measured (golfcheck.cjs / golfexplore.cjs): word gaps 10-20x a normal space at every width that isn't 3 lines (headline is 38/32/26px with 2-4 words per line), "Conversion" alone on a line at 1101/861/320 — user chose B: left-aligned, balanced lines. Comparison screenshots in golfbays-headline/ (A-justified-*, B-left-balanced-*). Verified 11 widths 1920→320: one h2 = text,span,text,span,text; words unchanged; normal gaps; no overflow.
  - then (user): right edge to match the paragraph. Measured: justifying at the shared size gives 16-20x word gaps; option 2 (paragraph narrowed to the headline) was built but the user stopped it and asked instead for just a 31px headline on desktop (>1100px; tablet 32 / phone 26 unchanged). Option-2 code reverted (never committed). Committed + pushed (see git log). Option screenshots in golfbays-headline/ (1-smaller-justified-*, 2-paragraph-narrowed-*).

## END OF DAY (31 Oct) — ONE BRANCH FOR ALL OF TODAY'S SLACK CHANGES
- Branch **slack-changes-31-oct** at dadde0f = all 30 Slack commits of 31 Oct (b070972 … dadde0f) on top of qc-all-preview d2e27cc (all earlier QC work). Pushed to BOTH remotes (origin AbdulSamad001122/nomads-quiz-v2 + alefiya alefiya-nomads/nomads-quiz). NOT merged — main still c53c617 on both. (result-page-slack-changes points at the same commit and is kept.)
- Still open: Alefiya + Yemi revise the stop-card logic on Monday.
- 1 Nov: main Quiz folder (localhost:3000) switched to slack-changes-31-oct at the user's request; local uncommitted edits carried over (no overlap with the branch's 25 changed files). Verified :3000 shows the navy cards + mockups, stretch chip, GolfBays h2, carousel; no console errors. Note: qc-all-preview's quiz start-screen change (0957c84) is not on this branch, so :3000 doesn't show it right now.
