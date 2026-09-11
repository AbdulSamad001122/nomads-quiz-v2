const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, BorderStyle, HeadingLevel } = require('docx');
const fs = require('fs');
const PLUM = '5D1B4E', INK = '250F1C', LAV = 'F2E5F6';
const border = { style: BorderStyle.SINGLE, size: 4, color: 'C3A6BF' };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (text, width, opts = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
  borders, margins: { top: 90, bottom: 90, left: 110, right: 110 },
  children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.bold, color: opts.color || INK, size: 21, font: 'Calibri' })] })],
});
const headerRow = () => new TableRow({ children: [
  cell('Point box', 5460, { bold: true, fill: PLUM, color: 'FFFFFF' }),
  cell('Selected icon idea', 3900, { bold: true, fill: PLUM, color: 'FFFFFF' }),
] });
const makeTable = (rows) => new Table({
  columnWidths: [5460, 3900],
  width: { size: 9360, type: WidthType.DXA },
  rows: [headerRow(), ...rows.map((r, i) => new TableRow({ children: [cell(r[0], 5460, { bold: true, fill: i % 2 ? 'FFFFFF' : LAV }), cell(r[1], 3900, { fill: i % 2 ? 'FFFFFF' : LAV })] }))],
});
const h = (text) => new Paragraph({ spacing: { before: 320, after: 140 }, children: [new TextRun({ text, bold: true, size: 28, color: PLUM, font: 'Calibri' })] });
const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Advice Slides — Icon Ideas (12B, 12C & 12D)', bold: true, size: 38, color: PLUM, font: 'Calibri' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Selected concepts for the point boxes — same hand-drawn single-object style as the 12A icons (clipboard / dartboard with arrow / funnel)', size: 21, color: INK, font: 'Calibri' })] }),
      h('Slide 12B — Three levers that break a plateau'),
      makeTable([
        ['Card 1 — Are more people buying in the first 10 days?', 'Hourglass (sand running — the early attention window)'],
        ['Card 2 — Are you nurturing non-buyers differently from buyers?', 'Open envelope with a letter coming out — or a closed envelope'],
        ['Card 3 — Are you going back to your existing buyers?', 'Shopping bag, or a diamond / gem'],
      ]),
      h('Slide 12C — What is happening behind the inconsistency'),
      makeTable([
        ['Card 1 — The content team (celebrating a 30% increase in visibility)', 'Megaphone (shouting for visibility)'],
        ['Card 2 — The ads team (responsible for the calls or clicks they produce)', 'Magnet (ads pulling people in)'],
        ['Card 3 — Sales & customer service (15 minutes or 3 hours to close, refunds, ROAS)', 'Stopwatch (the clock on closing the deal)'],
      ]),
      h('Slide 12D — Why you need a Contrarian POV'),
      makeTable([
        ['Card 1 — The "why switch"', 'Signpost with two arrows (choosing a new direction)'],
        ['Card 2 — The contradiction', 'Tipping scale (old way vs your way, balance shifting)'],
        ['Card 3 — Your customer’s words', 'Microphone (capturing the customer’s voice)'],
      ]),
    ],
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('Advice Slides Icon Ideas.docx', b); console.log('written'); });
