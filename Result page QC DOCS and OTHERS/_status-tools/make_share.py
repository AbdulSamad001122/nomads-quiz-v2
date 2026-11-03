"""Builds a single self-contained copy of the questions page (pictures embedded),
so it still shows its screenshots when sent as one file (e.g. on Slack)."""
import io, sys, re, os, base64
src, out = sys.argv[1], sys.argv[2]
base = os.path.dirname(src)
s = io.open(src, encoding='utf-8').read()
files = sorted(set(re.findall(r"\['([\w.-]+\.(?:jpg|png))'", s)))
data = {}
for f in files:
    b = open(os.path.join(base, 'question-images', f), 'rb').read()
    mime = 'image/png' if f.endswith('.png') else 'image/jpeg'
    data[f] = f'data:{mime};base64,' + base64.b64encode(b).decode()
js = 'const IMGDATA = ' + repr(data).replace("'", '"') + ';\n'
s = s.replace("const IMG = 'question-images/';", js)
# picture: no link (data links can't open in a new tab); click opens a full-size overlay
s = s.replace('<figure><a href="${IMG}${f}" target="_blank" rel="noopener"><img src="${IMG}${f}" alt="${esc(cap)}" loading="lazy"></a>',
              '<figure><img src="${IMGDATA[f]}" alt="${esc(cap)}" class="zoom">')
s = s.replace('Click a picture to open it full size.', 'Click a picture to see it full size.')
s = s.replace('</body>', """<div id="ov" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:20;cursor:zoom-out;padding:20px;overflow:auto"><img id="ovi" style="display:block;margin:auto;max-width:100%"></div>
<script>
document.addEventListener('click', (e) => { const o = document.getElementById('ov');
  if (e.target.classList && e.target.classList.contains('zoom')) { document.getElementById('ovi').src = e.target.src; o.style.display = 'block'; }
  else if (e.target.id === 'ov' || e.target.id === 'ovi') o.style.display = 'none'; });
</script>
</body>""")
s = s.replace('.pics img {', '.pics img { cursor: zoom-in;', 1)
assert 'IMG}' not in s, 'unreplaced image path'
io.open(out, 'w', encoding='utf-8').write(s)
print(len(files), 'pictures embedded,', round(len(s) / 1e6, 2), 'MB')
