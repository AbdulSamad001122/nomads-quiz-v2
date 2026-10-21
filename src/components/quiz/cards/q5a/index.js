/* Q5A GolfBays card (after Q5, answer A; same card for PLG and SLG).
   The card's own script from "Q5A GolfBays Card.html", ported for the quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed,
     including the editor-only dot inputs (.ebox);
   - lookups run inside the card's shadow root; every window listener,
     timer and animation stops when the screen closes;
   - quiz additions: a Back control at the top, and the CTA label/arrow
     (user rule: the button hugs its text, the arrow follows the last word);
     the CTA moves the quiz on (the card's "nomads:card-complete"). */
import COPY from './copy.json';
import A from './assets.js';
import css from './card.css?inline';
import { createScope, ctaLabel, backButton } from '../cardBase.js';

export { css };

export function mount({ host, root, app, back, complete }) {
  var S = createScope();
  host.style.setProperty('--texture', 'url("' + A.texture.src + '")');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  /* {{text}} = green (after) number, [[text]] = red (before) number */
  function br(s){return String(s).replace(/\n/g,"<br>");}
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>'));}
  function E(k, rch){ var v = COPY[k]; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function render(){
    var d = COPY.dots;
    app.innerHTML =
      '<main class="stage" aria-label="Case study: GolfBays"><div class="col">'+
        backButton()+
        '<div class="said"><div class="top"><svg class="qm" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z"/></svg><span class="lbl">'+E("echo_label")+'</span></div><span class="txt">'+E("echo")+'<svg class="qe" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z"/></svg></span></div>'+
        '<h1>'+E("h1",1)+'</h1>'+
        '<p class="context">'+E("context")+'</p>'+
        '<div class="compare">'+
          '<div class="side before"><span class="tag">'+E("before_label")+'</span><div class="what">'+E("before_what")+'</div><div class="body">'+
            '<div class="meter"><div class="stat">'+E("before_stat")+'<small>'+E("before_sub")+'</small></div>'+
            '<canvas class="grid" id="g-before" role="img" aria-label="'+d.before_total+' dots, '+d.before_lit+' lit"></canvas></div>'+
            '<div class="win"><div class="browser"><div class="bar"><i></i><i></i><i></i><span>golfbays.co.uk</span></div>'+
              '<div class="vp"><img class="view" data-dur="11000" data-phone="still" src="'+A.before_site.src+'" alt="GolfBays site before: Shop best sellers and Book a demo"></div></div></div>'+
          '</div></div>'+
          '<span class="then" aria-hidden="true">'+ARROW+'</span>'+
          '<div class="side after"><span class="tag">'+E("after_label")+'</span><div class="what">'+E("after_what")+'</div><div class="body">'+
            '<div class="meter"><div class="stat">'+E("after_stat")+'<small>'+E("after_sub")+'</small></div>'+
            '<canvas class="grid" id="g-after" role="img" aria-label="'+d.after_total+' dots, '+d.after_lit+' lit"></canvas></div>'+
            '<div class="win"><div class="browser"><div class="bar"><i></i><i></i><i></i><span>golfbays.co.uk/quiz</span></div>'+
              '<div class="vp"><img class="view" data-dur="18000" src="'+A.after_landing.src+'" alt="GolfBays quiz landing page"></div></div>'+
            '<img class="pop" src="'+A.after_popup.src+'" alt="GolfBays quiz pop-up: Find your perfect golf setup in 60 seconds"></div>'+
          '</div></div>'+
        '</div>'+
        '<div class="built"><div class="sec-h"><img src="'+A.compass.src+'" alt="">'+E("built_h")+'</div><ol class="steps">'+
          '<li><span class="n">1</span>'+E("built_1")+'</li><li><span class="n">2</span>'+E("built_2")+'</li><li><span class="n">3</span>'+E("built_3")+'</li></ol></div>'+
        '<div class="result">'+
          '<div>'+E("r0")+'<small>'+E("r0s")+'</small></div>'+
          '<div>'+E("r1")+'<small>'+E("r1s")+'</small></div>'+
          '<div>'+E("r2")+'<small>'+E("r2s")+'</small></div></div>'+
        '<p class="why"><b>'+E("why_label")+'</b>'+E("why")+'</p>'+
        '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
          '<div class="upnext">'+E("up_next")+'</div></div>'+
        '<div class="quad"><p class="quad-h">'+E("quad")+'</p><div class="qmap"><ul>'+
          '<li class="on">'+E("q1")+'</li><li>'+E("q2")+'</li><li>'+E("q3")+'</li><li>'+E("q4")+'</li></ul>'+
          '<span class="rose" aria-hidden="true"><img src="'+A.compass.src+'" alt=""></span></div></div>'+
      '</div></main>';
    placeThen();
    drawAll();
    markOneLine();
    bind();
  }

  /* centre the arrow badge on the browser windows */
  var WIDE = window.matchMedia("(min-width: 600px)");
  function placeThen(){
    var t = $(".then"), b = $(".side.before .win"), c = $(".compare"); if (!t || !b || !c) return;
    if (!WIDE.matches){ t.style.top = ""; return; }
    var r = b.getBoundingClientRect(), cr = c.getBoundingClientRect();
    t.style.top = (r.top - cr.top + r.height/2 - t.offsetHeight/2) + "px";
  }

  /* browser windows: each page scrolls top to bottom and back. On 600px and up, a wide screenshot
     is zoomed in slightly until it has room to scroll. On phones the Before page stays still and whole. */
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
  function runViews(){
    if (!S.alive) return;
    $$(".browser .view").forEach(function(im){
      if (im._anim){ im._anim.cancel(); im._anim = null; }
      var vp = im.parentNode, W = vp.clientWidth, H = vp.clientHeight;
      if (!im.naturalWidth || !W) return;
      var r = im.naturalHeight / im.naturalWidth;
      /* phones: the Before page shows whole and still (zooming in would cut off its text) */
      if (im.getAttribute("data-phone") === "still" && !WIDE.matches){
        vp.style.aspectRatio = im.naturalWidth + " / " + im.naturalHeight; im.style.width = "100%"; return;
      }
      vp.style.aspectRatio = "";
      H = vp.clientHeight;
      var w = Math.max(W, H*1.5/r);
      im.style.width = w + "px";
      var travel = w*r - H; if (RM.matches || travel < 4) return;
      var a = "translate(-50%,0)", b = "translate(-50%," + (-travel) + "px)";
      im._anim = im.animate([{transform:a,offset:0},{transform:a,offset:.08},{transform:b,offset:.92},{transform:b,offset:1}],
        {duration:+im.getAttribute("data-dur") || 14000, delay:1200, iterations:Infinity, direction:"alternate", easing:"ease-in-out"});
    });
  }

  /* quadrant labels that fit on one line sit centered in their tile */
  function markOneLine(){
    $$(".qmap li").forEach(function(li){
      li.classList.remove("one");
      var sp = li.querySelector("[data-k]"); if (!sp) return;
      var lh = parseFloat(getComputedStyle(li).lineHeight) || 16;
      if (sp.getBoundingClientRect().height < lh*1.5) li.classList.add("one");
    });
  }

  /* ---------- dot grids, drawn to scale ---------- */
  function tok(n, el){ return getComputedStyle(el || host).getPropertyValue(n).trim(); }
  function draw(id, cols, total, lit, color){
    var c = root.getElementById(id); if (!c || !c.clientWidth) return;
    var dpr = window.devicePixelRatio || 1, size = c.clientWidth;
    c.width = size*dpr; c.height = size*dpr;
    var x = c.getContext("2d"); x.scale(dpr,dpr);
    var rows = Math.ceil(total/cols), cell = size/Math.max(cols, rows), r = Math.max(cell*0.32, 0.8);
    var off = (size - cell*cols)/2, litSet = {};
    /* lit dots spread out, never stacked in one column */
    if (lit === 1) litSet[Math.floor(rows/2)*cols + Math.floor(cols/2)] = true;
    else { var span = Math.max(1, Math.floor(total/lit)); for (var k=0;k<lit;k++) litSet[Math.min(total-1, k*span + ((k*3) % span))] = true; }
    var litR = lit === 1 ? Math.max(r*2.4, 3.6) : Math.min(Math.max(r*2.4, 3.2), cell*0.46);
    for (var i=0;i<total;i++){
      var cx = off + (i%cols+0.5)*cell, cy = (Math.floor(i/cols)+0.5)*cell;
      x.beginPath(); x.arc(cx, cy, litSet[i] ? litR : r, 0, Math.PI*2);
      x.fillStyle = litSet[i] ? color : tok("--dot", c); x.fill();
    }
  }
  function drawAll(){
    var d = COPY.dots;
    var gb = root.getElementById("g-before"), ga = root.getElementById("g-after");
    draw("g-before", d.before_cols, d.before_total, d.before_lit, tok("--red", gb));
    draw("g-after", d.after_cols, d.after_total, d.after_lit, tok("--green", ga));
  }
  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = setTimeout(function(){ if (!S.alive) return; drawAll(); placeThen(); markOneLine(); runViews(); }, 120); });
  S.on(window, "load", placeThen);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (!S.alive) return; placeThen(); drawAll(); markOneLine(); });

  function bind(){
    $('[data-act="nc-back"]').addEventListener("click", function(){ back(); });
    $('[data-act="cta"]').addEventListener("click", function(){ complete(); });
    $$(".browser img").forEach(function(im){ im.addEventListener("load", function(){ placeThen(); runViews(); }); if (im.complete) runViews(); });
  }

  render();

  return function destroy(){
    clearTimeout(rt);
    $$(".browser .view").forEach(function(im){ if (im._anim){ im._anim.cancel(); im._anim = null; } });
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
