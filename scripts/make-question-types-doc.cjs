/* Generates "Quiz Question Slide Types.docx" — categorized reference of
   the RPV Diagnostic quiz question screens. Run: node scripts/make-question-types-doc.cjs */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, HeadingLevel, AlignmentType, BorderStyle,
} = require('docx');
const fs = require('fs');

const PLUM = '5D1B4E';
const INK = '250F1C';
const LAV = 'F2E5F6';
const CREAM = 'F2E6D8';

const border = { style: BorderStyle.SINGLE, size: 4, color: 'C3A6BF' };
const borders = { top: border, bottom: border, left: border, right: border };

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: PLUM },
    borders,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })] })],
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    borders,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.bold, color: opts.color || INK, size: 19, font: 'Calibri' })] })],
  });
}

function qTable(rows) {
  // Step | ID | Label | Question | Options | Special behaviour
  const w = [700, 700, 1500, 3460, 900, 2100];
  return new Table({
    columnWidths: w,
    width: { size: 9360, type: WidthType.DXA },
    rows: [
      new TableRow({ children: ['Step', 'ID', 'Label', 'Question', 'Options', 'Special behaviour'].map((t, i) => headerCell(t, w[i])) }),
      ...rows.map((r, ri) => new TableRow({
        children: r.map((t, i) => cell(t, w[i], { fill: ri % 2 ? 'FFFFFF' : LAV })),
      })),
    ],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 120 }, children: [new TextRun({ text, bold: true, color: PLUM, size: 30, font: 'Calibri' })] });
}

function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, size: 20, color: opts.color || INK, italics: !!opts.i, bold: !!opts.b, font: 'Calibri' })] });
}

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 20, color: INK } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'RPV™ Diagnostic Quiz', bold: true, size: 44, color: PLUM, font: 'Calibri' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 }, children: [new TextRun({ text: 'Question Slide Types — Categorized Reference (Sep 2026)', size: 24, color: INK, font: 'Calibri' })] }),

      p('The quiz has 18 question screens (Q1–Q14; steps 02, 07 and 09 have sub-questions). Every screen uses one of four templates:'),

      new Table({
        columnWidths: [3200, 1200, 4960],
        width: { size: 9360, type: WidthType.DXA },
        rows: [
          new TableRow({ children: [headerCell('Category', 3200), headerCell('Count', 1200), headerCell('Questions', 4960)] }),
          new TableRow({ children: [cell('Yes / No (binary)', 3200, { fill: LAV }), cell('1', 1200, { fill: LAV }), cell('Q2B', 4960, { fill: LAV })] }),
          new TableRow({ children: [cell('GIF / icon based (media tiles)', 3200), cell('3', 1200), cell('Q2A, Q4, Q13', 4960)] }),
          new TableRow({ children: [cell('Multiple option (list)', 3200, { fill: LAV }), cell('13', 1200, { fill: LAV }), cell('Q1, Q3, Q5, Q6, Q7A, Q7B, Q7C, Q8, Q9A, Q9B, Q10, Q11, Q12', 4960, { fill: LAV })] }),
          new TableRow({ children: [cell('Free text (open answer)', 3200), cell('1', 1200), cell('Q14', 4960)] }),
        ],
      }),

      h1('1. Yes / No question (binary)'),
      p('Two big pill buttons with tick / cross icons.'),
      qTable([
        ['02', 'Q2B', 'A quick gate check', 'Do you have the operational ability to scale past $100k/month?', '2', 'Conditional: only shows when Q2A = Under $10k/month. "No" leads to the disqualification screen.'],
      ]),

      h1('2. GIF / icon based questions (media tiles)'),
      p('Option cards with an animated GIF tile above each label. 16 GIFs total across these three screens (currently loaded from Giphy).'),
      qTable([
        ['02', 'Q2A', 'Where you stand', 'To make our recommendations realistic, where is your business today?', '5', '5 GIF tiles'],
        ['04', 'Q4', 'How you sell', 'How does your business typically win a customer?', '4', '4 GIF tiles. Sets the SLG / PLG path for the rest of the quiz.'],
        ['13', 'Q13', 'What you tried', 'What have you already tried to improve your revenue?', '7', '7 GIF tiles. Multi-select + "Other" with its own type-in field.'],
      ]),

      h1('3. Multiple option questions (list)'),
      p('The standard template: numbered answer rows on the right panel.'),
      qTable([
        ['01', 'Q1', 'To get the clarity', "Before we get into the good stuff, who's on the other side of this screen?", '5', '—'],
        ['03', 'Q3', 'What you scale', 'Good. What are you scaling?', '8', '—'],
        ['05', 'Q5', 'The pressing problem', 'If 5,000 qualified visitors landed on your business tomorrow, what would your team be obsessing over to make 60 sales from it?', '5', 'Answer picks which case study (5A–5E) is shown.'],
        ['06', 'Q6', 'Where traffic lives', 'Where does most of your traffic or audience come from today?', '10', 'Multi-select. Picking a paid channel unlocks Q7B/Q7C.'],
        ['07', 'Q7A', 'Monthly eyeballs count', 'Roughly, how many eyeballs is your business getting each month across all your channels?', '8', 'Manual exact-number entry. "Under 3,000" leads to disqualification.'],
        ['07', 'Q7B', 'Monthly ad spend', 'You mentioned some of your traffic is paid. Roughly, what are you putting into ads each month?', '7', 'Conditional (paid traffic only). Manual entry.'],
        ['07', 'Q7C', 'Paid traffic share', 'Of all the visitors landing on your business each month, how much comes from paid ads specifically?', '6', 'Conditional (paid traffic only). Has a Skip button — skipping defaults the share to 50% with a slider on the results page.'],
        ['08', 'Q8', 'New subscribers monthly', 'Out of everyone discovering your business each month, how many are becoming new email subscribers?', '8', 'Manual entry.'],
        ['09', 'Q9A', 'Subscriber to lead', 'Out of every 100 new subscribers joining your list, how many turn into leads (PLG wording) / book a call or demo (SLG wording) within the first 14 days?', '7', 'Wording changes by SLG/PLG path. Manual entry.'],
        ['09', 'Q9B', 'Lead to close', 'And of those leads, what percentage end up buying? (PLG) / And of the calls your team takes, what percentage close into clients? (SLG)', '7', 'Wording changes by path. Manual entry.'],
        ['10', 'Q10', 'Money per sale', "What's your average order value? (PLG) / What's your average deal size? (SLG)", '15', 'Options differ by path. Manual entry.'],
        ['11', 'Q11', 'Email list revenue', 'How much revenue came from your email list in the last 12 months?', '9', 'Manual entry.'],
        ['12', 'Q12', 'Your current puzzle', "What's the one thing you and your team are heads down trying to crack right now?", '9', 'Options differ by SLG (5) / PLG (4) path. Answer picks the advice slide (12A–12D).'],
      ]),

      h1('4. Free text question'),
      qTable([
        ['14', 'Q14', 'One last thing', 'Haaaa! The ride is over. One last Q: (What was going on in your life that made you take this quiz today?)', '—', 'Open text box (the designed "feedback loop" screen with Alefiya\'s photo). Saved to Kit as the voice-of-customer answer.'],
      ]),

      h1('Good to know'),
      p('• Multi-select screens (Q6, Q13) and manual-entry screens show a Continue button; single-select screens advance on click.'),
      p('• Manual entry ("None of these / enter exact number") exists on: Q7A, Q7B, Q8, Q9A, Q9B, Q10, Q11 — exact numbers pass straight into the calculator and Kit.'),
      p('• Conditional screens that can be skipped by routing: Q2B (gate), Q7B and Q7C (paid traffic only), and the theme colors re-flow automatically so the blue → maroon → green rotation never breaks.'),
      p('• The 16 GIFs are loaded from Giphy today — self-hosting them is on the pre-launch checklist.'),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync('Quiz Question Slide Types.docx', buf);
  console.log('written: Quiz Question Slide Types.docx');
});
