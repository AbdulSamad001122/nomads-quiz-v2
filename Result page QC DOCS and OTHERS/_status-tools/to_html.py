import sys, re, html
sys.path.insert(0, sys.argv[3])
import mammoth

SRC, OUT = sys.argv[1], sys.argv[2]
with open(SRC, 'rb') as f:
    res = mammoth.convert_to_html(f)
body = res.value

# colour the status labels the way the .docx shades them
LABELS = [
    ('✔ BUILT – IN PREVIEW (not live yet)', 'built'),
    ('✔ DONE – LIVE', 'live'),
    ('◐ PARTLY DONE', 'partly'),
    ('✘ NOT STARTED', 'todo'),
    ('⏸ ON HOLD (skipped for now)', 'hold'),
]
for text, cls in LABELS:
    esc = html.escape(text, quote=False)
    body = body.replace(esc, f'<span class="lab lab--{cls}">{esc}</span>')
# a label paragraph (item title + label) gets the full-width band
body = re.sub(r'<p><strong>([^<]*?)</strong><strong><span class="lab lab--(\w+)">',
              r'<p class="band band--\2"><strong>\1</strong><strong><span class="lab lab--\2">', body)
body = re.sub(r'<p><strong><span class="lab lab--(\w+)">', r'<p class="band band--\1"><strong><span class="lab lab--\1">', body)
body = re.sub(r'<p><strong>([^<]*?)<span class="lab lab--(\w+)">',
              r'<p class="band band--\2"><strong>\1<span class="lab lab--\2">', body)
# open links in a new tab
body = body.replace('<a href="http', '<a target="_blank" rel="noopener" href="http')

page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Result page QC changes doc — status 27 Oct 2026</title>
<style>
  body {{ font-family: Arial, Helvetica, sans-serif; color: #1d1d1f; background: #f4f4f6; margin: 0; }}
  .page {{ max-width: 980px; margin: 24px auto; background: #fff; padding: 40px 48px; box-shadow: 0 1px 4px rgba(0,0,0,.12); }}
  h2 {{ font-size: 24px; margin: 0 0 8px; }}
  h3 {{ font-size: 15px; margin: 14px 0 6px; }}
  p {{ margin: 4px 0; line-height: 1.45; font-size: 14px; }}
  ul, ol {{ margin: 2px 0 6px 20px; padding-left: 14px; font-size: 14px; line-height: 1.45; }}
  li {{ margin: 1px 0; }}
  a {{ color: #1155cc; word-break: break-all; }}
  table {{ border-collapse: collapse; width: 100%; margin-top: 12px; table-layout: fixed; }}
  td, th {{ border: 1px solid #b7b7b7; vertical-align: top; padding: 8px 10px; text-align: left; font-weight: normal; }}
  tr > :first-child {{ width: 53%; }}
  tr:first-child > * {{ background: #f1f1f1; font-weight: bold; }}
  td img, th img {{ max-width: 100%; height: auto; }}
  tr > :last-child p, tr > :last-child li {{ font-size: 13px; }}
  .band {{ padding: 4px 8px; border-radius: 4px; margin: 10px 0 4px; }}
  .band--live {{ background: #d9f2e3; color: #1e6b3f; }}
  .band--built {{ background: #e4eefb; color: #1f4f8a; }}
  .band--partly {{ background: #fff2cc; color: #7a5a00; }}
  .band--todo {{ background: #f1f1f1; color: #555; }}
  .band--hold {{ background: #f6e3ee; color: #7a2257; }}
  .lab {{ white-space: nowrap; }}
  li .lab {{ padding: 1px 6px; border-radius: 4px; }}
  li .lab--live {{ background: #d9f2e3; color: #1e6b3f; }}
  li .lab--built {{ background: #e4eefb; color: #1f4f8a; }}
  li .lab--partly {{ background: #fff2cc; color: #7a5a00; }}
  li .lab--todo {{ background: #f1f1f1; color: #555; }}
  li .lab--hold {{ background: #f6e3ee; color: #7a2257; }}
  td, th {{ overflow-wrap: anywhere; }}
  @media (max-width: 700px) {{
    .page {{ padding: 20px 12px; margin: 0; }}
    td, th {{ padding: 6px; }}
    .lab {{ white-space: normal; }}
    ul, ol {{ margin-left: 8px; padding-left: 12px; }}
  }}
</style></head>
<body><div class="page">
{body}
</div></body></html>'''
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(page)
print('html written', OUT, 'mammoth messages:', len(res.messages))
for m in res.messages[:8]:
    print(' -', m)
