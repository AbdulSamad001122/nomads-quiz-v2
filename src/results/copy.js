/**
 * Result page copy — VERBATIM from "Quiz Questions and logic/Result Page Copy.docx"
 * (the copy source of truth; supersedes Quiz Logics.docx except the blue
 * conditional blocks which defer to the Logic Doc). {{tokens}} are dynamic
 * values resolved in resolveTokens.js.
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
    // TODO: real workshop / booking URLs when provided.
    { label: 'Watch the hands-on workshop with your team', id: 'watch_workshop', variant: 'blue', href: '#' },
    { label: 'Book your Next $125k/mo game-plan call', id: 'book_call', variant: 'pink', href: '#' },
  ],
};

export const METRICS = {
  // Doc ends this sentence with ":" (design image drops it — doc wins, flagged).
  // Line map from the reference image; the "v" of visitor renders as a script glyph.
  headlineLines: [
    'Here’s what the same visitor could be worth',
    'once four pillars in your customer’s buying',
    'journey work in sync, supporting each other:',
  ],
  totalTraffic: 'Total traffic:',
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
  sliderLabel: 'Your Monthly Spend',
  adjustNote: 'You can adjust your ad spend for it to accurately match your current ad spend',
  // Table labels are design-sourced (the copy doc has no table copy) — mapped
  // to the Logic Doc calculator fields; flagged.
  tableLabels: {
    spend: 'Your Monthly Spend',
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
  // Doc has "For the data nerds 🧮" — emoji removed per the exact-match
  // calculator close-up (user instruction Sep 11); flagged.
  nerdsTitle: 'For the data nerds',
  nerdsP1: 'This diagnostic can’t peek inside your Google Analytics, CRM, ad dashboards, or other data sources.',
  nerdsP2: 'So if you want to go deeper and nerd out, grab your numbers to see your Revenue Per Visitor™ by channel — and find which channels are most profitable.',
  nerdsP3Plain: 'Paid. Organic. Referral. Email. Social.',
  nerdsP3Bold: 'Whatever you’ve got.',
  channelButton: '→ Calculate My RPV By Channel',
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
  headlineLines: [
    'From the inside, it’s genuinely',
    'hard to tell which of the four',
    'pillars is the one holding you back.',
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
  band: 'That\'s what you get on the call.',
};

export const YOUR_CALL = {
  para1: 'Run it in-house, or hand it to our dream team that\'s done it across 15+ industries.',
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
  para: 'And when your marketing only speaks to this tiny percentage, you have to reach a lot more eyeballs to hit your sales goals (so you’re bleeding time or money for low conversions — sound familiar?).',
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

export const HERO = {
  introBefore: 'You’re here for the spoils of adding',
  introChip: '$1.5M/Year',
  introAfter: 'without increasing your marketing spend.',
  basedOn: 'Based on your answers…',
  headlineLines: ['Right now, every visitor landing', 'in your ecosystem is generating'],
  numberToken: '{{current_annual_revenue}}',
  numberChip: 'in revenue.',
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
