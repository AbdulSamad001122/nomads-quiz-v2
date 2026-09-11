/**
 * All 18 question screens from the v2.0 wireframe (Quiz Questions.docx),
 * in order, with themes alternating blue → maroon → green per question slide.
 *
 * Fields:
 *  - id           stable key, also used for answers + Kit tags later
 *  - stepNumber   the script badge number on the left panel
 *  - label        Roboto Mono strip, 3–4 words
 *  - theme        legacy hint only — the ACTUAL theme is computed in QuizFlow,
 *                 alternating blue→maroon→green over the questions the taker
 *                 actually sees (skipped conditionals don't consume a colour)
 *  - variant      'list' | 'binary' | 'media' | 'text'
 *  - question     string (or { plg, slg } when wording differs by path)
 *  - subline      optional smaller line under the question
 *  - options      array (or { plg, slg }) — id + label (+ media/icon)
 *  - multi        multi-select (Continue button instead of auto-advance)
 *  - manualEntry  last option reveals an exact-number input when tapped
 *  - manualType   'number' | 'currency' | 'percent' | 'text'
 *  - allowSkip    skippable (Q7C)
 *
 * PLG/SLG wording for Q9A/Q9B/Q10/Q12 is placeholder pending the master
 * copy doc — values and structure follow Quiz Logics.docx.
 */

const g = (id) => `https://media.giphy.com/media/${id}/giphy.gif`;

export const QUESTIONS = [
  {
    id: 'q1',
    stepNumber: '01',
    label: 'To get the clarity',
    theme: 'blue',
    variant: 'list',
    question:
      "Before we get into the good stuff, who's on the other side of this screen?",
    options: [
      { id: 'founder', label: 'Founder or Managing Partner' },
      { id: 'head-marketing', label: 'Head of Marketing, Content, or Sales' },
      { id: 'performance-marketer', label: 'Performance Marketer' },
      { id: 'obm-assistant', label: 'OBM / Marketing Assistant or Executive' },
      {
        id: 'freelancer',
        label: 'Freelancer',
        sub: '(under 2 years of experience)',
      },
    ],
  },
  {
    id: 'q2a',
    stepNumber: '02',
    label: 'Where you stand',
    theme: 'maroon',
    variant: 'list',
    question:
      'To make our recommendations realistic, where is your business today?',
    options: [
      { id: 'under-10k', label: 'Under $10k/month' },
      { id: '10k-35k', label: '$10k – $35k/month' },
      { id: '35k-100k', label: '$35k – $100k/month' },
      { id: '100k-250k', label: '$100k – $250k/month' },
      { id: '250k-500k', label: '$250k – $500k+/month' },
    ],
  },
  {
    id: 'q2b',
    stepNumber: '02',
    label: 'A quick gate check',
    theme: 'green',
    variant: 'binary',
    showIf: (a) => a.q2a === 'under-10k',
    question:
      'Do you have the operational ability to scale past $100k/month?',
    options: [
      { id: 'yes', label: 'Yes', icon: 'tick' },
      { id: 'no', label: 'No', icon: 'cross' },
    ],
    disqualifyIf: (a) => a.q2b === 'no',
    dqReason: 'revenue_gate',
  },
  {
    id: 'q3',
    stepNumber: '03',
    label: 'What you scale',
    theme: 'blue',
    variant: 'media',
    question: 'Good. What are you scaling?',
    subline:
      'Because the path to an extra $1.5M/year looks different for an agency than it does for a course creator.',
    options: [
      { id: 'saas', label: 'SaaS or Tech Company', media: '/assets/q3-laptop.svg' },
      { id: 'agency', label: 'Agency', media: '/assets/q3-team.svg' },
      {
        id: 'coach',
        label: 'Coaches and Course Creators',
        media: '/assets/q3-cap.svg',
      },
      {
        id: 'consultant',
        label: 'Consultant or Fractional Expert',
        media: '/assets/q3-professional.svg',
      },
      {
        id: 'b2b-service',
        label: 'B2B Service Provider',
        sub: '(law, finance, real estate, logistics, architecture)',
        media: '/assets/q3-handshake.svg',
      },
      { id: 'ecommerce', label: 'E-commerce Brand', media: '/assets/q3-cart.svg' },
      {
        id: 'creator',
        label: 'Creator or Personal Brand',
        media: '/assets/q3-camera.svg',
      },
      { id: 'other', label: 'Other', sub: "(Your ex put you in a box. We won't.)" },
    ],
  },
  {
    id: 'q4',
    stepNumber: '04',
    label: 'How you sell',
    theme: 'maroon',
    variant: 'media',
    question: 'How does your business typically win a customer?',
    subline: 'Where do roughly 80% of your sales come from today?',
    options: [
      {
        id: 'calls',
        label: 'We close most deals through calls or demos',
        media: g('lRPmjJleU2Usz8mu6v'),
        tag: 'SLG',
      },
      {
        id: 'self-serve',
        label: 'Most people buy without ever talking to us',
        media: g('fw2LNzndEtIytKbDqU'),
        tag: 'PLG',
      },
      {
        id: 'hybrid-call',
        label: 'Some buy on their own, some still need a call',
        media: g('3ohfFhG5VDtDTzQv2o'),
        tag: 'SLG',
      },
      {
        id: 'hybrid-mess',
        label: "It's a bit all over the place right now",
        media: g('cPfGsK8NjMWXjiXNR4'),
        tag: 'SLG',
      },
    ],
  },
  {
    id: 'q5',
    stepNumber: '05',
    label: 'The pressing problem',
    theme: 'green',
    variant: 'list',
    question:
      'If 5,000 qualified visitors landed on your business tomorrow, what would your team be obsessing over to make 60 sales from it?',
    subline: '(Select the ONE most pressing problem right now.)',
    options: [
      {
        id: 'cold-traffic',
        iconSrc: '/assets/q5-funnel.svg',
        label:
          "We're driving cold traffic to our website or product pages, but if they're not ready to buy, we lose them. We don't have a way to keep them on our email list or pull them from “not considering” to “I'm open to it.”",
        rich: [
          [
            {
              t: "We're driving cold traffic to our website or product pages, but if they're not ready to buy, we lose them.",
            },
          ],
          [
            { t: "We don't have a way to keep them on our email list or pull them " },
            { t: 'from “not considering” to “I\'m open to it.”', b: true },
          ],
        ],
      },
      {
        id: 'low-optin',
        iconSrc: '/assets/q5-envelope.svg',
        label:
          'Our email list is our most profitable channel, but our opt-in rates are low, and we need a better way to get more people in there every day.',
        rich: [
          [
            { t: 'Our email list is our most profitable channel, but our ' },
            { t: 'opt-in rates are low', b: true },
            { t: '.' },
          ],
          [
            { t: 'And we need a better way to get ' },
            { t: 'more people in there every day', b: true },
            { t: '.' },
          ],
        ],
      },
      {
        id: 'differentiation',
        iconSrc: '/assets/q5-diamond.svg',
        label:
          "People land on our website, read everything, and still can't tell why we're different from the five other options they're comparing us to, so they either pick the cheaper one or go with a familiar name.",
        rich: [
          [
            { t: "People land on our website, read everything, and still can't tell " },
            { t: "why we're different", b: true },
            { t: " from the five other options they're comparing us to." },
          ],
          [
            { t: 'So they either pick the ' },
            { t: 'cheaper one', b: true },
            { t: ' or go with a ' },
            { t: 'familiar name', b: true },
            { t: '.' },
          ],
        ],
      },
      {
        id: 'email-close',
        iconSrc: '/assets/q5-loop.svg',
        label:
          "People are joining our list every day, but our emails aren't doing enough to close them in the first 14 days, and beyond that, we don’t have a solid strategy to keep converting the non-buyers over time, so our email revenue doesn’t compound month on month.",
        rich: [
          [
            { t: "People are joining our list every day, but our emails aren't doing enough to close them in the " },
            { t: 'first 14 days', b: true },
            { t: '.' },
          ],
          [
            { t: "And beyond that, we don’t have a solid strategy to keep converting the non-buyers over time, so our " },
            { t: 'email revenue doesn’t compound', b: true },
            { t: ' month on month.' },
          ],
        ],
      },
      {
        id: 'call-convincing',
        iconSrc: '/assets/q5-handshake.svg',
        label:
          "We're spending a good chunk of our sales calls convincing doubtful buyers; we need a system that shows our differentiation before the call, so the call is spent closing, not educating.",
        rich: [
          [
            { t: "We're spending a good chunk of our sales calls " },
            { t: 'convincing doubtful buyers', b: true },
            { t: '.' },
          ],
          [
            { t: 'We need a system that shows our differentiation before the call, so the call is spent ' },
            { t: 'closing, not educating', b: true },
            { t: '.' },
          ],
        ],
      },
    ],
  },
  {
    id: 'q6',
    stepNumber: '06',
    label: 'Where traffic lives',
    theme: 'blue',
    variant: 'list',
    multi: true,
    question: 'Where does most of your traffic or audience come from today?',
    subline: '(Select all that apply)',
    options: [
      { id: 'linkedin', label: 'LinkedIn content' },
      { id: 'social', label: 'Instagram / TikTok / social media' },
      { id: 'seo', label: 'SEO / Google search' },
      { id: 'paid-ads', label: 'Paid ads' },
      { id: 'youtube', label: 'YouTube' },
      { id: 'referrals', label: 'Referrals / word of mouth' },
      { id: 'email', label: 'Email marketing' },
      { id: 'influencers', label: 'Influencer partnerships' },
      { id: 'communities', label: 'Communities / forums' },
      { id: 'affiliates', label: 'Partnerships or affiliates' },
    ],
  },
  {
    id: 'q7a',
    stepNumber: '07',
    label: 'Monthly eyeballs count',
    theme: 'maroon',
    variant: 'list',
    manualEntry: true,
    manualType: 'number',
    question:
      'Roughly, how many eyeballs is your business getting each month across all your channels?',
    subline: '(Website visits, social media reach, offline — all of it counts.)',
    options: [
      { id: 'under-3000', label: 'Under 3,000' },
      { id: '3000-5000', label: '3,000 to 5,000' },
      { id: '5001-10000', label: '5,001 to 10,000' },
      { id: '10001-50000', label: '10,001 to 50,000' },
      { id: '50001-100000', label: '50,001 to 100,000' },
      { id: '100000-plus', label: '100,000+' },
      { id: 'dont-track', label: "We don't track this number yet" },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
    disqualifyIf: (a) => a.q7a === 'under-3000',
    dqReason: 'traffic_gate',
  },
  {
    id: 'q7b',
    stepNumber: '07',
    label: 'Monthly ad spend',
    theme: 'green',
    variant: 'list',
    manualEntry: true,
    manualType: 'currency',
    showIf: (a) => Array.isArray(a.q6) && a.q6.includes('paid-ads'),
    question:
      'You mentioned some of your traffic is paid. Roughly, what are you putting into ads each month?',
    options: [
      { id: 'under-5k', label: 'Under $5k' },
      { id: '5k-10k', label: '$5k – $10k' },
      { id: '10k-25k', label: '$10k – $25k' },
      { id: '25k-50k', label: '$25k – $50k' },
      { id: '50k-100k', label: '$50k – $100k' },
      { id: '100k-plus', label: '$100k+' },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
  },
  {
    id: 'q7c',
    stepNumber: '07',
    label: 'Paid traffic share',
    theme: 'blue',
    variant: 'list',
    allowSkip: true,
    showIf: (a) =>
      Array.isArray(a.q6) && a.q6.includes('paid-ads') && a.q7b != null,
    question:
      'Of all the visitors landing on your business each month, how much comes from paid ads specifically?',
    options: [
      {
        id: 'under-25',
        heading: 'Under 25%',
        label:
          'Just a small part. Most traffic is organic, SEO, or word of mouth.',
      },
      {
        id: '25-44',
        heading: '25% to 44%',
        label:
          'Less than half. Ads bring a decent chunk, organic and referrals bring more.',
      },
      { id: '45-55', heading: '45% to 55%', label: 'About half. Fairly even split.' },
      {
        id: '56-75',
        heading: '56% to 75%',
        label: 'More than half. Ads are our biggest single source.',
      },
      {
        id: 'over-75',
        heading: 'Over 75%',
        label:
          'Almost all of it. Take the ads away and traffic mostly stops.',
      },
      {
        id: 'not-sure',
        label:
          "Not sure. We haven't broken traffic down by source. (We'll estimate and you can adjust your results.)",
      },
    ],
  },
  {
    id: 'q8',
    stepNumber: '08',
    label: 'New subscribers monthly',
    theme: 'maroon',
    variant: 'list',
    manualEntry: true,
    manualType: 'number',
    question:
      'Out of everyone discovering your business each month, how many are becoming new email subscribers?',
    subline:
      '(Think new opt-ins across all your lead magnets, landing pages, and anywhere else people join your list.)',
    options: [
      { id: 'under-1000', label: 'Under 1,000' },
      { id: '1000-5000', label: '1,000 to 5,000' },
      { id: '5001-10000', label: '5,001 to 10,000' },
      { id: '10001-25000', label: '10,001 to 25,000' },
      { id: '25001-50000', label: '25,001 to 50,000' },
      { id: '50000-plus', label: '50,000+' },
      { id: 'dont-track', label: "We don't track this number yet" },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
  },
  {
    id: 'q9a',
    stepNumber: '09',
    label: 'Subscriber to lead',
    theme: 'green',
    variant: 'list',
    manualEntry: true,
    manualType: 'percent',
    question: {
      plg: 'Out of every 100 new subscribers joining your list, how many turn into leads within the first 14 days?',
      slg: 'Out of every 100 new subscribers joining your list, how many book a call (or a demo) within the first 14 days?',
    },
    options: [
      { id: 'under-1', label: 'Fewer than 1 in 100' },
      { id: '1-5', label: '1 to 5' },
      { id: '5-10', label: '5 to 10' },
      { id: '10-15', label: '10 to 15' },
      { id: '15-plus', label: '15+' },
      { id: 'dont-track', label: "We don't track this number yet" },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
  },
  {
    id: 'q9b',
    stepNumber: '09',
    label: 'Lead to close',
    theme: 'blue',
    variant: 'list',
    manualEntry: true,
    manualType: 'percent',
    question: {
      plg: 'And of those leads, what percentage end up buying?',
      slg: 'And of the calls your team takes, what percentage close into clients?',
    },
    options: [
      { id: 'under-10', label: 'Under 10%' },
      { id: '10-25', label: '10 – 25%' },
      { id: '25-50', label: '25 – 50%' },
      { id: '50-75', label: '50 – 75%' },
      { id: '75-plus', label: '75%+' },
      { id: 'dont-track', label: "We don't track this number yet" },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
  },
  {
    id: 'q10',
    stepNumber: '10',
    label: 'Money per sale',
    theme: 'maroon',
    variant: 'list',
    manualEntry: true,
    manualType: 'currency',
    question: {
      plg: "What's your average order value?",
      slg: "What's your average deal size?",
    },
    options: {
      plg: [
        { id: 'under-50', label: 'Under $50' },
        { id: '50-100', label: '$50 – $100' },
        { id: '100-250', label: '$100 – $250' },
        { id: '250-500', label: '$250 – $500' },
        { id: '500-1000', label: '$500 – $1,000' },
        { id: '1000-2000', label: '$1,000 – $2,000' },
        { id: '2000-plus', label: '$2,000+' },
        {
          id: 'manual',
          label: 'Enter your exact number for more accurate calculations',
        },
      ],
      slg: [
        { id: '500-2000', label: '$500 – $2,000' },
        { id: '2000-5000', label: '$2,000 – $5,000' },
        { id: '5000-10000', label: '$5,000 – $10,000' },
        { id: '10000-25000', label: '$10,000 – $25,000' },
        { id: '25000-50000', label: '$25,000 – $50,000' },
        { id: '50000-plus', label: '$50,000+' },
        {
          id: 'manual',
          label: 'Enter your exact number for more accurate calculations',
        },
      ],
    },
  },
  {
    id: 'q11',
    stepNumber: '11',
    label: 'Email list revenue',
    theme: 'green',
    variant: 'list',
    manualEntry: true,
    manualType: 'currency',
    question: 'How much revenue came from your email list in the last 12 months?',
    subline:
      'Pick your best estimate. There’s a calculator on your results page that takes you deeper into your email numbers.',
    options: [
      { id: 'under-25k', label: 'Under $25,000' },
      { id: '25k-100k', label: '$25,000 to $100,000' },
      { id: '100k-250k', label: '$100,000 to $250,000' },
      { id: '250k-500k', label: '$250,000 to $500,000' },
      { id: '500k-1m', label: '$500,000 to $1M' },
      { id: '1m-2.5m', label: '$1M to $2.5M' },
      { id: 'over-2.5m', label: 'Over $2.5M' },
      { id: 'no-email', label: "We don't do email marketing" },
      {
        id: 'manual',
        label: 'Enter your exact number for more accurate calculations',
      },
    ],
  },
  {
    id: 'q12',
    stepNumber: '12',
    label: 'Your current puzzle',
    theme: 'blue',
    variant: 'list',
    question:
      "What's the one thing you and your team are heads down trying to crack right now?",
    options: {
      plg: [
        {
          id: 'a',
          label: "We're attracting more casual browsers than buyers",
        },
        {
          id: 'b',
          label:
            "Why has revenue started to plateau, even though traffic hasn't?",
        },
        {
          id: 'c',
          label:
            'Sales are inconsistent. Some weeks are great, others are quiet.',
        },
        {
          id: 'd',
          label:
            "How do we stop losing sales to cheaper alternatives, especially when we know we're the better choice?",
        },
      ],
      slg: [
        {
          id: 'a',
          label:
            "Honestly, the quality of who's landing on our calls — too many doubtful buyers who need convincing from the ground up",
        },
        {
          id: 'b',
          label:
            "Why has revenue started to plateau, even though traffic hasn't?",
        },
        {
          id: 'c',
          label:
            'The pipeline is there, but sales calls are inconsistent, and we want to know what next month looks like before it arrives',
        },
        {
          id: 'd',
          label:
            "We're getting visibility, but we can't tell which channels are actually driving revenue.",
        },
        {
          id: 'e',
          label:
            'We’re losing to price wars! We’re seeing more deals go to competitors.',
        },
      ],
    },
  },
  {
    id: 'q13',
    stepNumber: '13',
    label: 'What you tried',
    theme: 'maroon',
    variant: 'media',
    multi: true,
    otherEntry: true,
    question: 'What have you already tried to improve your revenue?',
    subline: '(Select all that apply)',
    options: [
      {
        id: 'paid-ads',
        label:
          "We've increased our paid ad spend and experimented with new acquisition channels",
        media: '/assets/q13-megaphone.svg',
      },
      {
        id: 'organic',
        label:
          "We've been investing in organic channels like SEO, content, and social",
        media: '/assets/q13-hashtag.svg',
      },
      {
        id: 'lead-magnets',
        label:
          "We've created lead magnets (webinars, ebooks, whitepapers) to capture and nurture traffic",
        media: '/assets/q13-magnet.svg',
      },
      {
        id: 'email-marketing',
        label:
          "We've been building out email marketing to engage leads and turn them into customers",
        media: '/assets/q13-envelope.svg',
      },
      {
        id: 'funnel',
        label:
          "We've been optimising our funnel (website, landing pages, conversion flows)",
        media: '/assets/q13-funnel.svg',
      },
      {
        id: 'messaging',
        label: "We've worked on refining our messaging and positioning",
        media: '/assets/q13-diamond.svg',
      },
      {
        id: 'other',
        label: 'Other (please specify)',
      },
    ],
  },
  {
    id: 'q14',
    stepNumber: '14',
    label: 'One last thing',
    theme: 'green',
    variant: 'text',
    question: 'Haaaa! The ride is over. One last Q:',
    subline:
      'What was going on in your life and business that led you to take this diagnostic today?',
    options: [],
  },
];

/** PLG or SLG for a given answers map (Q4 drives it; SLG is the default). */
export function salesModel(answers) {
  const q4 = answers.q4;
  return q4 === 'self-serve' ? 'plg' : 'slg';
}

/** Resolve a question's text/options for the current path. */
export function resolveQuestion(q, answers) {
  const path = salesModel(answers);
  return {
    ...q,
    question: typeof q.question === 'object' ? q.question[path] : q.question,
    options: Array.isArray(q.options) ? q.options : q.options[path],
  };
}
