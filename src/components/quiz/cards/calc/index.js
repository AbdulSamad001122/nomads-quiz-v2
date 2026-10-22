/* Calculator intro card (after the Q5 case studies, before Q6).
   The card's own script from "Calculator Intro (after Q5 case studies).html",
   ported for the quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed;
   - the track (slg / plg) comes from the quiz (data.track) instead of the
     window.NOMADS_TRACK global the file asks the quiz to set;
   - lookups run inside the card's shadow root; every window listener and
     timer stops when the screen closes;
   - the tap note fades out after the first tap on "Revenue per visitor",
     as the file's notes describe ("shows until it is tapped once"); its
     script only stopped the pulse. The note also gives back its space as
     it fades (user rule, Oct 22: no empty band above the chart);
   - quiz additions: a Back control at the top; the button hugs its text
     with the arrow after the last word (user rule) and moves the quiz on
     (the card's "nomads:card-complete"). */
import COPY_JSON from './copy.json';
import ASSETS from './assets.js';
import css from './card.css?inline';
import { createScope, ctaLabel, backButton } from '../cardBase.js';

export { css };

export function mount({ host, root, app, data, back, complete }) {
  var S = createScope();

  var CARD = "q6-calculator-intro";
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

  var CH = [{k:"ch1",v:6000,r:0.40,cls:"bleed"},{k:"ch2",v:3500,r:1.10,cls:""},{k:"ch3",v:1800,r:5.20,cls:""},{k:"ch4",v:700,r:12.80,cls:"best"}];
  var mode = "traffic", flipped = false, RH = 38;
  function render(){
    app.innerHTML =
      '<main class="stage" aria-label="Revenue Per Visitor Calculator"><div class="col">'+
        backButton()+
        '<span class="kick">'+E("kick")+'</span>'+
        '<h1>'+E("h1",1)+'</h1>'+
        '<div class="pickwrap"><div class="callout" id="nudge"><span class="ct">'+E("hint")+'</span>'+A_DN+A_SIDE+'</div>'+
        '<div class="paper" id="card">'+
          '<div class="vtabs" role="group" aria-label="Rank channels by">'+
            '<button type="button" class="tile" data-v="t" aria-pressed="true"><small>'+E("seg_t_s")+'</small><b>'+E("seg_t")+'</b></button>'+
            '<button type="button" class="tile'+(flipped?'':' pulse')+'" data-v="r" aria-pressed="false"><small>'+E("seg_r_s")+'</small><b>'+E("seg_r")+'</b></button>'+
          '</div>'+
          '<div class="rows" id="rows" style="height:'+(CH.length*RH-8)+'px">'+CH.map(function(c){
            return '<div class="row '+c.cls+'" data-c="'+c.k+'"><span class="ch">'+E(c.k)+'</span><span class="barw"><span class="bar"></span><span class="val"></span>'+(c.cls?'<span class="tag '+c.cls+'">'+E("tag_"+c.cls)+'</span>':'')+'</span></div>';
          }).join("")+'</div>'+
          '<div class="ex">'+E("ex")+'</div>'+
        '</div></div>'+
        '<p class="body">'+E("body",1)+'</p>'+
        '<div class="cbox"><div class="promise"><strong>'+E("pr_v")+'</strong><span>'+E("pr")+'</span></div></div>'+
        go_()+
      '</div></main>';
    bind();
    $$(".vtabs .tile").forEach(function(t){ t.addEventListener("click", function(e){
      if (editing) return;
      if (t.getAttribute("data-v") === "r"){ flipped = true; t.classList.remove("pulse"); var nd = $("#nudge"); if (nd){ nd.classList.add("gone"); nd.setAttribute("aria-hidden", "true"); } show("rpv"); }
      else show("traffic");
    }); });
    show(mode);
  }
  function show(m){
    mode = m; var rpv = m === "rpv", card = $("#card");
    card.classList.toggle("rpv", rpv);
    $$(".vtabs .tile").forEach(function(t){ var on = (t.getAttribute("data-v") === "r") === rpv; t.classList.toggle("on", on); t.setAttribute("aria-pressed", String(on)); });
    var key = rpv ? "r" : "v", max = Math.max.apply(null, CH.map(function(c){ return c[key]; }));
    CH.slice().sort(function(a,b){ return b[key]-a[key]; }).forEach(function(c,i){
      var el = $('.row[data-c="'+c.k+'"]');
      el.style.transform = "translateY("+(i*RH)+"px)";
      el.querySelector(".bar").style.width = Math.max(c[key]/max*100, 4)+"%";
      el.querySelector(".val").textContent = rpv ? ("$"+c.r.toFixed(2)+" per visitor") : (c.v.toLocaleString("en-US")+" visitors");
    });
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
