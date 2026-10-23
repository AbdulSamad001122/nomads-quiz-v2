/* Q5D Email case card (after Q5, answer D; same card for PLG and SLG).
   The card's own script from "Q5D Email Case Card.html", ported for the
   quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed,
     including the editor-only dot/bar inputs (.ebox);
   - "part 2 seen" (stops the tile pulse) is kept inside the card instead of
     a window global;
   - lookups run inside the card's shadow root; every window listener and
     timer stops when the screen closes;
   - quiz additions: a Back control at the top; both buttons hug their text
     with the arrow after the last word (user rule); the CTA moves the quiz
     on (the card's "nomads:card-complete"). The "nomads:card-part" event
     had no listener and is dropped. */
import COPY_JSON from './copy.json';
import ASSETS from './assets.js';
import css from './card.css?inline';
import { createScope, ctaLabel, backButton } from '../cardBase.js';

export { css };

export function mount({ host, root, app, data, back, complete }) {
  var S = createScope();

  var COPY = COPY_JSON;
  var A = ASSETS;
    var editing = false, seen2 = false;
  host.style.setProperty("--texture", 'url("'+A.texture.src+'")');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  /* {{text}} = green (after) number, [[text]] = red (before) number */
  function br(s){return String(s).replace(/\n/g,"<br>");}
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>').replace(/\*\*(.+?)\*\*/g,'<em>$1</em>'));}
  function E(k, rch){ var v = COPY[k]; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  var QPATH = "M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z";
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var part = 0;
  function render(){
    var d = COPY.dots, b = COPY.bars;
    app.innerHTML =
      '<main class="stage" aria-label="Case studies: email"><div class="col">'+
        backButton()+
        '<div class="said"><div class="top">'+QM+'<span class="lbl">'+E("echo_label")+'</span></div><span class="txt">'+E("echo")+QE+'</span></div>'+
        '<p class="intro">'+E("intro",1)+'</p>'+
        '<nav class="tiles" aria-label="Three things that decide email revenue">'+
          tile(0,1,"t1")+TARR+tile(1,2,"t2")+TARR+tile(1,3,"t3")+
        '</nav>'+
        /* PART 1 */
        '<section class="part" data-part="0" aria-label="Part 1 of 2">'+
          '<h1>'+E("p1_h1",1)+'</h1>'+
          '<p class="context">'+E("p1_context")+'</p>'+
          '<div class="compare">'+
            '<div class="side before"><span class="tag">'+E("before_label")+'</span><div class="what">'+E("before_what")+'</div><div class="body">'+
              '<div class="stat">'+E("before_stat")+'<small>'+E("before_sub")+'</small></div>'+
              '<canvas class="grid" id="g-before" role="img" aria-label="'+d.before_total+' dots, '+d.before_lit+' lit"></canvas>'+
            '</div></div>'+
            '<span class="then" aria-hidden="true">'+ARROW+'</span>'+
            '<div class="side after"><span class="tag">'+E("after_label")+'</span><div class="what">'+E("after_what")+'</div><div class="body">'+
              '<div class="stat">'+E("after_stat")+'<small>'+E("after_sub")+'</small></div>'+
              '<canvas class="grid" id="g-after" role="img" aria-label="'+d.after_total+' dots, '+d.after_lit+' lit"></canvas>'+
            '</div></div>'+
          '</div>'+
          '<div class="cbox">'+'<div class="result">'+
            '<div>'+E("p1_r0")+'<small>'+E("p1_r0s")+'</small></div>'+
            '<div>'+E("p1_r1")+'<small>'+E("p1_r1s")+'</small></div></div>'+
          '<p class="why"><b>'+E("why_label")+'</b>'+E("why")+'</p>'+'</div>'+
          '<div class="go"><button class="cta next" type="button" data-act="next">'+ctaLabel(COPY.next1)+'</button></div>'+
        '</section>'+
        /* PART 2 */
        '<section class="part" data-part="1" aria-label="Part 2 of 2" hidden>'+
          '<h1>'+E("p2_h1",1)+'</h1>'+
          '<div class="ctx-row">'+
            '<div class="who"><img src="'+A.lara.src+'" alt="Lara Acosta"><div class="who-t"><span class="who-n">'+E("lara_name")+'</span><span class="who-b">'+E("lara_badge")+'</span><span class="who-r">'+E("lara_role")+'</span></div></div>'+
            '<p class="context">'+E("p2_context")+'</p></div>'+
          '<div class="bars">'+
            barRow("l1","lo",b.l1,true)+barRow("l2","mid",b.l2,false)+barRow("l3","hi",b.l3,true)+
            '<div class="bar-cap">'+E("bars_cap")+'</div></div>'+
          '<div class="cbox">'+'<div class="built"><div class="sec-h"><img src="'+A.compass.src+'" alt="">'+E("built_h")+'</div><ol class="steps">'+
            '<li><span class="n">1</span>'+E("built_1")+'</li><li><span class="n">2</span>'+E("built_2")+'</li><li><span class="n">3</span>'+E("built_3")+'</li></ol></div>'+
          '<div class="result">'+
            '<div>'+E("p2_r0")+'<small>'+E("p2_r0s")+'</small></div>'+
            '<div>'+E("p2_r1")+'<small>'+E("p2_r1s")+'</small></div></div>'+
          '</div>'+'<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
            '<div class="upnext">'+E("up_next")+'</div></div>'+
        '</section>'+
        '<div class="quad"><p class="quad-h">'+E("quad")+'</p><div class="qmap"><ul>'+
          '<li>'+E("q1")+'</li><li>'+E("q2")+'</li><li>'+E("q3")+'</li><li class="on">'+E("q4")+'</li></ul>'+
          '<span class="rose" aria-hidden="true"><img src="'+A.compass.src+'" alt=""></span></div></div>'+
      '</div></main>';
    show(part, null);
    bind();
  }
  var TARR = '<span class="tarr" aria-hidden="true"><svg viewBox="0 0 24 22"><path d="M2 12c6-3 12-3 18-.5"/><path d="M15 6.5l5.5 5-6 4"/></svg></span>';
  var QM = '<svg class="qm" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  var QE = '<svg class="qe" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  function tile(p, n, k){
    return '<button class="tile" type="button" data-n="'+n+'" data-go="'+p+'"><span class="n">'+n+'</span><b>'+E(k)+'</b><span class="s">'+E(k+"s")+'</span></button>';
  }
  function barRow(k, cls, v, sub){
    return '<div><div class="bar-top"><span class="bar-l">'+E(k)+'</span><span class="bar-v '+cls+'">'+E(k+"v")+(sub?'<small>'+E(k+"s")+'</small>':'')+'</span></div>'+
      '<div class="bar"><i class="'+cls+'" data-v="'+v+'"></i></div></div>';
  }

  /* ---------- parts ---------- */
  function stage(){ return $(".stage"); }
  function show(p, dir){
    part = p;
    if (p === 1) seen2 = true;
    S.timeout(function(){ var tl = app.querySelector(".tiles"); if (tl) tl.classList.toggle("seen", seen2); }, 0);
    $$(".part").forEach(function(s){
      var on = +s.getAttribute("data-part") === p;
      s.hidden = !on; s.classList.remove("in-fwd","in-back");
      if (on && dir){ void s.offsetWidth; s.classList.add(dir === "fwd" ? "in-fwd" : "in-back"); }
    });
    $$(".tile").forEach(function(t){ var on = +t.getAttribute("data-go") === p; t.classList.toggle("on", on); t.setAttribute("aria-current", on ? "step" : "false"); });
    if (p === 0){ placeThen(); drawAll(); } else growBars();
    markOneLine();
  }
  function go(p, dir){
    if (p === part) return;
    show(p, dir);
    var st = stage(), tl = $(".tiles"), pt = $('.part[data-part="'+p+'"]');
    if (st && pt) st.scrollTop = Math.max(0, pt.offsetTop - (tl ? tl.offsetHeight : 0) - 14);
    acc = 0; bottomSince = 0;
  }
  function growBars(){
    var max = 0; $$(".bar i").forEach(function(i){ max = Math.max(max, +i.getAttribute("data-v") || 0); });
    $$(".bar i").forEach(function(i){ i.style.width = "0"; });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      $$(".bar i").forEach(function(i){ i.style.width = (max ? (+i.getAttribute("data-v") / max * 100) : 0) + "%"; });
    }); });
  }

  /* keep scrolling past the end of part 1 → part 2 (no prompt shown) */
  var acc = 0, accT = null, bottomSince = 0, ty0 = 0, tx0 = 0, tBottom = false;
  function atBottom(st){ return st.scrollTop + st.clientHeight >= st.scrollHeight - 4; }
  function wireGestures(){
    var st = stage(); if (!st) return;
    st.addEventListener("scroll", function(){
      if (atBottom(st)){ if (!bottomSince) bottomSince = Date.now(); } else { bottomSince = 0; acc = 0; }
    }, {passive:true});
    st.addEventListener("wheel", function(e){
      if (editing || part !== 0) return;
      if (e.deltaY <= 0){ acc = 0; return; }
      if (!atBottom(st)){ return; }
      if (!bottomSince){ bottomSince = Date.now(); return; }
      if (Date.now() - bottomSince < 450) return;   /* ignore the momentum that carried them to the bottom */
      acc += e.deltaY; clearTimeout(accT); accT = S.timeout(function(){ acc = 0; }, 900);
      if (acc > 240) go(1, "fwd");
    }, {passive:true});
    st.addEventListener("touchstart", function(e){
      var t = e.touches[0]; ty0 = t.clientY; tx0 = t.clientX; tBottom = atBottom(st);
    }, {passive:true});
    st.addEventListener("touchmove", function(e){
      if (editing || part !== 0 || !tBottom) return;
      var t = e.touches[0], dy = ty0 - t.clientY, dx = Math.abs(t.clientX - tx0);
      if (dy > 110 && dy > dx*1.5 && atBottom(st)){ tBottom = false; go(1, "fwd"); }
    }, {passive:true});
    st.addEventListener("touchend", function(e){
      if (editing) return;
      var t = e.changedTouches[0], dx = t.clientX - tx0, dy = t.clientY - ty0;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.5){
        if (dx < 0 && part === 0) go(1, "fwd");
        else if (dx > 0 && part === 1) go(0, "back");
      }
    }, {passive:true});
  }

  /* centre the arrow badge on the dot grids (600px and up) */
  var WIDE = window.matchMedia("(min-width: 600px)");
  function placeThen(){
    var t = $(".then"), b = $("#g-before"), c = $(".compare"); if (!t || !b || !c || !b.offsetParent) return;
    if (!WIDE.matches){ t.style.top = ""; return; }
    var r = b.getBoundingClientRect(), cr = c.getBoundingClientRect();
    t.style.top = (r.top - cr.top + r.height/2 - t.offsetHeight/2) + "px";
  }

  /* quadrant labels that fit on one line sit centered in their tile */
  function markOneLine(){
    $$(".qmap li").forEach(function(li){
      li.classList.remove("one");
      var sp = li.querySelector("[data-k]"); if (!sp || !li.offsetParent) return;
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
    var rows = Math.ceil(total/cols), cell = size/Math.max(cols, rows), r = Math.max(cell*0.32, 0.55);
    if (cell*dpr < 5){ return drawDense(x, dpr, size, cols, rows, total, lit, color, tok("--dense", c)); }
    var off = (size - cell*cols)/2, litSet = {};
    if (lit === 1) litSet[Math.floor(rows/2)*cols + Math.floor(cols/2)] = true;
    else { var span = Math.max(1, Math.floor(total/lit)); for (var k=0;k<lit;k++) litSet[Math.min(total-1, k*span + ((k*3) % span))] = true; }
    var litR = lit === 1 ? Math.max(r*2.4, 3.6) : Math.min(Math.max(r*2.4, 3.2), cell*0.46);
    for (var i=0;i<total;i++){
      var cx = off + (i%cols+0.5)*cell, cy = (Math.floor(i/cols)+0.5)*cell;
      x.beginPath(); x.arc(cx, cy, litSet[i] ? litR : r, 0, Math.PI*2);
      x.fillStyle = litSet[i] ? color : tok("--dot", c); x.fill();
    }
  }
  /* very dense grids (e.g. 10,000 dots): snap each dot to whole screen pixels, or they blur into a grey block */
  function drawDense(x, dpr, size, cols, rows, total, lit, color, dense){
    x.setTransform(1,0,0,1,0,0);
    var dev = Math.round(size*dpr), step = Math.max(2, Math.floor(dev/Math.max(cols, rows)));
    var dot = Math.max(1, Math.floor(step/2)), off = Math.floor((dev - step*cols)/2);
    x.fillStyle = dense || "rgba(21,38,56,.38)";
    for (var i=0;i<total;i++) x.fillRect(off + (i%cols)*step, Math.floor(i/cols)*step, dot, dot);
    var litIdx = [];
    if (lit === 1) litIdx.push(Math.floor(rows/2)*cols + Math.floor(cols/2));
    else { var span = Math.max(1, Math.floor(total/lit)); for (var k=0;k<lit;k++) litIdx.push(Math.min(total-1, k*span + ((k*3) % span))); }
    x.fillStyle = color;
    litIdx.forEach(function(i){
      x.beginPath(); x.arc(off + (i%cols)*step + dot/2, Math.floor(i/cols)*step + dot/2, 2.4*dpr, 0, Math.PI*2); x.fill();
    });
  }
  function drawAll(dd){
    var d = dd || COPY.dots;
    var gb = root.getElementById("g-before"), ga = root.getElementById("g-after");
    draw("g-before", d.before_cols, d.before_total, d.before_lit, tok("--red", gb));
    draw("g-after", d.after_cols, d.after_total, d.after_lit, tok("--green", ga));
  }

  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = S.timeout(function(){ if (part === 0){ drawAll(); placeThen(); } markOneLine(); }, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (!S.alive) return; placeThen(); drawAll(); });

  function bind(){
    $('[data-act="nc-back"]').addEventListener("click", function(){ back(); });
    $('[data-act="next"]').addEventListener("click", function(){ if (!editing) go(1, "fwd"); });
    $$(".tile").forEach(function(t){ t.addEventListener("click", function(e){
      if (editing && e.target.closest("[data-k]")) return;
      var p = +t.getAttribute("data-go"); go(p, p > part ? "fwd" : "back");
    }); });
    $('[data-act="cta"]').addEventListener("click", function(){
      if (editing) return;
      complete();
    });
    wireGestures();
  }

  /* [copy-editing code removed] */

  render();

  return function destroy(){
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
