import sys
import docx
from docx.shared import Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

SRC, OUT = sys.argv[1], sys.argv[2]
d = docx.Document(SRC)
t = d.tables[0]

PREVIEW = 'https://nomads-quiz-v2-kh1edi72n-iamabdulsamad20-gmailcoms-projects.vercel.app/?results=fixture'
LOCAL = 'http://localhost:3000/?results=fixture'
LOCAL_CAPPED = 'http://localhost:3000/?results=capped'

LABELS = {
    'live':   ('✔ DONE – LIVE', 'D9F2E3', '1E6B3F'),
    'built':  ('✔ BUILT – IN PREVIEW (not live yet)', 'E4EEFB', '1F4F8A'),
    'partly': ('◐ PARTLY DONE', 'FFF2CC', '7A5A00'),
    'todo':   ('✘ NOT STARTED', 'F1F1F1', '555555'),
    'hold':   ('⏸ ON HOLD (skipped for now)', 'F6E3EE', '7A2257'),
}


def shd_el(fill):
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill)
    return shd


PPR_AFTER_SHD = ('w:tabs', 'w:suppressAutoHyphens', 'w:kinsoku', 'w:wordWrap', 'w:overflowPunct',
                 'w:topLinePunct', 'w:autoSpaceDE', 'w:autoSpaceDN', 'w:bidi', 'w:adjustRightInd',
                 'w:snapToGrid', 'w:spacing', 'w:ind', 'w:contextualSpacing', 'w:mirrorIndents',
                 'w:suppressOverlap', 'w:jc', 'w:textDirection', 'w:textAlignment', 'w:textboxTightWrap',
                 'w:outlineLvl', 'w:divId', 'w:cnfStyle', 'w:rPr', 'w:sectPr', 'w:pPrChange')
RPR_AFTER_SHD = ('w:fitText', 'w:vertAlign', 'w:rtl', 'w:cs', 'w:em', 'w:lang', 'w:eastAsianLayout',
                 'w:specVanish', 'w:oMath')


def shade(p, fill):
    p._p.get_or_add_pPr().insert_element_before(shd_el(fill), *PPR_AFTER_SHD)


def shade_run(r, fill):
    r._r.get_or_add_rPr().insert_element_before(shd_el(fill), *RPR_AFTER_SHD)


def bullet(p, level=0):
    numPr = p._p.get_or_add_pPr().get_or_add_numPr()
    numPr.get_or_add_ilvl().val = level
    numPr.get_or_add_numId().val = 8


def space(p, before=0, after=2):
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)


def run(p, text, bold=False, size=9.5, color=None, italic=False):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = RGBColor.from_string(color)
    return r


def link(p, text, url, size=9.5):
    rid = p.part.relate_to(url, RT.HYPERLINK, is_external=True)
    h = OxmlElement('w:hyperlink'); h.set(qn('r:id'), rid)
    r = OxmlElement('w:r'); rPr = OxmlElement('w:rPr')
    c = OxmlElement('w:color'); c.set(qn('w:val'), '1155CC'); rPr.append(c)
    u = OxmlElement('w:u'); u.set(qn('w:val'), 'single'); rPr.append(u)
    sz = OxmlElement('w:sz'); sz.set(qn('w:val'), str(int(size * 2))); rPr.append(sz)
    r.append(rPr)
    tx = OxmlElement('w:t'); tx.text = text; tx.set(qn('xml:space'), 'preserve'); r.append(tx)
    h.append(r)
    p._p.append(h)


class Cell:
    """Writes into a (cleared) Status cell."""

    def __init__(self, cell):
        self.cell = cell
        for p in list(cell.paragraphs)[1:]:
            p._p.getparent().remove(p._p)
        first = cell.paragraphs[0]
        for r in list(first.runs):
            r._r.getparent().remove(r._r)
        self.fresh = first

    def para(self):
        if self.fresh is not None:
            p, self.fresh = self.fresh, None
            return p
        return self.cell.add_paragraph()

    def label(self, kind, title=None, left=None):
        text, fill, ink = LABELS[kind]
        p = self.para(); space(p, 0 if self.cell.paragraphs[0]._p is p._p else 6, 3); shade(p, fill)
        if title:
            run(p, title + ' — ', bold=True, color=ink)
        run(p, text, bold=True, color=ink)
        if left:
            run(p, ' — ' + left, color=ink)

    def head(self, text):
        p = self.para(); space(p, 3, 1); run(p, text, bold=True)

    def items(self, *lines):
        for line in lines:
            p = self.para(); space(p, 0, 1); bullet(p); run(p, line)

    def note(self, text):
        p = self.para(); space(p, 2, 1); run(p, text, size=8.5, color='777777', italic=True)


# --- widen the Status column so the notes can be read (copy only) ---
W1, W2 = 5000, 4360
grid = t._tbl.tblGrid.findall(qn('w:gridCol'))
grid[0].set(qn('w:w'), str(W1)); grid[1].set(qn('w:w'), str(W2))
for row in t.rows:
    for i, cell in enumerate(row.cells):
        tcPr = cell._tc.get_or_add_tcPr()
        tcW = tcPr.find(qn('w:tcW'))
        if tcW is None:
            tcW = OxmlElement('w:tcW'); tcPr.insert(0, tcW)
        tcW.set(qn('w:w'), str(W1 if i == 0 else W2)); tcW.set(qn('w:type'), 'dxa')

R = t.rows

# --- Row 1: items 1-8 ---
c = Cell(R[1].cells[1])
c.label('live', '1. Hero')
c.label('live', '2. Revenue outcome')
c.label('live', '3. Red metric explanation')
c.label('live', '4. Colour system')
c.label('built', '5. About your ad budget')
c.label('built', '6. All 10 questions section')
c.label('built', '7. Watch the Workshop button')
c.label('built', '8. Separate workshop page')

# --- Row 2: red metrics ---
c = Cell(R[2].cells[1])
c.label('built')

# --- Rows 3, 4 ---
c = Cell(R[3].cells[1]); c.label('built')
c = Cell(R[4].cells[1]); c.label('built')

# --- Row 5: stop at $1.5M / push to the max ---
c = Cell(R[5].cells[1])
c.label('built')

# --- Row 6: GolfBays ---
c = Cell(R[6].cells[1]); c.label('built')

# --- Row 7: revenue per subscriber ---
c = Cell(R[7].cells[1])
c.label('built')

# --- Rows 8-11 ---
c = Cell(R[8].cells[1]); c.label('built')
c = Cell(R[9].cells[1]); c.label('built')
c = Cell(R[10].cells[1]); c.label('built')
c = Cell(R[11].cells[1])
c.label('partly', None, 'left: the brighter book-a-call colour (designer’s call; one setting changes every booking button)')

# --- status block above the original links ---
anchor = d.paragraphs[0]


def before(fn):
    p = anchor.insert_paragraph_before()
    fn(p)
    return p


anchor.insert_paragraph_before('Status update — 30 Oct 2026', style='Heading 2')
before(lambda p: (space(p, 0, 4), run(p, 'Each row shows its status. Where something still needs an answer, the question is listed under it (same numbers as the questions page, which has pictures). Where they gave exact words, the page now uses them. The original doc is unchanged.', size=10.5)))
for kind, desc in [('live', 'on the live results page'),
                   ('built', 'finished and checked, goes live when Abdul merges it'),
                   ('partly', 'some of it done'),
                   ('todo', 'not built yet'),
                   ('hold', 'skipped for now')]:
    def legend(p, kind=kind, desc=desc):
        space(p, 0, 1); bullet(p)
        text, fill, ink = LABELS[kind]
        r = run(p, text, bold=True, size=10, color=ink)
        shade_run(r, fill)
        run(p, ' — ' + desc, size=10)
    before(legend)
before(lambda p: (space(p, 8, 2), run(p, 'Still to do', bold=True, size=11)))
for head, line in [
        ('Waiting on the designer', 'Row 11: the brighter book-a-call colour. One setting changes every booking button.'),
        ('Launch (Abdul)', 'Merge the section branches into main and push; then click the workshop and booking buttons on the live page once.')]:
    def todo(p, head=head, line=line):
        space(p, 0, 1); bullet(p)
        run(p, head + ': ', bold=True, size=10)
        run(p, line, size=10)
    before(todo)
before(lambda p: (space(p, 6, 1), run(p, 'Older notes from the September copy rounds (not in this QC doc), still waiting on the right words:', bold=True, size=10)))
for line in [
        'Pillar 4 bullet still reads “(brace yourself! lots of math tbd here)”.',
        '“Behind the number” still says “How many subscribers take a buying action (lead conversion)”; the table rows were reworded, this line was not.',
        'The Samar Owais pie image has “20x” written in it, while the text says “from 10% to 70%”.',
        'Lara’s title “Founder, Literally Academy & LA Digital” shows twice in Pillar One, Situation 03 (under the photo and in the quote chip).',
        'Louis: the quiz says “losing 27 sales calls … closing 29 of the next 31”; the results page says “closing 1 in 29 calls to closing 29 out of 31”.']:
    def old(p, line=line):
        space(p, 0, 1); bullet(p)
        run(p, line, size=10)
    before(old)
before(lambda p: (space(p, 6, 1), run(p, 'See every change in one place:', bold=True, size=10.5)))


def l1(p):
    space(p, 0, 1); bullet(p)
    run(p, 'Online preview (needs the Vercel login): ', size=10)
    link(p, 'open the preview', PREVIEW, 10)


def l2(p):
    space(p, 0, 1); bullet(p)
    run(p, 'On Abdul’s computer: ', size=10)
    link(p, LOCAL, LOCAL, 10)
    run(p, ' · capped version: ', size=10)
    link(p, LOCAL_CAPPED, LOCAL_CAPPED, 10)


before(l1)
before(l2)


def l3(p):
    space(p, 0, 1); bullet(p)
    run(p, 'Questions page (every question so far is answered; the settled list is at its end): ', size=10)
    link(p, 'open the questions page', 'http://localhost:8765/Result%20page%20QC%20-%20Open%20questions.html', 10)


before(l3)
before(lambda p: (space(p, 10, 2), run(p, 'Original doc ↓', bold=True, size=10.5, color='777777')))

d.core_properties.title = 'Result page QC changes doc — status 28 Oct 2026'
d.save(OUT)
print('saved', OUT)
