/* Q12D Price constraint card (after Q12: PLG answer D, SLG answer E).
   The card's own script from "Q12 (PLG D, SLG E) Price Constraint.html",
   ported for the quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed;
   - the track (slg / plg) comes from the quiz (data.track) instead of the
     window.NOMADS_TRACK global; the page switcher and the Venn's tap-to-
     highlight wiring stay inside the card instead of window.goPart /
     window.onBind globals;
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
  function go_(){ return '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY[V("cta")])+'</button><div class="upnext">'+E("up_next")+'</div></div>'; }

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
    var io = S.track(new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && e.intersectionRatio > .45){ io.disconnect(); fn(el); } }); }, {root: stage(), threshold:[0,.45,1]}));
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

  var part = 0, seen2 = false;
  function tile(p, n, k){ return '<button class="tile'+(p===part?' on':'')+'" type="button" data-go="'+p+'" data-n="'+n+'"><span class="n">'+n+'</span><b>'+esc(COPY[k])+'</b></button>'; }
  var TARR = '<span class="tarr" aria-hidden="true"><svg viewBox="0 0 24 22"><path d="M2 12c6-3 12-3 18-.5"/><path d="M15 6.5l5.5 5-6 4"/></svg></span>';
  /* Venn: three dark circles, each labelled inside (as on 5C) */
  function vlab(x, y, t){
    var w = String(t).split(" "), lines = w.length > 1 ? [w.slice(0, Math.ceil(w.length/2)).join(" "), w.slice(Math.ceil(w.length/2)).join(" ")] : [t];
    return '<text x="'+x+'" y="'+(y - (lines.length-1)*7)+'" text-anchor="middle" class="vt">'+lines.map(function(l,i){ return '<tspan x="'+x+'" dy="'+(i?14:0)+'">'+esc(l)+'</tspan>'; }).join("")+'</text>';
  }
  function VENN(){ return '<div class="vfig"><svg class="venn" viewBox="0 0 320 300" role="img" aria-label="Three overlapping circles: your customer, the market and your process. Your Contrarian POV sits where all three meet.">'+
    '<defs>'+[['cust','#1E4F7C'],['mkt','#8E3F22'],['proc','#5D1B4E']].map(function(c){ return '<marker id="ah-'+c[0]+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="'+c[1]+'"/></marker>'; }).join('')+'</defs>'+
    '<path d="M58,2 C 58,20 66,34 78,50" fill="none" stroke="#1E4F7C" stroke-width="1.8" marker-end="url(#ah-cust)"/>'+
    '<path d="M262,2 C 262,20 254,34 242,50" fill="none" stroke="#8E3F22" stroke-width="1.8" marker-end="url(#ah-mkt)"/>'+
    '<path d="M160,298 L160,268" fill="none" stroke="#5D1B4E" stroke-width="1.8" marker-end="url(#ah-proc)"/>'+
    '<g class="z" data-z="cust"><circle cx="124" cy="118" r="80" fill="#1E4F7C" fill-opacity=".8"/></g>'+
    '<g class="z" data-z="mkt"><circle cx="196" cy="118" r="80" fill="#8E3F22" fill-opacity=".8"/></g>'+
    '<g class="z" data-z="proc"><circle cx="160" cy="182" r="80" fill="#5D1B4E" fill-opacity=".8"/></g>'+
    '<circle cx="124" cy="118" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<circle cx="196" cy="118" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<circle cx="160" cy="182" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<g class="z" data-z="gap"><circle cx="160" cy="151" r="36" fill="#FFFFFF" stroke="#17703F" stroke-width="2.4"/></g>'+
    vlab(80, 108, COPY.b_cust_t)+vlab(240, 108, COPY.b_mkt_t)+vlab(160, 240, COPY.b_proc_t)+
    '</svg><span class="gap-t">'+E("v_gap_t")+'<br>'+E("v_gap_t2")+'</span></div>'; }
  function render(){
    app.innerHTML =
      '<main class="stage" aria-label="Your number one constraint"><div class="col">'+
        backButton()+
        lead()+
        '<h1><span class="soft">'+E("h1_soft")+'</span> '+E("h1",1)+'</h1>'+
        '<div class="cbox"><div class="fix"><span class="fix-k">'+E("fix_k")+'</span><p class="fix-h">'+E("fix_p",1)+'</p></div></div>'+
        '<nav class="tiles'+(seen2?' seen':'')+'" aria-label="Two pages">'+tile(0,1,"s1_kick")+TARR+tile(1,2,"s2_kick")+'</nav>'+
        /* PAGE 1 */
        '<section class="part" data-part="0" aria-label="Page 1 of 2"'+(part===0?'':' hidden')+'>'+
          '<div class="stephead"><span class="num">1</span>'+E("s1_kick")+'</div>'+
          '<p class="sub2">'+E("s1_h1",1)+'</p>'+
          '<p class="para">'+E("s1_body")+'</p>'+
          '<div class="paper"><div class="mk-row">'+
            '<div class="mk"><span class="mk-h was">'+E("m_was_h")+'</span><div class="mkfig"><svg id="leadgen" viewBox="0 0 200 222" role="img" aria-label="Lead gen: hundreds of overlapping competitors"></svg>'+
              '<span class="lbl" style="left:50%;top:4.5%;color:#4E5A6E">'+E("lbl_leadgen")+'</span></div><small class="was">'+E("m_was_call")+'</small></div>'+
            '<div class="mk-arrow" aria-hidden="true">→</div>'+
            '<div class="mk"><span class="mk-h now">'+E("m_now_h")+'</span><div class="mkfig"><svg id="overlap" viewBox="0 0 200 222" role="img" aria-label="CRO, lifecycle email and positioning overlapping, crowded on their own and nearly empty where all three meet, with us as the star"></svg>'+
              '<span class="lbl" style="left:15%;top:6%;color:var(--p-blue)">'+E("lbl_cro")+'</span>'+
              '<span class="lbl" style="left:86%;top:4%;color:var(--p-brown)">'+E("lbl_email1")+'<br>'+E("lbl_email2")+'</span>'+
              '<span class="lbl" style="left:22%;top:88%;color:var(--p-green)">'+E("lbl_pos")+'</span>'+
              '<span class="lbl" style="left:50%;top:37%;color:#152638">'+E("lbl_us")+'</span></div><small class="now">'+E("m_now_call")+'</small></div>'+
          '</div>'+
          '<div class="win"><b>'+E("win_v")+'</b><span>'+E("win_s")+'</span></div></div>'+
          '<div class="go"><button class="cta next" type="button" data-act="next">'+ctaLabel(COPY.next1)+'</button></div>'+
        '</section>'+
        /* PAGE 2 */
        '<section class="part" data-part="1" aria-label="Page 2 of 2"'+(part===1?'':' hidden')+'>'+
          '<div class="stephead"><span class="num">2</span>'+E("s2_kick")+'</div>'+
          '<p class="sub2">'+E("s2_h1",1)+'</p>'+
          '<p class="para">'+E("s2_body")+'</p>'+
          '<div class="paper"><div class="vwrap" id="vw">'+
            '<div class="bl-top"><div class="blurb" data-z="cust" style="--c:var(--p-blue)"><b>'+E("b_cust_t")+'</b><span>'+E("b_cust")+'</span></div>'+
              '<div class="blurb" data-z="mkt" style="--c:var(--p-brown)"><b>'+E("b_mkt_t")+'</b><span>'+E("b_mkt")+'</span></div></div>'+
            VENN()+
            '<div class="blurb mid" data-z="proc" style="--c:var(--purple)"><b>'+E("b_proc_t")+'</b><span>'+E("b_proc")+'</span></div>'+
          '</div></div>'+
          '<p class="ice-note">'+E("iceberg")+'</p>'+
          lensMap("quad", [2])+
          go_()+
        '</section>'+
      '</div></main>';
    bind();
    draw();
    $$(".tile").forEach(function(t){ t.addEventListener("click", function(){ goPart(+t.getAttribute("data-go")); }); });
    var nx = $('[data-act="next"]'); if (nx) nx.addEventListener("click", function(){ if (!editing) goPart(1); });
  }
  function goPart(p){
    if (p === part) return;
    part = p; if (p === 1) seen2 = true;
    $$(".part").forEach(function(s){ var on = +s.getAttribute("data-part") === p; s.hidden = !on; s.classList.remove("in"); if (on && !RM){ void s.offsetWidth; s.classList.add("in"); } });
    $$(".tile").forEach(function(t){ t.classList.toggle("on", +t.getAttribute("data-go") === p); });
    var tl = $(".tiles"); if (tl) tl.classList.toggle("seen", seen2);
    var st = stage(), tl2 = $(".tiles"); if (st && tl2) st.scrollTop = Math.max(0, tl2.offsetTop - 8);
    markOneLine();
  }
  var onBind = function(){
    var vw = $("#vw"), cur = null; if (!vw) return;
    function hi(z){ cur = (cur === z) ? null : z; vw.classList.toggle("dim", !!cur); vw.querySelectorAll("[data-z]").forEach(function(el){ el.classList.toggle("hi", el.getAttribute("data-z") === cur); }); }
    vw.querySelectorAll("[data-z]").forEach(function(el){ el.addEventListener("click", function(){ if (!editing) hi(el.getAttribute("data-z")); }); });
  };
  /* crowded category on the left; three overlapping categories on the right, nearly empty where all three meet */
  function draw(){
    var NS = "http://www.w3.org/2000/svg";
    function mk(svg,n,a){ var e = document.createElementNS(NS,n); for (var k in a) e.setAttribute(k,a[k]); svg.appendChild(e); return e; }
    var seed = 7; function rnd(){ seed = (seed*16807)%2147483647; return (seed-1)/2147483646; }
    function dot(svg,x,y,r){ mk(svg,"circle",{cx:x.toFixed(1),cy:y.toFixed(1),r:r.toFixed(2),fill:"rgba(21,38,56,.10)",stroke:"rgba(21,38,56,.5)","stroke-width":.45}); }
    function head(svg,id,col){ var d = mk(svg,"defs",{}); var m = document.createElementNS(NS,"marker"); [["id",id],["viewBox","0 0 10 10"],["refX",8],["refY",5],["markerWidth",6],["markerHeight",6],["orient","auto-start-reverse"]].forEach(function(a){ m.setAttribute(a[0],a[1]); }); var p = document.createElementNS(NS,"path"); p.setAttribute("d","M0,0 L10,5 L0,10 Z"); p.setAttribute("fill",col); m.appendChild(p); d.appendChild(m); }
    var L = $("#leadgen"), BC = [100,108], BR = 86;
    mk(L,"circle",{cx:BC[0],cy:BC[1],r:BR+3,fill:"#F3F1F2",stroke:"#A6342B","stroke-width":1.4});
    for (var i=0;i<500;i++){ var r = 1.6+Math.pow(rnd(),3)*9, a = rnd()*Math.PI*2, d = Math.sqrt(rnd())*(BR-r); dot(L,BC[0]+d*Math.cos(a),BC[1]+d*Math.sin(a),r); }
    head(L,"ahL","#A6342B");
    mk(L,"path",{d:"M100,220 L100,172",stroke:"#A6342B","stroke-width":2.2,fill:"none","marker-end":"url(#ahL)"});
    var R = $("#overlap"), C = [[76,84],[124,84],[100,126]], CR = 56;
    var fills = ["rgba(30,79,124,.10)","rgba(142,63,34,.10)","rgba(23,112,63,.10)"], strokes = ["#1E4F7C","#8E3F22","#17703F"];
    C.forEach(function(c,j){ mk(R,"circle",{cx:c[0],cy:c[1],r:CR,fill:fills[j],stroke:strokes[j],"stroke-width":1.6}); });
    C.forEach(function(c){
      var placed = 0, tries = 0;
      while (placed < 100 && tries < 20000){
        tries++;
        var a = rnd()*Math.PI*2, d = Math.sqrt(rnd())*(CR-3), x = c[0]+d*Math.cos(a), y = c[1]+d*Math.sin(a);
        var k = C.filter(function(o){ return Math.hypot(x-o[0],y-o[1]) < CR-1; }).length;
        if (k >= 3) continue;
        if (k === 2 && rnd() > 0.15) continue;
        dot(R,x,y,1.1+Math.pow(rnd(),3)*2.6); placed++;
      }
    });
    [[85,92],[115,92],[90,114],[110,114]].forEach(function(p){ dot(R,p[0],p[1],2.6); });
    var st = mk(R,"g",{transform:"translate(100 100)"});
    mk(st,"path",{d:"M0,-10 L2.7,-3.3 L9.6,-3.1 L4.3,1.4 L6,8.2 L0,4.4 L-6,8.2 L-4.3,1.4 L-9.6,-3.1 L-2.7,-3.3 Z",fill:"#5D1B4E",stroke:"#fff","stroke-width":.8,"class":"star-us"});
    head(R,"ahR","#17703F");
    mk(R,"path",{d:"M150,220 Q160,150 112,106",stroke:"#17703F","stroke-width":2.2,fill:"none","marker-end":"url(#ahR)"});
  }

  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = S.timeout(function(){ markOneLine(); }, 120); });

  function bind(){
    $('[data-act="nc-back"]').addEventListener("click", function(){ back(); });
    $('[data-act="cta"]').addEventListener("click", function(){
      if (editing) return;
      complete();
    });
    wireFan();
    onBind();
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
