/**
 * Result page copy — VERBATIM from "Quiz Questions and logic/Result Page Copy.docx",
 * as amended by "Updated Result Page Copy.docx" (Yemi, 2026-09-19: hero +
 * around-the-table rewrite). The docs are the copy source of truth; they
 * supersede Quiz Logics.docx except the blue conditional blocks which defer
 * to the Logic Doc. {{tokens}} are dynamic values resolved in resolveTokens.js.
 *
 * Flagged doc↔design mismatches (doc wins per user rule, Sep 11):
 * - Nav labels + formula keep the ™ (design image drops it).
 * - "$1.5M/Year" capital Y per doc (design image shows "/year").
 * - The bottom strip copy exists only in the design image (no doc conflict).
 */

export const NAV = {
  links: [
    { label: 'Your RPV™ Score', href: '#rpv-score' },
    { label: 'How we calculated your RPV™', href: '#how-we-calculated' },
  ],
  ctas: [
    // TODO: real workshop URL when provided. Booking URL is live (Yemi,
    // Sep 19 doc comments — TidyCal).
    { label: 'Watch the hands-on workshop with your team', id: 'watch_workshop', variant: 'blue', href: '#' },
    { label: 'Book your Next $125k/mo game-plan call', id: 'book_call', variant: 'pink', href: 'https://tidycal.com/alefiya/crpv-game-plan-call' },
  ],
};

export const METRICS = {
  // Sep 19 doc rewrite (Updated Result Page Copy.docx): single sentence with
  // live RPV tokens replaces the old three-line headline, and the
  // "Total traffic:" line is deleted. Lowercase "per" is verbatim from the
  // doc. Wraps naturally (no line map, per the Sep 12 no-<br> rule).
  headline:
    'So…how do you scale your Revenue per Visitor™ from {{current_rpv}} → {{goal_rpv}}? By optimising all 5 metrics below until they’re green:',
  // 🔴🟡🟢 key under the rps row — ALWAYS shown. Yemi's "show only if red"
  // comment (#6) anchors BELOW this key, on the workshop section that
  // follows it, so the key itself is not conditional.
  key: [
    '🔴 Red: The metric with the most room to improve.',
    '🟡 Yellow: The metric that’s close to healthy.',
    '🟢 Green: The metric that’s performing at its goal.',
  ],
  headers: {
    metric: 'METRIC',
    current: 'YOUR BUSINESS',
    currentSub: '(Currently)', // design casing; doc has "(CURRENTLY)" — flagged
    goal: 'YOUR NEW GOAL',
    // Design-added header note (not in the copy doc) — flagged, kept.
    goalSub: '(After optimising 4 pillars that scale average revenue per visitor)',
  },
  rowLabels: {
    rpv: 'Revenue Per Visitor™',
    optIn: 'How many visitors are becoming email or SMS subscribers?',
    lead: {
      plg: 'Out of every 100 new subscribers joining your list, how many take a buying action within the first 14 days?',
      slg: 'Out of every 100 new subscribers joining your list, how many book a call or demo within the first 14 days?',
    },
    close: {
      plg: 'And out of every 100 who take that action, how many complete it?',
      slg: 'And out of every 100 who book, how many become paying clients?',
    },
    rps: 'Revenue Per Subscriber™ (what each subscriber is worth per year)',
  },
};

/**
 * Conditional result blocks — VERBATIM from Quiz Logics.docx · Results-page
 * logic ("Copy Shown" for each block). Result Page Copy.docx marks these as
 * blue conditional boxes and defers to the Logic Doc for the wording.
 *
 * Doc order on the page:  metric table → Block 1 → (Block 2 or 3) → (Block 4,
 * 5, 6 or 7). Block 4 has no copy of its own — the doc says "standard results
 * page, no capped-state copy", so nothing renders for it.
 *
 * Blocks 5–7 are split into parts so the doc's guard ("suppress any sentence
 * containing it") can drop individual sentences without rewording the rest.
 */
export const RESULT_BLOCKS = {
  // trigger: otherRevenue ≥ 0 (suppressed when < 0; tag split_suppressed)
  //
  // Block 1's design (reference 2026-09-15) breaks the doc's middle sentence
  // "Everything else comes from: repeat purchases, referrals, direct traffic,
  // social, and word of mouth." into a bold intro + five tick cards — the
  // design drops the colon and keeps the sentence's own casing mid-list
  // ("direct traffic", "social") plus the full stop on the last card. Split
  // at sentence boundaries only; no wording changed.
  block1: {
    head: 'Around {{email_percentage}}% of your revenue comes through the five metrics that influence your RPV™.',
    foot: 'The {{email_percentage}}% is the part you can track, control, and systematically optimise. The bigger this number, the more predictable your revenue.',
  },

  // Yemi ruling (2026-09-15, Q5): when the true share is under 2.5% the
  // rounded figure collapses to 0, so Block 1 switches to this wording
  // instead of printing "Around 0%". Copy approved by Yemi (Tab 2 draft).
  block1Small: {
    head: 'Less than 5% of your revenue comes through the five metrics that influence your RPV™.',
    foot: 'That small slice is the part you can track, control, and systematically optimise. The bigger it gets, the more predictable your revenue.',
  },

  // Shared by both Block 1 wordings — the "everything else" list as cards.
  splitIntro: 'Everything else comes from',
  splitChannels: ['Repeat purchases', 'Referrals', 'direct traffic', 'social', 'and word of mouth.'],

  // trigger: emailPercentage < 5 (suppressed if Block 3 or 7 fires)
  block2:
    'Almost none of your revenue is coming through the five metrics used to calculate Revenue Per Visitor™. That usually means you\'re not making the most of the visitors you\'re already attracting. Too much of your revenue depends on channels and outcomes you can\'t reliably predict or control.',

  // trigger: RPS = 0 (suppresses Block 2)
  block3:
    'You\'re not using email to bring people back, so every visitor is mostly a one-shot opportunity. They either buy today or you may lose them. That means Revenue Per Subscriber™ is currently $0. You\'re leaving a major revenue lever unused: turning the people you already attracted into repeat revenue.',

  // Blocks 5–7 share the capped-card design (reference 2026-09-15): lead
  // paragraph with the money bolded, an optional plum headline, body copy,
  // the closing question pulled out bold, then the workshop CTA. The strings
  // are the doc's (Blocks 5–6) / Yemi's approved rewrite (Block 7) split at
  // sentence boundaries only — no wording changed.

  // trigger: capped, gain positive, traffic within reach (≤ 20× current)
  block5: {
    leadBefore: 'You\'ve maximised every metric in the Compounding Revenue Per Visitor™ OS. Following the system, you could add another ',
    leadBold: '{{achievable_gain}} a year',
    leadAfter: ' without increasing your traffic.',
    // The gap pair is dropped when the metrics alone already clear $1.5M
    // (unreachable since Yemi Q1, kept as a guard) — otherwise it reads
    // "you're still $0 short … 0 more visitors a day".
    gapHead: 'You\'re still {{remaining_gap}} short of $1.5M.',
    gapBody: 'So now, the answer really is more traffic: {{additional_daily_visitors}} more visitors a day.',
    tail: 'But before you scale, build the feedback loop. Every buyer and non-buyer gives you data to improve your messaging and positioning, making each new visitor more valuable.',
    question: 'Want to see how it works?',
    cta: 'Watch the workshop →',
  },

  // trigger: capped, gain positive, traffic out of reach (> 20× current)
  block6: {
    leadBefore: 'You\'ve maximised every metric in the Compounding Revenue Per Visitor™ OS. Following the system, you could add another ',
    leadBold: '{{achievable_gain}} a year',
    leadAfter: ' without increasing your traffic.',
    tail: 'But getting all the way to $1.5M would require far more traffic than your business can realistically handle. So this isn\'t a conversion problem. And more traffic isn\'t the answer either.',
    question: 'Want to understand what is?',
    cta: 'Watch the workshop →',
  },

  // trigger: capped, achievableGain ≤ 0 (suppresses Blocks 2, 5, 6)
  // Yemi ruling (2026-09-15, Q2): trigger kept, copy replaced. The doc's
  // original body reused Block 2's "almost none" wording, which means the
  // opposite of this trigger (no headroom left = the STRONGEST takers).
  // Copy approved by Yemi (Tab 2 draft).
  block7: {
    leadBefore: 'Your five metrics are already performing past the benchmark ceiling. There\'s not much left to squeeze out of conversion alone.',
    leadBold: '',
    leadAfter: '',
    tail: 'That means the next stage of growth doesn\'t come from fixing your funnel. It comes from compounding what\'s already working and scaling what feeds it.',
    question: 'Want to see what that looks like?',
    cta: 'Watch the workshop →',
  },
};

export const BEYOND = {
  // Doc: "Your Revenue per Visitor ™ beyond the first 14-day window" — the
  // design image drops the ™; doc wins (flagged). Line map from the design.
  bannerLines: ['Your Revenue per', 'Visitor™ beyond the', 'first 14-day window'],
  bannerAccent: '14-day window', // stone-coloured span in line 3
  intro:
    'You’ve just seen how much more revenue you could generate by increasing the Revenue Per Visitor™ from the traffic you already have, by improving the five metrics behind it.',
  // Desktop line map for the intro (reference image, 2 lines)
  introBreakAfter: 'increasing the Revenue',
  questionLines: ['But what happens to the subscribers', 'who don’t buy in those first 14 days?'],
  tape: 'They don’t disappear.',
  // Doc has the comma after "ecosystem" (design image shows a double space) — doc wins, flagged.
  closingLines: ['They’re still sitting in your ecosystem, and they can', 'continue generating revenue for months to come.'],
};

export const CRPS_INTRO = {
  // Doc: "This is where Compounding Revenue Per Subscriber™ comes in." —
  // design drops the ™; doc wins (flagged). Line map from the design.
  headlineLines: ['This is where Compounding', 'Revenue Per Subscriber™ comes in.'],
  cards: [
    {
      icon: '/assets/results-icon-funnel.png',
      // Design line map (3 lines)
      lines: ['Your RPV opportunity shows', 'you how to make more from the', 'visitors you’re already getting.'],
    },
    {
      icon: '/assets/results-icon-calendar.svg',
      // Design line map (4 lines)
      lines: [
        'Your RPS opportunity shows you',
        'how to make more from the subscribers',
        'you’re already acquiring over and over',
        'again throughout the year.',
      ],
    },
  ],
  // Doc has the trailing colon (design drops it) — doc wins, flagged.
  potentialLabel: 'So your potential isn’t just:',
  potentialBig: '+$1.5M/year',
  potentialSub: 'from your existing traffic',
  becomeChip: 'It can become:',
  // Doc: "+$1.5M+ from RPV optimisation" — design shows "+$1.5M/year" instead
  // of the trailing "+"; doc wins (flagged for review).
  becomeBig: '+$1.5M+',
  becomeSub: 'from RPV optimisation',
  // Doc's "PLUS" line renders as the plum "+" badge per the design (flagged).
  iceText: 'Additional revenue from compounding the value of every subscriber you acquire.', // design capitalises "Additional" (doc lowercase) — flagged
};

export const CRPS_CTA = {
  headlineLines: ['Want to see what’s sitting', 'inside your subscriber base?'],
  // Doc includes the ™ (design drops it) — doc wins, flagged.
  button: 'Calculate Your Compounding Revenue Per Subscriber™ →',
  subLines: [
    'Find out how much more revenue you could generate from',
    'the subscribers you already have beyond the first 14 days.',
  ],
};

export const AD_SPEND = {
  // Design-only transition band (not in doc) — flagged.
  bandLines: ['Now, Let’s Look At', 'Your Ad Spend ↓'],
  // Doc: "About your ad budget." — design renders as uppercase mono chip.
  chip: 'ABOUT YOUR AD BUDGET',
  // Doc ends with "?" (design drops it) — doc wins, flagged.
  headlineTop: 'What happens when every',
  headlineHighlight: 'visitor becomes more profitable?',
  subLines: [
    'From what you told us, here’s what your same ad spend',
    'could produce today vs. when you reach your RPV™ goal',
  ],
  // Unused while the slider is a share control (see shareLabel below). Casing
  // matches the copy doc's slider mockup (word/media/image4.png).
  sliderLabel: 'Your monthly spend',
  // Logic Doc · 7 makes the slider an AD-TRAFFIC SHARE control (10–100%,
  // "Not sure" takers only), so it needs its own label. The copy doc has no
  // wording for it — this is dev-added, FLAGGED for Alefiya.
  shareLabel: 'What % of your traffic comes from ads?',
  // DOC CONFLICT — FLAGGED: Result Page Copy.docx says "You can adjust your ad
  // spend…", but Quiz Logics.docx · 7 says the slider adjusts ad-traffic share.
  // Logic Doc wins on behaviour (user ruling), so this line now sits above a
  // share control and reads wrong. Kept verbatim pending Alefiya's decision.
  adjustNote: 'You can adjust your ad spend for it to accurately match your current ad spend',
  // Column heads + row labels come from the copy doc's own ad-module mockup
  // (Result Page Copy.docx · word/media/image9.png, anchored under "From what
  // you told us…"). Quiz Logics.docx 666–668 gives the same five rows.
  tableHeads: {
    today: 'Today',
    goal: 'At goal RPV',
  },
  tableLabels: {
    spend: 'Monthly ad spend',
    visitors: 'Visitors it buys you',
    rpv: 'Return per visitor',
    revenue: 'Revenue from that spend',
    roas: 'Return on ad spend',
  },
  // Design-only caption (not in doc) — flagged.
  caption: 'Same budget. Same visitors. The only thing that changed is what each one is worth on the way through.',
  // Design-only panel copy (not in doc) — flagged.
  panelIntroLines: ['Sitting inside spend you’ve', 'already committed to:'],
  panelGainSub: 'more a month',
  panelYearChip: (year) => `Call it ${year} a year`,
};

/**
 * "For the data nerds" — its own always-visible section under the ad module
 * (design reference received 2026-09-15). The copy doc gives it its own
 * Heading3 OUTSIDE the ad module's conditional blue box, so it renders for
 * everyone — including non-advertisers who never see the ad module.
 *
 * Doc↔design flags:
 * - Doc has "For the data nerds 🧮" — emoji dropped (design + Sep 11 rule).
 * - Doc p2 has "by channel — and find"; the design mockup drops the dash.
 *   Doc wins per standing rule; flagged.
 * - Doc writes the channels as one sentence "Paid. Organic. Referral. Email.
 *   Social." — the design renders them as a swoosh-bulleted row; casing kept.
 * - Doc/old build had the arrow leading ("→ Calculate…"); the design puts it
 *   trailing. Design wins on presentation; flagged.
 */
export const DATA_NERDS = {
  title: 'For the data nerds',
  p1: 'This diagnostic can’t peek inside your Google Analytics, CRM, ad dashboards, or other data sources.',
  p2: 'So if you want to go deeper and nerd out, grab your numbers to see your Revenue Per Visitor™ by channel and find which channels are most profitable.',
  channels: ['Paid', 'Organic', 'Referral', 'Email', 'Social'],
  chip: 'Whatever you’ve got.',
  button: 'Calculate My RPV By Channel →',
};

export const PROMISE_BANNER = {
  // "hollow" renders in the brush script per the design
  line1Before: 'So this isn’t a',
  line1Script: 'hollow',
  // Highlight span per the design: "million dollars overnight"
  line2Before: '“We’ll add a',
  line2Highlight: 'million dollars overnight',
  line3: 'to your bottom line” promise',
  sub: 'There is a solid data-led approach to it.',
  // Doc writes "not **just** a" (emphasis marks) — design shows uniform bold
  // chip text; rendered plain per exact-match, flagged.
  chip: 'Revenue Per Visitor™ is not just a traffic metric.',
};

export const BEHIND_NUMBER = {
  chip: 'BEHIND THE NUMBER', // design chip (doc phrase rendered as mono label)
  // Doc: "Here's what it took us to calculate your RPV ™ number:" — the ™ and
  // trailing colon are kept per doc (design drops both) — flagged.
  // The "W" of "What" renders as a script glyph per the design.
  headlineLines: ['Here’s what it took', 'us to calculate your', 'RPV™ number:'],
  sub: 'Behind every RPV™ number sits a much bigger revenue story. To calculate your RPV, we analysed:',
  subBreakAfter: 'bigger',
  // Doc: "We looked at:" — colon kept per doc (design chip drops it) — flagged.
  lookedAt: 'We looked at:',
  // Doc marks items 3–5 as dynamic (pink) but gives no variants — rendered
  // as written; flagged.
  items: [
    'How much traffic do you bring in',
    'How many visitors become subscribers',
    'How many subscribers take a buying action (lead conversion)',
    'How many of those complete the purchase (close rate)',
    'How much each subscriber is worth over a year (Revenue Per Subscriber™)',
  ],
};

export const GAMEPLAN_CTA = {
  // Two-tone headline per the design: the tail phrase renders in lighter plum.
  headlinePlain: 'But if you already know you want a second set of',
  headlineAccent: 'expert eyes on your business?',
  // Design line map: "But if you already know you / want a second set of expert / eyes on your business?"
  bodyLines: [
    'Bring your numbers straight to Your',
    'Next $125k Game Plan Call, and I’ll',
    'analyse the between-the-numbers',
    'story your scorecard is telling.',
  ],
  // Doc: "→ Book Next $125k Game Plan Call" — arrow kept per doc (design
  // drops it) — flagged.
  button: '→ Book Next $125k Game Plan Call',
};

export const THE_CATCH = {
  // Doc: "More on both below." — design renders title case; design casing
  // kept per the reference-casing rule, flagged.
  band: 'More On Both Below.',
  chip: 'HERE’S THE CATCH',
  // Design line map (3 lines)
  // Line structure per the user (Sep 13); line 2 is kept together on
  // desktop so the break lands after "genuinely".
  headlineLines: [
    'From the inside, it’s genuinely',
    'hard to tell which of the four pillars',
    'is the one holding you back.',
  ],
  subLines: ['They can all look like they’re working, or you', 'feel like all of them need work.'],
  // Doc ends with a period ("You score.") — kept per doc (design drops it), flagged.
  scoreBox: 'So you don’t guess. You score.',
  paraLines: [
    'In the workshop, you and your team rate your business',
    'across the four pillars, one at a time. For each, you',
    'answer a short set of questions (the same ones a paid',
    'audit would start with) and score yourself out of five.',
  ],
  para2Lines: [
    'By the end, you’re holding four numbers. Optimising the',
    'lowest one will have the largest impact on your revenue.',
  ],
  boldLines: ['That’s your first move. Not a list of twelve', 'competing priorities.'],
  // Doc continues "And here's why I recommend doing it with your team:" —
  // that tail opens the next (team) section per the design split.
};

export const TEAM_APPROACH = {
  lead: 'The four scores live in four different heads.',
  // Doc runs these as one block; design splits them into three bars.
  bars: [
    { text: 'Your content lead knows the traffic.', variant: 'cream' },
    { text: 'Sales knows what happens on the calls.', variant: 'navy' },
    { text: 'Nobody in the building is holding all four at once.', variant: 'plum' },
  ],
  para1: 'Which is exactly why a slow month feels like a mystery.',
  para2Lines: ['The workshop is the first time your team', 'looks at one shared goal.'],
  para3Lines: [
    'Instead of marketing saying “traffic is up” while sales says',
    '“the leads are a poor fit,”  everyone is finally on the same',
    'page (literally, and figuratively!)',
  ],
};

export const GAMEPLAN_INTRO = {
  // Doc: "Your Next $125k/mo Game Plan" — design renders "/Mo"; design casing
  // kept per the reference-casing rule, flagged.
  headline: 'Your Next $125k/Mo Game Plan',
  subLines: ['The scorecard shows you your scores.', 'The highest. The lowest.'],
  // Card labels are design-added (not in the doc) — flagged. Card bodies are
  // the doc paragraph split across the two cards, verbatim.
  cards: [
    {
      label: 'Too Close to See It',
      variant: 'pink',
      lines: [
        'But when you’re workshopping this',
        'with your team: your team is too close',
        'to the product, to sales, to the',
        'customers.',
      ],
    },
    {
      label: 'Closeness Creates Blind Spots',
      variant: 'ice',
      lines: [
        'That closeness is a strength on most',
        'days. But when you’re that near to it,',
        'it\'s also the reason the obvious thing',
        'hides in plain sight.',
      ],
    },
  ],
  closingLines: [
    'I help you and your team read the story your numbers',
    'are telling, the one that\'s hard to hear from the inside.',
  ],
};

export const CLIENT_DAVID = {
  // Doc: "Take my client David." — design capitalises "Client" (kept, casing
  // rule) and drops the period (restored per doc) — flagged.
  headline: 'Take my Client David.',
  bullets: [
    {
      bold: 'He had a genuinely strong course:',
      // Doc continues lowercase "how" after the colon — design capitalises
      // the paragraph start (kept, casing rule).
      lines: [
        'How agencies win and survive enterprise deals.',
        'His funnel opened with an "Enterprise Readiness',
        'Checklist," good lead magnet, sharp emails, a top',
        'copywriter behind them. Still, nothing sold.',
      ],
    },
    {
      bold: 'So he did what most founders do.',
      lines: [
        'He assumed the top of the funnel was too quiet,',
        'and paid a cold email agency to push a thousand',
        'more people in. Almost nothing came back. By',
        'the time he reached me, David had decided the',
        'offer was a dud.',
      ],
    },
    {
      bold: 'It wasn\'t. "Enterprise readiness" is a someday problem no founder lies awake over.',
      lines: [
        'And it spoke to the founder, when the person',
        'actually feeling the pain was the AE, the one with',
        'a deal stalling right now.',
      ],
    },
  ],
  boxParas: [
    ['We changed who it spoke to and what it', 'opened with. Same course. That\'s when it moved.'],
    [
      'What David read as an offer problem was really a',
      'who and where problem. He could have rebuilt',
      'that offer ten times and never fixed a thing.',
    ],
    ['That\'s the read you can\'t easily do on yourself.'],
  ],
  boxBold: 'It\'s exactly what the call is for.',
};

export const WALK_AWAY = {
  headlinePlain: 'So here’s what you',
  headlineScript: 'walk away with.',
  subLines: ['Which of your numbers is genuinely', 'costing you, and which just looks scary.'],
  // These two cards are the doc's "[VISUAL — the two 'looked fine from the
  // inside' reads]" — the design supplies the card copy. NOTE the design
  // copy extends/rewords the doc's body sentences (doc: "comparable list
  // running at 45%" / "0.044% demo rate" / "We took it to 14%") — flagged
  // for Alefiya's confirmation; rendered per the design as the visual's copy.
  cards: [
    {
      variant: 'white',
      icon: '/assets/results-icon-envelope-plum.svg',
      stat: '45%',
      chip: 'Email click rate',
      bold: ['6%', '45%', 'most profitable channel'],
      paras: [
        [
          'One client was proud of a 6%',
          'email click rate, until they saw',
          'a comparable list with 45%',
          'click rate and saw email wasn\'t',
          'the most profitable channel',
          'they thought it was.',
        ],
      ],
    },
    {
      variant: 'lavender',
      icon: '/assets/results-icon-laptop-plum.png',
      stat: '14%',
      chip: 'Demo conversion rate',
      bold: ['440,000 shopify sessions', '0.04%', '14%'],
      paras: [
        ['Another clocked 440,000 shopify', 'sessions with 6X ad ROAS. So ads', 'were healthy, but were they?'],
        ['I found behind the 6X ROAS', 'was a measly 0.04% traffic to', 'demo conversion rate.'],
        ['We then took it to 14%.'],
      ],
    },
  ],
  band: 'You\'ve mostly had yourself to compare to. I don’t.',
};

export const WEAKEST_PILLAR = {
  // Doc: "My judgment…" — design shows "judgement"; doc spelling wins, flagged.
  // Doc writes "Compounding RPV ™ system" with the space before ™ (kept).
  leftParaLines: [
    'My judgment comes from building Compounding',
    'RPV ™ system across ecom, coaching, SaaS, B2B firms,',
    'clinics, law firms, and the list goes on.',
  ],
  leftBoldLines: ['Your diagnostic already shows your', 'current RPV and your potential RPV.'],
  // Doc ends with ":" (design drops it) — doc wins, flagged.
  rightHeader: 'On the call, we take the weakest pillar and get specific:',
  bubbles: [
    { variant: 'tan', lines: ['Why is it that we only got 29', 'sales from this ad campaign?'] },
    { variant: 'darkplum', lines: ['Why is the ROAS 15X but the', 'website has 69% bounce rate?'] },
    { variant: 'midplum', lines: ['Why is your browse', 'abandonment so high?'] },
    { variant: 'navy', lines: ['Why are you only closing', '1 in 8 sales calls?'] },
    { variant: 'ice', lines: ['Why are you not generating', 'clients from your content?'] },
  ],
  para1Lines: ['We go deep into your numbers so you don\'t', 'leave with "improve your positioning."'],
  para2Before:
    'You leave with a clear next step like "All sales calls start at this message, so we’ll use this message top of funnel to lift opt-ins ',
  para2Bold: 'from 11% to 25% and that shall add $40,000/mo',
  para2After: ' to our revenue", an action with a number attached to it.',
  // First sentence of the doc's next paragraph — the Lara story that follows
  // it belongs to the next section.
  band: 'I don\'t guess at these.',
};

export const LARA_STORY = {
  para1:
    'When I was working with Lara Acosta on her launches, early on we audited why she wasn\'t pulling enough people into her lead magnets and her launch events.',
  // Doc: "My verdict:" — colon kept per doc (design chip drops it) — flagged.
  chip: 'My verdict:',
  para2: 'She kept partnering with the same handful of collaborators, launch after launch.',
  // Doc runs these as one sentence; the design splits them into three bullets
  // (bullet 3 capitalises "So" as its own line start).
  bullets: [
    'Same audiences, over and over.',
    'They\'d seen it all before,',
    'So registrations had quietly flattened due to audience fatigue.',
  ],
  para3:
    'So we partnered with fresh collaborators and reached audiences that hadn\'t been tapped yet. And the next launch pulled so many registrations that Zoom crashed and Lara had to apologise to her email list.',
  // Phrases set a touch bolder inside the copy (see emphasize.jsx) — the
  // strings above stay verbatim.
  bold: [
    'wasn\'t pulling enough people',
    'same handful of collaborators',
    'Same audiences',
    'audience fatigue',
    'fresh collaborators',
    'Zoom crashed',
  ],
  band: 'That\'s what you get on the call.',
};

export const YOUR_CALL = {
  // Updated wording (user, 2026-09-14): opens with "Then it's your call."
  para1: 'Then it\'s your call. Run it in-house, or hand it to our dream team that\'s done it across 15+ industries.',
  band: 'No pressure to pick the second one.',
  // Doc: "…you leave seeing your funnel more clearly…" — the design shows a
  // "customer journey" rewrite (with a missing-space typo); doc wins, flagged.
  para2: 'Either way, you leave seeing your funnel more clearly than you walked in.',
  // Doc: "→ Book your Next $125k/mo Game Plan" — design shows "Book Next
  // $125k Game Plan Call"; doc wins, flagged for review.
  button: '→ Book your Next $125k/mo Game Plan',
  sub: 'It\'s free, takes about 30 minutes, and you\'re welcome to bring your team.',
};

export const PILLARS = {
  // Doc: "So let's open the pillars, one at a time." — comma kept per doc
  // (design drops it) — flagged.
  headline: 'So let\'s open the pillars, one at a time.',
  sub: 'Starting with the first one your scorecard just asked about.',
  items: [
    { num: '01', title: 'Pillar one', name: 'Maximise Revenue Per Visitor™', variant: 'pink' },
    { num: '02', title: 'Pillar two', name: 'Contrarian POV™', variant: 'plum' },
    { num: '03', title: 'Pillar three', name: 'Speed to Decision™', variant: 'ice' },
    { num: '04', title: 'Pillar four', name: 'Compounding Revenue per Subscriber™', variant: 'navy' },
  ],
};

export const PILLAR_ONE = {
  // Design mock's chip reads "Pillar 03" — clearly a designer slip (this is
  // Pillar one's copy, doc row 6); rendered "Pillar 01" — flagged.
  chip: 'Pillar 01',
  sub: '90% of the people who find you online aren’t ready to buy yet',
  // Doc: "…only speaks to the *TINY 10 %* who are ready to buy." — the
  // asterisk emphasis renders as the cream highlight; doc's "10 %" spacing
  // normalised to "10%" per the design — flagged.
  headBefore: 'Which is why your (and your competitors’) marketing completely ignores this huge group and only speaks to the',
  headHighlight: 'TINY 10%',
  headAfter: 'who are ready to buy.',
};

export const PILLAR_ONE_ULCERS = {
  lead: 'Say you\'re selling medicine for ulcers.',
  // Doc runs "Out of 100 people, 3 know they have ulcers and buy immediately."
  // — split across the two stat cards per the design.
  card1Num: '100',
  card1Text: 'Out of 100 people',
  card2Num: '03',
  card2Text: '3 know they have ulcers and buy immediately.',
  para1: '70 have stomach pain, but they don\'t know ulcers cause it.',
  para2: 'So when your messaging targets the problem ("medicine for ulcers"), you lose the 70 people who genuinely believe they don\'t have ulcers.',
  band: 'Even though they do.',
  closing: 'Even if your content, ads, podcasts, and books are reaching everyone, 90% of them automatically self-select themselves out by believing they don’t NEED what you have to offer (even if they do).',
};

export const PILLAR_ONE_CURIOUS = {
  // Doc: "(…for low conversions — sound familiar?)." — the design drops the
  // em-dash; doc wins, flagged.
  para: 'And when your marketing only speaks to this tiny percentage, you have to reach a lot more eyeballs to hit your sales goals (so you’re bleeding time or money for low conversions sound familiar?).',
  headBefore: 'But what if you could pull the other 60% of the market pie in and make them',
  headHighlight: 'curious enough to consider your offer?',
};

export const PILLAR_ONE_SAMAR = {
  // Design repeats the doc's opening clause as the card heading, then runs
  // the doc paragraph in full below — doc words verbatim throughout.
  headline: 'Samar Owais generated 350+ quiz signups in 72 hours and grew her list by 7706%',
  para1: 'Samar Owais generated 350+ quiz signups in 72 hours and grew her list by 7706% without spending a dollar on ads by creating curiosity around strategic blind spots her audience didn\'t know they had. The result?',
  para2Plain: '350+ marketers and founders took the quiz within 72 hours.',
  para2Bold: 'Her email list grew by 7706%.',
  para3: 'And the funnel attracted exactly the type of buyers who were most likely to become future customers.',
  // Attribution row is design-added (not in the doc) — flagged.
  name: 'Samar Owais',
  role: 'Email Marketing Strategist',
  caption: 'If they’re curious, they enter the open to it category. You expand your market from 10% to 70%.',
};

export const PILLAR_ONE_PYRAMID = {
  // Whole pyramid infographic is a supplied image; only the caption is text.
  // Doc: "↑ Based on the Pyramid of Awareness by the Godfather of Advertising
  // himself, Eugene Schwartz." — verbatim.
  caption: 'Based on the Pyramid of Awareness by the Godfather of Advertising himself, Eugene Schwartz.',
};

export const PILLAR_ONE_FLOW = {
  // Doc: "Curiosity → Consideration → Conviction →Conversion" — rendered as
  // the design's four cards.
  steps: [
    { label: 'Curiosity', icon: '/assets/results-4c-curiosity.png', variant: 'plum' },
    { label: 'Consideration', icon: '/assets/results-4c-consideration.png', variant: 'navy' },
    { label: 'Conviction', icon: '/assets/results-4c-conviction.png', variant: 'plum' },
    { label: 'Conversion', icon: '/assets/results-4c-conversion.png', variant: 'navy' },
  ],
  line1: 'Evoking curiosity about their symptoms is how you make more money out of every visitor.',
  line2: 'And leading with diagnosing their symptoms is how you evoke maximum curiosity.',
  // Doc: "This is the first Pillar of the Compounding RPV™ OS." — design chip
  // drops the ™; doc wins, flagged.
  chip: 'This is the first Pillar of the Compounding RPV™ OS.',
  // ⚠ Doc says "built for the 10% ready-to-buy customers"; the design image
  // says "3%" (matching the pie chart). Doc wins per the copy rule —
  // FLAGGED for Alefiya's ruling, since it's a number not punctuation.
  para1: 'After the diagnostic workshop, if your Maximise Revenue Per Visitor™ score came back low, this is usually the reason. The page is built for the 10% ready-to-buy customers, not the 97% in consideration mode.',
  // Doc ends with a period (design drops it) — doc wins, flagged.
  para2: 'So that’s the first metric: turning more of your visitors, especially the 97% who aren’t ready yet, into email or SMS subscribers.',
};

export const PILLAR_ONE_ISOLATION = {
  lead: 'But just growing your email list doesn’t add $1.5m/year to your bottom line.',
  headBefore: 'Revenue becomes inconsistent when a business sets agendas and',
  headHighlight: 'goals in isolation.',
  // Doc runs the three goals as consecutive quoted sentences — rendered as
  // the design's three cards.
  quotes: [
    '“We want to add 10,000 subscribers in 6 months.”',
    '“We want to increase ads ROAS by 5%.”',
    '“We want to go from closing one in eight calls to four in eight calls.”',
  ],
  band: 'Because of that…',
  // Doc: "…or a positioning problem — because their teams work in isolation."
  // The design drops the em-dash and highlights the tail; doc dash kept
  // (outside the highlight), flagged.
  head2Before: 'Most businesses can’t tell if a slow month is a traffic problem, an email problem, a sales problem or a positioning problem',
  head2Highlight: 'because their teams work in isolation.',
  sub: 'Very few know how much revenue each visitor is bringing. And without that, scaling becomes expensive guessing.',
  // Bold lead-in to the situations below (doc row 7, added 2026-09-14).
  subLead: 'Here’s how that manifests:',
};

export const PILLAR_ONE_SITUATIONS = {
  // "Situation 01/02" chips are design-added labels (the doc has none) —
  // flagged. Body copy is doc row 7 verbatim.
  one: {
    chip: 'Situation 01',
    p1: 'You set a goal to increase your close rate, so you hire a sales trainer.',
    headBefore: 'They train on better discovery, negotiation, and',
    headHighlight: 'objection handling skills.',
    p2: 'But after spending months applying the new technique, the close rate still doesn’t significantly improve.',
    bold: 'Why? Because it was a positioning problem.',
  },
  two: {
    chip: 'Situation 02',
    p1: 'You set a goal to get 10,000 new visitors on your website each month.',
    p2: 'So you scale your ad spend and double down on SEO.',
    p3: 'You do get 10,000 new visitors, but that doesn’t move your revenue.',
    bold: 'Why? Because your older messaging was for a warm audience, and that messaging didn’t support the cold audience.',
  },
};

export const PILLAR_ONE_SITUATION3 = {
  chip: 'Situation 03', // design-added label (doc has none) — flagged
  lead: 'You set a goal to book 20 sales calls a week.',
  paras: [
    'You hire more SDRs, and your content team really doubles down.',
    'And you’re pretty close to the target.',
    'But the content directly pushed people to a call.',
    'Now the sales team is frustrated because they spend 45 minutes educating a doubtful buyer, and the close rate has dramatically decreased.',
  ],
  bold: 'Why? Because the ones coming on the call weren’t pre-educated.',
  // Doc: "So you keep setting new targets, new goals, and your team even
  // achieves that. But yet…scaling still feels unpredictable." — doc's final
  // period dropped by the design; doc wins, flagged.
  closing: 'So you keep setting new targets, new goals, and your team even achieves that. But yet…scaling still feels unpredictable.',
};

export const PILLAR_ONE_LARA_QUOTE = {
  quoteBefore: 'Alefiya to me became almost like a',
  quoteHighlight: 'second brain',
  quoteAfter: 'when it came to the execution of how to launch things',
  para: 'Alefiya gave me the structure that I didn\'t know that I needed because I didn\'t know how to structure sales emails the way she would.”',
  // Doc also lists "Lara Acosta", "Co-Founder, Kleo" and "Forbes 30 Under 30";
  // the design shows only this chip (the name + Forbes badge are baked into
  // the Lara image) — "Co-Founder, Kleo" is dropped entirely, flagged.
  chip: 'Founder, Literally Academy & LA Digital',
  // Doc wraps this line with ☝️ on BOTH sides; the design shows only the
  // leading one — doc kept, flagged for review.
  statLead: '☝️',
  stat: '491 students joined against a goal of 200 and the launch generated approximately $186K',
  statTrail: '☝️',
};

export const PILLAR_ONE_PREDICTABLE = {
  // Doc: "…metrics that move revenue — together, not in isolation." The
  // design drops the em-dash and the comma; doc punctuation kept, flagged.
  headline: 'Get predictable, consistent revenue by letting your entire team track, obsess, and optimise metrics that move revenue together, not in isolation.',
  sub: 'And of the four they track together, here’s the one that I want you to pay the MOST attention to.',
};

export const PILLAR_TWO_INTRO = {
  chip: 'Pillar 02', // design-added label (doc heads this "Pillar two — Contrarian POV™")
  // Doc: "…become the ONLY option…" (caps for emphasis); the design renders
  // "The only option" — doc wins, flagged.
  headline: 'Why do some businesses become the ONLY option while charging the most in their category, and others get quietly dragged into price wars?',
  para: 'After sitting inside dozens of funnels, one pattern kept showing up. Generic positioning slowly starts sounding like everybody else. The same promises, the same "we help you scale faster" every competitor is also, word for word, promising.',
  boxLead: 'And over time, buyers stop seeing the difference.',
  boxParas: [
    'If you sell through calls, that\'s when you hear "can you send over your pricing?" and "how are you different from Competitor X?"',
    'If buyers self-serve, you don\'t hear it at all, which is worse.',
    'They open your page next to two competitor tabs, can\'t tell you apart in a few seconds, and quietly pick the cheaper or more familiar name.',
  ],
  // Doc runs these as one lowercase sentence ("No call, no objection, just a
  // closed tab."); the design splits them into three capitalised swoosh
  // bullets — design presentation kept, flagged.
  bullets: ['No call', 'No objection', 'Just a closed tab'],
  closing: 'Either way, the same thing is happening. When a buyer can’t see what sets you apart, price becomes the easiest thing left to compare.',
  chipClose: 'So they compare it.',
  // Design-only diagram labels (not in the doc) — flagged. The cards, brace
  // and "Take a stand → chosen on sight" label are baked into the image.
  diagramHeading: 'Look the same → compared on price',
  diagramCaption: 'A market of one. No cheaper option to compare you to.',
};

export const PILLAR_TWO_BLENDING = {
  headline: 'That’s the quiet cost of blending in.',
  para: 'Think about Apple. It didn\'t win on processor speed. While everyone else talked specs, Apple talked creativity and identity, and that shifted how buyers saw the whole category. (Netflix did it. Liquid Death did it. None of them the cheapest.)',
  // Doc runs this as one sentence ("So the question worth sitting with: how do
  // you become the ONLY option…"); the design splits it into a mono chip +
  // plum question — design presentation kept, flagged.
  chip: 'SO THE QUESTION WORTH SITTING WITH:',
  // Doc: "the ONLY option" (caps); design shows "The only option" — doc wins,
  // flagged (same call as the Pillar 02 opener).
  question: 'How do you become the ONLY option before a buyer starts comparing, on a call or in a browser tab?',
  // Doc parenthesises "(inside the workshop)"; the design drops the brackets
  // — doc wins, flagged.
  leaps: 'That’s the work we do with the LEAPS™ Framework (inside the workshop).',
  closing: 'Because when someone finally gets why you\'re different, the question changes. They stop asking "what\'s your price?" and start asking "how do we start?"',
};

export const PILLAR_TWO_PROOF = {
  // Card headlines, names-with-surnames and role lines are all design-added
  // (the doc has only the body sentences) — flagged.
  cards: [
    {
      variant: 'plum',
      // Design reads "for a $5K n just 19 days" — an obvious typo for
      // "in just 19 days"; corrected here, flagged.
      headline: 'Estelle went from 3 calls per month to 3 calls per week for a $5K in just 19 days',
      body: 'In just 19 days, Estelle Winsette went from 3 calls per month to 3 calls per week while closing 2 out of every 3 calls for a $5K offer with her new “It’s not your body, it’s your clothes” positioning.',
      avatar: '/assets/results-t-estelle.webp',
      name: 'Estelle Winsette',
      role: 'Stylist for lawyers',
    },
    {
      variant: 'tan',
      headline: 'Louis went from closing 1 in 29 calls to closing 29 out of 31 calls',
      body: 'Louis went from closing 1 in 29 calls to closing 29 out of 31 calls with his “Creative Delivery” Positioning.',
      avatar: '/assets/results-t-louis.webp',
      name: 'Louis Butterfield',
      role: 'Awesome business videos',
    },
    {
      variant: 'ice',
      headline: 'Nausheen I Chen went from never selling to her list to selling out her first bootcamp.',
      body: 'Nausheen I Chen went from never selling to her list to selling out her first bootcamp.',
      avatar: '/assets/results-t-nausheen.webp',
      name: 'Nausheen I Chen',
      role: 'Public Speaking',
    },
    {
      variant: 'navy',
      headline: 'Chris made 23X more sales from 829 quiz takers',
      // "10,0000" is verbatim from the doc (and the design) — a five-digit
      // figure that looks like a typo for 10,000; left as written, flagged.
      body: 'Chris made 23X more sales from 829 quiz takers than from a list of 10,0000 subscribers.',
      avatar: '/assets/results-t-chris.webp',
      name: 'Chris Ritson',
      role: 'Helping sales teams',
    },
  ],
  // Doc: "^ We'll go deeper into our positioning process on the workshop."
  // (the caret is a doc production marker) — dropped, flagged.
  caption: 'We’ll go deeper into our positioning process on the workshop.',
};

export const PILLAR_TWO_LOOPS = {
  headline: 'A strong positioning strategy is rarely built once and left untouched.',
  intro: 'The best-performing conversion funnels are constantly learning from the people moving through them.',
  // Doc runs these as one sentence; the design splits them into five swoosh
  // bullets (the last one carrying the "All of it becomes feedback." tail).
  // Doc's period after "conversations" is kept — the design drops it, flagged.
  bullets: [
    'Every sales call',
    'Every objection',
    'Every hesitation',
    'Every drop in conversion',
    'Every pattern showing up across buyer conversations. All of it becomes feedback.',
  ],
  captureBefore: 'We capture it through',
  captureBold: '14 feedback loops',
  captureAfter: 'running across the funnel, from the first ad click or opt-in to a post-delivery support ticket.',
  // Doc: "Some are behavioral:  where people drop off…" / "Others are
  // qualitative:  the thank-you page survey…" — the design lifts each label
  // into a navy chip and drops the colon; design presentation kept, flagged.
  behavioralChip: 'Some are behavioral',
  behavioral: 'where people drop off in the quiz, how far into the workshop they watch, which sales page version wins.',
  qualitativeChip: 'Others are qualitative',
  qualitative: 'The thank-you page survey, the why-you-didn\'t-book survey, buyer interviews after purchase.',
  closing1: 'Which means the messaging keeps evolving and the positioning keeps sharpening.',
  closing2: 'The funnel keeps adapting to what buyers are actually thinking right now rather than refurbishing the messaging from what worked 6 months ago.',
};

export const PILLAR_TWO_WORKSHOP = {
  // Doc: "…use Contrarian POVs™ to escape price wars and become the ONLY
  // option in crowded markets." The design shows singular "POV™" and lower
  // case "only" — doc wins on both, flagged.
  headBefore: 'Watch the workshop to discover how category leaders use Contrarian POVs™ to escape price wars and become',
  headHighlight: 'the ONLY option in crowded markets.',
  // Doc ends "…it's the one holding the score down." — the design inserts
  // "RPV™" before "score"; doc wins, flagged.
  sub: 'If your Contrarian POV™ score came back low, it’s worth sitting with. It’s the pillar most teams quietly believe is fine. And 99% of the time, it’s the one holding the score down.',
};

export const PILLAR_FOUR_INTRO = {
  chip: 'Pillar 04', // design-added label (doc heads this "Pillar four — Compounding Revenue per Subscriber™")
  lead: 'Most teams treat a subscriber as a one-off.',
  para1: 'They join, maybe they buy, and if they don\'t, they sit in a newsletter list going quietly cold.',
  para2: 'But a subscriber has no ceiling on what they’re worth to you.',
  // Doc: "It costs you maybe $5…" — the design drops the "s"; doc wins, flagged.
  boxLeadBold: 'It costs you maybe $5 to get them onto your list',
  boxLeadTail: '.',
  boxPara: 'What they return after that has no fixed limit, and it comes down entirely to your email and SMS strategy:',
  // Doc runs these as one lowercase clause; the design splits them into three
  // capitalised swoosh bullets — design presentation kept, flagged.
  // ⚠ Doc says "their first 14 days"; the design says "10 days" — doc wins,
  // FLAGGED (a number, not punctuation).
  bullets: ['Why they joined', 'What happens in their first 14 days', 'And what happens every month after'],
  closing: 'That’s where compounding comes in.',
  closingBold: 'Here’s what a year of it can look like.',
  imageAlt: 'Compounding Revenue per Subscriber — a growing plant',
};

export const PILLAR_FOUR_TABLE = {
  // Doc: "Notice what the table doesn't do: your list never doubles. And yet
  // the revenue does." — the design lifts the clause before the colon into a
  // navy chip and drops the final period; doc's period kept, flagged.
  noticeChip: 'Notice what the table doesn’t do',
  noticeText: 'your list never doubles. And yet the revenue does.',
  // Doc: "In the workshop, I walk you through the whole table, step by step."
  // Rendered as one sentence again — "In the workshop" keeps the plum
  // highlight inline (with its comma restored), so this now matches the doc
  // exactly. The key name is kept so nothing else has to change.
  workshopChip: 'In the workshop',
  headline: 'I walk you through the whole table, step by step.',
  // Doc runs these as one sentence; the design splits them into three swoosh
  // bullets (capitalised) — design presentation kept, flagged.
  bullets: [
    'You’ll see the one small number you nudge up each month,',
    'How to reinvest so your list and your revenue per subscriber grow at the same time, and',
    'The month-by-month math that lets you forecast this strategically (brace yourself! lots of math tbd here).',
  ],
  closing: 'Which is why how someone joins your list matters so much.',
  imageAlt: 'The ad-spend calculator — monthly spend slider, today vs goal comparison table, and the monthly gain panel',
};

export const PILLAR_FOUR_CHRIS = {
  // Headline is a design-added pull-out of the body's tail — flagged.
  headline: '23 from 829 who’d joined through a diagnostic.',
  para1: 'My client Chris sent the same emails to two lists:',
  para2: '1 sale from 10,000 old subscribers, and 23 from 829 who’d joined through a diagnostic.',
  // NOTE: the doc's next sentence — "The smaller list was worth far more,
  // purely because of the intent they arrived with." — isn't in this design;
  // flagged as not yet placed.
};

export const PILLAR_FOUR_CLOSING = {
  // The doc sentence flagged as unplaced on the Chris card lands here.
  sub: 'The smaller list was worth far more, purely because of the intent they arrived with.',
  // Doc: "Compounding Revenue per Subscriber™ score" — the design drops the
  // ™; doc wins, flagged.
  headBefore: 'If your Compounding Revenue per Subscriber™ score came back low, it’s almost never a list-size problem. It’s a how-they-joined and',
  headHighlight: 'what-happens-next problem.',
};

export const HERO = {
  introBefore: 'You’re here for the spoils of adding',
  introChip: '$1.5M/Year',
  introAfter: 'without increasing your marketing spend.',
  basedOn: 'Based on your answers…',
  // Sep 19 doc rewrite: the giant annual-revenue number is replaced by the
  // RPV-increase framing. The sentence is verbatim from Updated Result Page
  // Copy.docx; its two inline tokens render as the big number row (current →
  // goal), keeping the doc's reading order.
  headline: 'To add an additional $1.5M/year ($125K/mo), your Revenue Per Visitor™ needs to increase from:',
  rpvFrom: '{{current_rpv}}',
  rpvArrow: '→',
  rpvTo: '{{goal_rpv}}',
  calcLine: 'Revenue Per Visitor™ is calculated by dividing your total revenue by your total visitors.',
  formula: {
    lead: 'Revenue Per Visitor™ =',
    numerator: 'Total Revenue',
    denominator: 'Total Visitors your business is attracting [online and offline]',
  },
  strip: {
    left: 'YOUR RPV TODAY: {{current_rpv}}',
    divider: '|',
    right: 'NOW LET’S SEE WHAT EACH VISITOR COULD BE WORTH',
  },
};

export const SAME_PROBLEM = {
  // Design-only plum ribbon straddling the section's top seam (not in the
  // doc) — flagged. Casing + arrow per the reference.
  ribbon: 'See How It Shows Up ↓',
  // Doc (row 10): "Here are variations of the same problem a dozen marketing
  // teams scaling 7-figure businesses to 8 figures have shared with me" —
  // verbatim; line map (7/6/8 words) + the ice "same problem" highlight from
  // the design. The "v" of "variations" renders as a script glyph per the
  // design (same device as METRICS / BEHIND_NUMBER).
  l1Before: 'Here are',
  l1ScriptGlyph: 'v',
  l1ScriptRest: 'ariations',
  l1After: 'of the',
  l1Highlight: 'same problem',
  line2: 'a dozen marketing teams scaling 7-figure',
  line3: 'businesses to 8 figures have shared with me',
  // The "8 figures" brush watermark is baked into the section's bg art
  // (Frame 807 → results-relate-bg-art.webp); mobile uses the plain texture.
  // Doc continues "Perhaps you can relate?" + the four quote cards — the
  // next slice of this row, built when its reference arrives.
};

export const RELATE_QUOTES = {
  // Doc (row 10): "Perhaps you can relate?" — verbatim.
  heading: 'Perhaps you can relate?',
  // Quote copy verbatim from the doc's two nested tables. Flags:
  // - Doc prefixes attributions with "~" / "-"; the design drops the dash
  //   and renders the attribution as a plain caption line — design kept.
  // - Doc: "CMO @ Sports Ecommerce store in the UK" — design shows "CMO@ "
  //   (no space before the @); design spacing kept per the casing rule.
  // - The doc's opening/closing “ ” marks render as the plum comma graphic
  //   (comma 20.png → results-relate-quote.png), not as text.
  cards: [
    {
      tone: 'wine',
      paras: [
        'We’re growing, but growth is fuzzy.',
        'Things are working, but I don’t fully know why, and I don’t trust that they’ll keep working if I push harder.',
      ],
      who: '7-figure Concierge Medical Clinic Owner',
    },
    {
      tone: 'cream',
      paras: ['We don’t know who’s serious until the call.'],
      who: 'B2B Content Agency owner',
    },
    {
      tone: 'navy',
      paras: [
        'The majority of leads aren’t relevant.',
        'People show interest but don’t convert.',
      ],
      who: 'CMO@ Sports Ecommerce store in the UK',
    },
    {
      tone: 'ice',
      paras: [
        'Lowest quality but highest volume is from paid ads.',
        'We don’t trust what’s converting. The calls we book, sales is explaining basics.',
      ],
      who: 'Founder of a Cold Email SaaS',
    },
  ],
};

export const IN_COMMON = {
  // Doc (row 10): "Here's what they have in common. AI made content easy, so
  // everyone is producing more visibility than ever, and feeling less sure
  // where revenue is actually coming from." — verbatim. Line map from the
  // design. Doc ends "coming from." — the design image drops the period;
  // doc wins, flagged.
  heading: 'Here’s what they have in common.',
  subLine1: 'AI made content easy, so everyone is producing more visibility than',
  subLine2: 'ever, and feeling less sure where revenue is actually coming from.',
  // Doc: "More LinkedIn posts. More YouTube. More influencer collabs. More
  // ad spend." — rendered as icon labels without the periods per the design
  // (flagged). Label line breaks per the design.
  channels: [
    { icon: '/assets/results-common-linkedin.png', lines: ['More LinkedIn', 'posts'] },
    { icon: '/assets/results-common-youtube.png', lines: ['More YouTube'] },
    { icon: '/assets/results-common-collabs.png', lines: ['More influencer', 'collabs'] },
    { icon: '/assets/results-common-adspend.png', lines: ['More ad spend'] },
  ],
  beliefLines: ['All on the belief that more', 'distribution means more revenue.'],
  beliefChip: 'And you do see the correlation too.',
  // The circular "NOMADS MARKETING · CONVERSION QUIZZES" stamp (Group 122)
  // is design-only wayfinding straddling the section's top seam — flagged.
};

export const NOT_JUST_SITE = {
  // Left panel headline is baked into the eagle art (Group 840 1.png).
  // Doc: "And it's not just the site." — the art renders it ALL CAPS;
  // design casing kept per the casing rule (flagged).
  eagleAlt: 'And it’s not just the site.',
  // Doc (row 10) verbatim; line map from the design.
  subLines: [
    '9 in 10 teams run their top-of-funnel ads and influencer',
    'campaigns straight to a product page or a web page, to',
    'people who were never going to buy on the first visit.',
  ],
  headingLines: [
    'So what if you could earn more from',
    'each visitor by meeting them where',
    'they are in their buying journey?',
  ],
  hookLines: [
    'Hook the non-buyers onto your email list, and',
    'compound revenue from traffic you’re already paying for.',
  ],
  becauseBold: 'Because here’s what usually happens instead.',
  throwLines: ['Revenue gets inconsistent, and', 'the response is to throw'],
  // Doc runs these in one lowercase sentence ("…throw more money at
  // acquisition, more pressure…"); the design splits them into chevron
  // bullets with capital "More" — design presentation kept (flagged).
  bullets: [
    'More money at acquisition,',
    'More pressure on the sales team,',
    'More content into the void,',
    'More random experiments at the wall,',
  ],
  bulletsTail: 'hoping something finally moves the needle.',
  compoundingLines: ['But compounding businesses don’t do', 'more random marketing.'],
  scaleLines: [
    'They scale because they know which specific actions move',
    'revenue, where buyers lose certainty, and how to build a',
    'system where each new visitor becomes more valuable',
    'over time instead of disappearing after one interaction.',
  ],
  goalLines: [
    'That’s the real goal of the Compounding RPV™ OS.',
    'Not another funnel duct-taped onto an already',
    'chaotic customer journey.',
  ],
};

export const BOUNCE_RATES = {
  // Doc (row 10) verbatim, straight after "And you do see the correlation
  // too."; line maps from the design.
  p1Lines: [
    'You hired a content agency, your Influencer UGC spend has tripled this quarter,',
    'you’ve doubled your ad spend and you see how your revenue doubled too.',
  ],
  chip: 'That’s where most teams stop.',
  p2Lines: [
    'But when I audit the assets underneath all that traffic, I keep seeing',
    'the same thing: sites with 50, 60, 70% bounce rates. Thousands of',
    'visitors, on a page built only for the person ready to buy today.',
  ],
  // Phrases set a touch bolder (see emphasize.jsx); "Thousands of" +
  // "visitors" are listed separately because the line map splits them.
  bold: ['tripled', 'revenue doubled', '50, 60, 70% bounce rates', 'Thousands of', 'visitors'],
  // The three bounce-rate cards are fully baked design art (Groups 841–843:
  // ice card, AVG-duration chip, laptop + Similarweb popup, name, bounce
  // badge). The doc holds only an empty visual row here — design-only,
  // flagged. Alts carry the baked text for accessibility.
  cards: [
    {
      src: '/assets/results-bounce-card-1.webp',
      alt: 'David Graham, professional services — 64% bounce rate, 12-second average visit',
    },
    {
      src: '/assets/results-bounce-card-2.webp',
      alt: 'Bridgeline, coaching — 70% bounce rate, 29-second average visit',
    },
    {
      src: '/assets/results-bounce-card-3.webp',
      alt: 'Health wellbeing clinic — 60% bounce rate, 22-second average visit',
    },
  ],
};

export const TWO_PATHS = {
  // Design-only wayfinding: rotated "Here's the fork in the road" text
  // (Group 807) on a white circle straddling the seam, and the mono
  // "TWO PATHS" chip — both flagged (not in the doc).
  intro:
    'It’s the difference between guessing and a team that can look at the numbers and say:',
  // Doc (row 10 tail) verbatim; 4-line map from the design. Doc says
  // "email opt-in rate" — the design hyphenates "email-opt-in rate";
  // doc wins, flagged. Highlight span per the design.
  headlineLines: [
    '“Let’s double down on testing',
    'top-of-funnel hooks for our opt-in page',
    'because if we increase email opt-in rate',
  ],
  headlineTail: 'by 20%,',
  headlineHl: 'it adds $357,000 this quarter.”',
  forkChip: 'So there’s a fork here.',
  // Doc: "Keep spending more to reach more people. Or earn more from the
  // people already finding you, using the four pillars you just walked
  // through." — split across the two path cards + the "Or" badge per the
  // design; card B capitalises "Earn" (design casing kept, flagged).
  pathA: 'Keep spending more to reach more people.',
  pathB:
    'Earn more from the people already finding you, using the four pillars you just walked through.',
  // Panel copy verbatim; line maps from the design.
  panelP1Lines: [
    'If you’ve made it this far, part of you probably already knows your',
    'business has more sitting inside it than it’s currently pulling out,',
    'especially in the 70% of the market you’ve been walking past.',
  ],
  panelBold: ['more sitting inside it', '70% of the market'],
  // Doc runs this as one sentence ("Watch the workshop with your team, or
  // bring your numbers to a call, and let’s plan how we can add your next
  // $125k…"). The design splits it into heading + sub and drops the comma
  // after "to a call" — doc comma kept, design capitalises the sub's "How"
  // (design casing kept); both flagged.
  panelHeadingLines: [
    'Watch the workshop with your',
    'team, or bring your numbers',
    'to a call, and let’s plan',
  ],
  panelSubLines: [
    'How we can add your next $125k to your existing',
    'monthly revenue with your current marketing spend.',
  ],
  // Doc writes "→ Watch the workshop | → Book your Next +$125k/mo Game
  // Plan Call" with leading arrows; the design renders trailing arrows —
  // design kept, flagged. TODO: real workshop / booking URLs (same as NAV).
  btnWorkshop: 'Watch the workshop →',
  btnCall: 'Book your Next +$125k/mo Game Plan Call →',
};

export const WORKSHOP_INVITE = {
  // Doc (row 2 tail) verbatim. "Because…" line is bold per the design.
  because: 'Because… revenue rarely scales by millions from one isolated metric.',
  // 2-line map from the design. Doc has no terminal period — kept as is.
  mostLines: [
    'Most of the time, traffic is disconnected from monetisation, email growth is',
    'disconnected from conversion, sales calls are disconnected from positioning',
  ],
  // Headline 4-line map from the design; "revenue growth" in the cream
  // highlight box.
  headLines: [
    '…and teams keep optimising isolated',
    'channels without fully knowing',
    'which actions are directly influencing',
  ],
  headHl: 'revenue growth',
  headTail: 'across their funnel…',
  // Doc (row 3) verbatim incl. the doc's "RPV ™" spacing; 2-line map.
  beforeLines: [
    'So before you spend another dollar on marketing, it’s worth seeing how they’re connected, which one',
    'needs the most attention from your team, and which one has the potential to scale your RPV ™ the fastest.',
  ],
  // Doc verbatim incl. the 👇this👇 emoji and "RPV ™" spacing; tokens
  // resolve to the taker's live RPVs. 3-line map from the design.
  grabBefore: 'Grab a pen and paper (and your marketing, product and sales team) for 👇this👇',
  grabMid1: 'hands-on workshop to see how you can scale your RPV ™ from',
  grabMid2: 'to',
  grabAfter: 'by optimising 4 key pillars in your customer’s buying journey.',
  // Doc: "→ Watch the Workshop" — design drops the arrow; design kept
  // (flagged). TODO: real workshop URL (same as NAV).
  button: 'Watch the Workshop',
  // Doc: "[Add workshop CLICKABLE THUMBNAIL THAT REDIRECTS THEM TO WORKSHOP
  // PAGE]" — placeholder box per the design until the thumbnail asset lands.
  thumbPlaceholder: 'Thumbnail After Workshop',
  // The plum "See What's Working" stamp (Group 855) on the seam is
  // design-only wayfinding — flagged.
};

export const WHAT_IF = {
  // Doc (row 1): "But... what if you did?" — design sets a true ellipsis;
  // rendered as shown in the reference (flagged).
  kicker: 'But… what if you did?',
  // Doc: "If you hit the maximum benchmark across all five conversion
  // points, your existing traffic could add {{achievable_gain}}/year (yep,
  // with the same traffic!)" — 3-line map from the design; design
  // capitalises "Your" at the line start and lifts the parenthetical into
  // the plum banner in title case without the parens (flagged).
  headLine1: 'If you hit the maximum benchmark',
  headLine2: 'across all five conversion points,',
  headLine3Before: 'Your existing traffic could add',
  headLine3After: '/year',
  banner: 'Yep, With The Same Traffic!',
  note: 'More on how to max these metrics in the upcoming workshop.',
  // GolfBays proof card. The bold recap line is design-added (flagged);
  // the accent spans follow the design. Body is the doc's box copy
  // verbatim — the doc's em-dash before "without" is kept (design drops
  // it; doc wins, flagged).
  golfHead: [
    { t: 'GolfBays generated ' },
    { t: '£97,000+', hl: true },
    { t: ' ($131K USD) in just ' },
    { t: '20 days', hl: true },
    { t: ' after launching their Conversion Quiz Ecosystem' },
  ],
  golfHeadBreakAfter: '20 days',
  golfBody:
    'GolfBays generated £97,000+ ($131K USD) in just 20 days after launching their Conversion Quiz Ecosystem™ — without increasing traffic. They also increased demo conversions by 15.25X using the same traffic they already had.',
  golfName: 'Golfbays',
  golfType: 'E-commerce company',
};

export const STOP_OR_PUSH = {
  // Doc (row 1): "You can stop at $1.5M. Or push all 5 metrics to their
  // max." — design renders "or" lowercase mid-sentence; design casing kept
  // (flagged). Lead line above the headline.
  lead: 'You can stop at $1.5M. or push all 5 metrics to their max.',
  // Doc: "By increasing your Revenue Per Visitor™ from {{current_rpv}} →
  // {{goal_rpv}}, you could add $1.5M/year ($125K/mo) without adding a
  // penny to your current marketing and ad spend." The design splits this
  // into a 3-line headline ending at "($125K/mo)" and moves "without
  // adding…" to a body line with a capital W; the doc's comma after the
  // goal token and lowercase "you could" are dropped/capitalised per the
  // design (flagged). Tokens resolve to the taker's live RPVs.
  headLine1: 'By increasing your Revenue Per',
  headLine2Before: 'Visitor™ from',
  headLine3: 'You could add $1.5M/year ($125K/mo)',
  bodyLine1: 'Without adding a penny to your current marketing and ad spend.',
  bodyLine2: 'And nope, you don’t need to max out all 5 metrics to get there.',
  // The "PLAYFUL, YET HIGHLY PROFITABLE" compass stamp (Group 225) on the
  // top-left seam is design-only wayfinding — flagged.
};
