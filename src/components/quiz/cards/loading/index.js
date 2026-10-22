/* Loading card (after the Q11 One Table card, before the transition slide).
   The card's own script from "Loading Screen (after Q11, before transition
   screen).html", ported for the quiz:
   - preview chrome (grey bar with Replay, stand-in header) and copy editing
     removed; no Back (it moves on by itself, as before);
   - the track (slg / plg) comes from the quiz (data.track) instead of the
     window.NOMADS_TRACK global;
   - fix: with reduced motion the file showed the finished state but never
     moved on (no button to press); it now moves on after the same 1.5s hold;
   - lookups run inside the card's shadow root; every window listener and
     timer stops when the screen closes;
   - at ~3.5s it moves the quiz on (the card's "nomads:card-complete"). */
import COPY_JSON from './copy.json';
import ASSETS from './assets.js';
import css from './card.css?inline';
import { createScope, ctaLabel, backButton } from '../cardBase.js';

export { css };

export function mount({ host, root, app, data, back, complete }) {
  var S = createScope();

  var CARD = "q11-loading";
  var COPY = COPY_JSON;
  var A = ASSETS;
    var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var editing = false;
  host.style.setProperty("--texture", 'url("'+A.texture.src+'")');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  /* {{text}} = green, [[text]] = red, **text** = accent / bold. A line break in the copy shows as a line break. */
  function br(s){return String(s).replace(/\n/g,"<br>");}
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>').replace(/\*\*(.+?)\*\*/g,'<em>$1</em>'));}
  function E(k, rch){ var v = COPY[k]; if (v === undefined) return ""; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  function stage(){ return $(".stage"); }

  /* which track the quiz-taker is on: from the quiz (data.track = "slg" or "plg") */
  var TRACK = (data && data.track === "plg") ? "plg" : "slg";
  /* "h1" -> "h1_slg" / "h1_plg" when the card has track versions of that line */
  function V(k){ return (COPY[k+"_"+TRACK] !== undefined) ? k+"_"+TRACK : k; }

  var STAR = 'M0,-11 L3,-3.7 L10.6,-3.4 L4.8,1.6 L6.7,9.1 L0,4.9 L-6.7,9.1 L-4.8,1.6 L-10.6,-3.4 L-3,-3.7 Z';
  function star(sz, col){ return '<svg viewBox="-12 -12 24 24" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path class="star-us" d="'+STAR+'" fill="'+(col||"var(--p-green)")+'"/></svg>'; }
  var NEXT = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var A_PH = '<svg class="bob" viewBox="0 0 76 58" aria-hidden="true"><path d="M4 8C32 2 56 16 62 48"/><path d="M51 42l11 8 5-12"/></svg>';
  var A_DN = '<svg class="bob a-dn" viewBox="0 0 40 60" aria-hidden="true"><path d="M30 4C34 22 30 40 16 54"/><path d="M14 41l1 14 13-3"/></svg>';
  var A_SIDE = '<svg class="bob a-side" viewBox="0 0 90 60" aria-hidden="true"><path d="M60 4C70 30 50 50 10 52"/><path d="M22 42l-12 10 13 7"/></svg>';
  var A_WIDE = '<svg class="bob" viewBox="0 0 120 60" aria-hidden="true"><path d="M6 8C30 46 70 54 112 40"/><path d="M98 30l14 10-12 12"/></svg>';

  function lead(){ return '<p class="lead">'+E("lead")+'</p>'; }
  function lensMap(textK, on){
    return '<div class="quad"><p class="quad-h">'+E(V(textK),1)+'</p><div class="qmap"><ul>'+
      [1,2,3,4].map(function(i){ return '<li class="'+(on.indexOf(i)>=0?'on':'')+'">'+E("q"+i)+'</li>'; }).join("")+
      '</ul><span class="rose" aria-hidden="true"><img src="'+A.compass.src+'" alt=""></span></div></div>';
  }
  function go_(){ return '<div class="go"><button class="cta" type="button" data-act="cta">'+E(V("cta"))+'<span aria-hidden="true">→</span></button><div class="upnext">'+E("up_next")+'</div></div>'; }

  /* ---------- fanned stack: one card per item, tap to send the front card to the back ---------- */
  function fan(headK, keys){
    var cards = keys.map(function(k, i){
      return '<div class="lv" data-i="'+i+'" role="button" tabindex="0">'+
        '<div class="hd"><span class="num">'+(i+1)+'</span><span class="pips" aria-hidden="true">'+keys.map(function(_,j){ return '<i class="'+(j===i?'on':'')+'"></i>'; }).join("")+'</span></div>'+
        '<div class="bd">'+E(V(k),1)+'</div>'+
        '<span class="nx" aria-hidden="true">'+NEXT+'</span></div>';
    }).join("");
    return '<div class="fanbox"><p class="how-h">'+E(V(headK))+'</p>'+
      '<div class="cs-area" id="csa"><div class="callout" id="nudge"><span class="ct">'+E("fan_tap")+'</span>'+A_DN+A_SIDE+'</div>'+
      '<div class="stack" id="stack"><div class="fan" id="fan">'+cards+'</div></div></div></div>';
  }
  var order = [0,1,2], seen = {0:true};
  function placeFan(){
    $$(".lv").forEach(function(c){
      var i = +c.getAttribute("data-i"), p = order.indexOf(i);
      c.classList.remove("p0","p1","p2"); c.classList.add("p"+p);
      c.setAttribute("aria-label", "Card "+(i+1)+" of "+order.length+(p===0 ? ", tap for the next one" : ", tap to bring it to the front"));
    });
    var all = Object.keys(seen).length >= order.length, st = $("#stack"), csa = $("#csa");
    if (st) st.classList.toggle("seen", all);
    if (csa) csa.classList.toggle("seen", all);
  }
  function bringFront(i, animate){
    var old = $('.lv.p0');
    if (animate && old && !RM){ old.classList.remove("leaving"); void old.offsetWidth; old.classList.add("leaving"); S.timeout(function(){ old.classList.remove("leaving"); }, 600); }
    while (order[0] !== i) order.push(order.shift());
    seen[i] = true; placeFan();
  }
  function nextCard(){ bringFront(order[1], true); }
  function prevCard(){ bringFront(order[order.length-1], true); }
  function wireFan(){
    var area = $("#csa"), stack = $("#stack"), fn = $("#fan"); if (!area || !stack || !fn) return;
    placeFan();
    area.addEventListener("pointermove", function(e){
      if (editing || RM || e.pointerType !== "mouse") return;
      var r = stack.getBoundingClientRect(), x = (e.clientX - (r.left + r.width/2)) / (r.width/2), y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
      x = Math.max(-1.4, Math.min(1.4, x)); y = Math.max(-1.4, Math.min(1.4, y));
      fn.style.setProperty("--ry", (x*10).toFixed(2)+"deg"); fn.style.setProperty("--rx", (-y*7).toFixed(2)+"deg");
    });
    area.addEventListener("pointerleave", function(){ fn.style.setProperty("--ry","0deg"); fn.style.setProperty("--rx","0deg"); });
    var sx = null, sy = null;
    stack.addEventListener("touchstart", function(e){ var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, {passive:true});
    stack.addEventListener("touchend", function(e){
      if (editing || sx === null) return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)*1.3){ stack._swiped = Date.now(); if (dx < 0) nextCard(); else prevCard(); }
    }, {passive:true});
    $$(".lv").forEach(function(c){
      c.addEventListener("click", function(){
        if (editing || (stack._swiped && Date.now() - stack._swiped < 400)) return;
        if (c.classList.contains("p0")) nextCard(); else bringFront(+c.getAttribute("data-i"), true);
      });
      c.addEventListener("keydown", function(e){
        if (editing) return;
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); c.click(); }
        else if (e.key === "ArrowRight"){ e.preventDefault(); nextCard(); }
        else if (e.key === "ArrowLeft"){ e.preventDefault(); prevCard(); }
      });
    });
  }

  /* play an element's animation once it is on screen */
  function whenSeen(sel, fn){
    var el = $(sel); if (!el) return;
    if (editing || RM || !("IntersectionObserver" in window)){ fn(el); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && e.intersectionRatio > .45){ io.disconnect(); fn(el); } }); }, {root: stage(), threshold:[0,.45,1]});
    io.observe(el);
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

  var timers = [];
  function compass(){
    return '<svg class="compass" viewBox="0 0 150 150" aria-hidden="true">'+
      '<circle cx="75" cy="75" r="66" fill="rgba(247,239,234,.06)" stroke="rgba(247,239,234,.22)" stroke-width="2"/>'+
      '<circle class="ring-prog" id="ring" cx="75" cy="75" r="66" fill="none" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round" transform="rotate(-90 75 75)"/>'+
      '<circle cx="75" cy="75" r="52" fill="none" stroke="rgba(247,239,234,.2)" stroke-dasharray="2 5"/>'+
      '<g id="quads"><text class="q" x="75" y="26" text-anchor="middle">RPV</text><text class="q" x="126" y="78" text-anchor="middle">POV</text>'+
      '<text class="q" x="75" y="132" text-anchor="middle">SPEED</text><text class="q" x="24" y="78" text-anchor="middle">RPS</text></g>'+
      '<g class="needle" id="needle"><path d="M75,34 L82,75 L75,80 L68,75 Z" fill="var(--clay)"/><path d="M75,116 L82,75 L75,70 L68,75 Z" fill="#8A4F70"/></g>'+
      '<circle cx="75" cy="75" r="5" fill="var(--ground)" stroke="var(--clay)" stroke-width="2"/></svg>';
  }
  function render(){
    app.innerHTML =
      '<main class="stage fit" aria-label="Calculating your Revenue Per Visitor" aria-live="polite"><div class="col load">'+
        '<div class="ltop"><div class="lhead">'+compass()+
        '<h1>'+E("h1",1)+'</h1></div>'+
        '<div class="paper teaser" id="teaser">'+
          '<span class="t-h">'+E("t_h")+'</span>'+
          '<span class="t-v" aria-hidden="true">$00.00</span>'+
          '<p class="t-s">'+E("t_s",1)+'</p>'+
          '<div class="five"><span class="f-h">'+E("f_h")+'</span><ol class="f-list">'+
            '<li><span class="nm">'+E("f1")+'</span><span class="tg">'+E("f1_v")+'</span></li>'+
            '<li><span class="b nm" aria-hidden="true">Xxxx xxxxxxxxxx xxxx</span><span class="b tg" aria-hidden="true">00%</span></li>'+
            '<li><span class="nm">'+E("f3")+'</span><span class="tg">'+E("f3_v")+'</span></li>'+
            '<li><span class="b nm" aria-hidden="true">Xxxxxxx xxxx xxxxx</span><span class="b tg" aria-hidden="true">$0,000</span></li>'+
            '<li><span class="b nm" aria-hidden="true">Xxxxxxx xxx xxxxxxxxxx</span><span class="b tg" aria-hidden="true">$00</span></li>'+
          '</ol></div></div></div>'+
      '</div></main>';
    bind();
    fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (S.alive) fit(); });
    play();
  }
  /* one screen, no scrolling: if the content is taller than the quiz frame, shrink it to fit */
  function fit(){
    var st = stage(), col = $(".col"); if (!st || !col) return;
    col.style.zoom = 1;
    if (editing) return;
    var need = col.scrollHeight, avail = st.clientHeight;
    if (need > avail) col.style.zoom = Math.max(.55, avail / need).toFixed(3);
  }
  var ft = null;
  S.on(window, "resize", function(){ clearTimeout(ft); ft = S.timeout(fit, 100); });
  /* compass searches for ~2s, the ring fills and the teaser sharpens; it holds ~1.5s, then the screen moves on by itself */
  function play(){
    timers.forEach(clearTimeout); timers = [];
    var ring = $("#ring"), needle = $("#needle"), quads = [].slice.call($$("#quads .q")), teaser = $("#teaser"), C = 2*Math.PI*66;
    ring.style.strokeDasharray = C;
    ring.style.transition = "none"; ring.style.strokeDashoffset = C; ring.getBoundingClientRect(); ring.style.transition = "";
    quads.forEach(function(q){ q.classList.remove("on"); });
    teaser.classList.remove("ready"); $$(".after").forEach(function(a){ a.classList.remove("show"); });
    needle.style.transition = "none"; needle.style.transform = "rotate(0deg)"; needle.getBoundingClientRect(); needle.style.transition = "";
    var T = 2000;
    if (RM || editing){ ring.style.strokeDashoffset = 0; quads.forEach(function(q){ q.classList.add("on"); }); teaser.classList.add("ready"); $$(".after").forEach(function(a){ a.classList.add("show"); }); if (!editing) timers.push(S.timeout(function(){ complete(); }, 1500)); return; }
    requestAnimationFrame(function(){ ring.style.strokeDashoffset = 0; });
    [70,-110,200,20,300].forEach(function(a,i){
      timers.push(S.timeout(function(){ needle.style.transform = "rotate("+a+"deg)"; if (quads[i%4]) quads[i%4].classList.add("on"); }, T/6*(i+1)));
    });
    timers.push(S.timeout(function(){ needle.style.transform = "rotate(360deg)"; teaser.classList.add("ready"); }, T));
    /* hold on the finished state, then hand over to the next screen */
    timers.push(S.timeout(function(){ complete(); }, T+1500));
  }

  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = S.timeout(function(){ markOneLine(); }, 120); });

  function bind(){
    var ctaB = $('[data-act="cta"]'); if (ctaB) ctaB.addEventListener("click", function(){
      if (editing) return;
      complete();
    });
    wireFan();
    markOneLine();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (S.alive) markOneLine(); });
  }

  /* [copy-editing code removed] */

  render();

  return function destroy(){
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
