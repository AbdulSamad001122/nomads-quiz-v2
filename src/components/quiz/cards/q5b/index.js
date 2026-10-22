/* Q5B Email list card (after Q5, answer B; same card for PLG and SLG).
   The card's own script from "Q5B Email List Card.html", ported for the quiz:
   - preview chrome (grey bar with the Q3/ground pickers, stand-in header)
     and copy editing removed, including the editor-only labels (.ebox);
   - ground fixed to navy (the approved one; the file's default);
   - which case opens first in part 2 follows the taker's real Q3 answer
     (data.q3, mapped to the card's own answer names), as the file asks;
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

const Q3_NAMES = {
  agency: 'Agency',
  consultant: 'Consultant/Fractional',
  'b2b-service': 'B2B Service',
  coach: 'Coaches and Course Creators',
  creator: 'Creator/Personal Brand',
  saas: 'SaaS',
  ecommerce: 'E-commerce',
  other: 'Other',
};

export { css };

export function mount({ host, root, app, data, back, complete }) {
  var S = createScope();

  /* Ground: navy, the approved one (the preview bar could switch it for review). */
  var GROUND = "navy";

  var COPY = COPY_JSON;
  var A = ASSETS;
    var editing = false;

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function br(s){return String(s).replace(/\n/g,"<br>");}
  /* {{text}} = green number, [[text]] = red number, **text** = accent */
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>').replace(/\*\*(.+?)\*\*/g,'<em>$1</em>'));}
  function E(k, rch){ var v = COPY[k]; if (v === undefined) v = ""; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  var QPATH = "M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z";
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SWAP = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var QM = '<svg class="qm" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  /* hand-drawn arrows for the callouts: phone (curving down-right), desktop (curving left), and straight down */
  var A_PH = '<svg class="a-ph bob" viewBox="0 0 76 58" aria-hidden="true"><path d="M4 8C32 2 56 16 62 48"/><path d="M51 42l11 8 5-12"/></svg>';
  var A_DK = '<svg class="a-dk bob" viewBox="0 0 120 70" aria-hidden="true"><path d="M116 14C82 4 42 20 12 50"/><path d="M9 37l2 14 14-2"/></svg>';
  var A_DN = '<svg class="a-dn bob" viewBox="0 0 44 72" aria-hidden="true"><path d="M40 8C16 12 6 34 14 66"/><path d="M4 56l10 12 10-10"/></svg>';
  var A_SIDE = '<svg class="a-side bob" viewBox="0 0 150 74" aria-hidden="true"><path d="M30 4C20 36 64 62 140 58"/><path d="M127 46l13 12-14 10"/></svg>';

  function setGround(g){
    GROUND = ["maroon","ice","clay","stone"].indexOf(g) > -1 ? g : "navy";
    var st = $(".stage"); if (st) st.setAttribute("data-ground", GROUND);
    var tex = A["texture_"+GROUND] || A.texture_navy;
    host.style.setProperty("--texture", tex ? 'url("'+tex.src+'")' : "none");
  }

  var part = 0, lead = "sol";
  var SLICES = [
    {key:"ready", pct:3, color:"#A6342B"},
    {key:"open", pct:7, color:"#E0705F"},
    {key:"notthink", pct:30, color:"#A79DB0"},
    {key:"dontthink", pct:30, color:"#8A7F95"},
    {key:"not", pct:30, color:"#5F566B"}
  ];
  var WON = "#2E9E62";
  /* which slices each message reaches, and which ones the legend explains in place */
  var LEAD = {
    sol: {reach:10, green:[], lit:["ready","open"]},
    sym: {reach:70, green:["notthink","dontthink"], lit:["notthink","dontthink","not"]}
  };

  function render(){
    app.innerHTML =
      '<main class="stage" aria-label="Case studies: growing an email list"><div class="col">'+
        backButton()+
        '<div class="said"><div class="top">'+QM+'<span class="lbl">'+E("echo_label")+'</span></div><span class="txt">'+E("echo")+'</span></div>'+
        '<nav class="tiles" aria-label="Two parts">'+tile(0,"t1")+tile(1,"t2")+'</nav>'+
        /* PART 1 */
        '<section class="part" data-part="0" aria-label="Part 1 of 2">'+
          '<h1>'+E("p1_h1",1)+'</h1>'+
          '<p class="context">'+E("p1_body")+'</p>'+
          '<div class="msg-area">'+
            '<div class="callout" id="nudge"><span class="ct">'+E("nudge")+'</span>'+A_PH+A_DK+'</div>'+
            '<div class="stack" id="stack"><div class="fan" id="fan">'+msgCard("sol")+msgCard("sym")+'</div></div>'+
          '</div>'+
          '<div class="piebox" id="piebox">'+
            '<div class="reach">'+E("reach_lbl")+'<b id="reach" aria-live="polite">10 of 100</b></div>'+
            '<div class="pie-row">'+
              '<div class="piewrap"><svg class="pie" id="pie" viewBox="-22 -22 344 344" role="img" aria-label="Of every 100 potential buyers: 3 ready to buy now, 7 open to it, 30 not thinking about it, 30 who don’t think they’re interested, 30 who know they’re not interested"></svg>'+
                '<div class="credit">'+E("credit")+'</div></div>'+
              '<ul class="legend">'+SLICES.map(function(s){ return '<li data-s="'+s.key+'" style="--c:'+s.color+'"><span class="sw"></span><b>'+E("slice_"+s.key+"_lbl")+'</b><p>'+E("slice_"+s.key)+'</p></li>'; }).join('')+'</ul>'+
            '</div>'+
            '<div class="lead-x sol" id="leadx" aria-live="polite">'+
              '<div data-for="sol"><span class="lb">'+E("lead_sol_lbl")+'</span><p>'+E("lead_sol")+'</p></div>'+
              '<div data-for="sym"><span class="lb">'+E("lead_sym_lbl")+'</span><p>'+E("lead_sym1")+'</p><p>'+E("lead_sym")+'</p></div>'+
            '</div>'+
            '<button type="button" class="flip" id="flip" data-act="flip"><span class="flip-ic" aria-hidden="true">'+SWAP+'</span>'+
              '<span class="flip-t" data-for="sol">'+E("flip_to_sym")+'</span><span class="flip-t" data-for="sym">'+E("flip_to_sol")+'</span>'+
              '<span class="flip-up" aria-hidden="true">↑</span></button>'+
          '</div>'+
          '<div class="go"><button class="cta next" type="button" data-act="next">'+ctaLabel(COPY.next1, ARROW)+'</button></div>'+
        '</section>'+
        /* PART 2 */
        '<section class="part" data-part="1" aria-label="Part 2 of 2" hidden>'+
          '<h1>'+E("p2_h1",1)+'</h1>'+
          '<p class="context">'+E("p2_body")+'</p>'+
          '<div class="pick"><div class="callout">'+A_DN+'<span class="ct">'+E("tabs_lbl")+'</span>'+A_SIDE+'</div>'+
          '<div class="tabs" role="group" aria-label="Businesses like yours">'+
            ['services','courses','products'].map(function(c){ return '<button type="button" data-case="'+c+'" aria-pressed="false">'+E("tab_"+c)+'</button>'; }).join('')+
          '</div></div>'+
          caseServices()+caseCourses()+caseProducts()+
          '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
            '<div class="upnext">'+E("up_next")+'</div></div>'+
        '</section>'+
        '<div class="quad"><p class="quad-h">'+E("quad")+'</p><div class="qmap"><ul>'+
          '<li class="on">'+E("q1")+'</li><li>'+E("q2")+'</li><li>'+E("q3")+'</li><li>'+E("q4")+'</li></ul>'+
          '<span class="rose" aria-hidden="true">'+(A.compass?'<img src="'+A.compass.src+'" alt="">':'')+'</span></div></div>'+
      '</div></main>';
    setGround(GROUND);
    buildPie();
    setLead(lead, false);
    showCase(currentCase || caseForQ3(q3Answer), false);
    show(part, null);
    bind();
  }
  function msgCard(k){
    return '<div class="msg '+k+'" data-lead="'+k+'" role="button" tabindex="-1" aria-label="'+esc(COPY[k+"_tag"])+' message">'+
      '<div class="hd"><span>'+E(k+"_tag")+'</span></div><span class="swap" aria-hidden="true">'+SWAP+'</span>'+
      '<div class="bd"><span class="q">'+E(k+"_q")+'</span><span class="note">'+E(k+"_note")+'</span></div></div>';
  }
  function tile(p, k){
    return '<button class="tile" type="button" data-go="'+p+'"><span class="n">'+(p+1)+' of 2</span><b>'+E(k)+'</b><span class="go-ic" aria-hidden="true">'+ARROW+'</span></button>';
  }
  function tlRow(lblK, valK, cls, w){
    return '<div><div class="tl-top"><span class="tl-l">'+E(lblK)+'</span><span class="tl-v '+cls+'">'+E(valK)+'</span></div><div class="tl-bar"><i class="'+cls+'" data-w="'+w+'"></i></div></div>';
  }
  function results(keys){ return '<div class="result">'+keys.map(function(k){ return '<div>'+E(k)+'<small>'+E(k+"s")+'</small></div>'; }).join('')+'</div>'; }
  function shotImg(id, alt, sm){ return A[id] ? '<figure class="shot'+(sm===1?' sm':sm===2?' tall':'')+'"><img src="'+A[id].src+'" alt="'+alt+'"></figure>' : ''; }
  function caseServices(){
    var b = COPY.bars, mx = Math.max(b.services_before, b.services_after);
    return '<article class="case" data-case="services" hidden><p class="case-h">'+E("services_h")+'</p>'+
      '<div class="tl">'+tlRow("services_m0","services_m0v","lo",b.services_before/mx*100)+tlRow("services_m1","services_m1v","hi",b.services_after/mx*100)+'<div class="tl-cap">'+E("services_mcap")+'</div></div>'+
      results(["services_rx","services_r0","services_r1"])+
      '<div class="shots">'+shotImg("mary_leads","Mary’s quiz dashboard: 1.9K started, 1.4K finished, 1,902 visitors",2)+shotImg("mary_offers","Mary’s dashboard: 29 offers sold, up 61%",1)+'</div></article>';
  }
  function caseCourses(){
    return '<article class="case" data-case="courses" hidden><p class="case-h">'+E("courses_h")+'</p>'+
      '<div class="speed"><div class="sp lo"><span class="tl-l">'+E("courses_t0")+'</span><b>'+E("courses_t0v")+'</b></div>'+
        '<span class="sp-arrow" aria-hidden="true">'+ARROW+'</span>'+
        '<div class="sp hi"><span class="tl-l">'+E("courses_t1")+'</span><b>'+E("courses_t1v")+'</b></div>'+
        '<div class="tl-cap">'+E("courses_tcap")+'</div></div>'+
      results(["courses_r0"])+
      '<div class="shots">'+shotImg("samar_comment","A reader’s LinkedIn comment to Samar: glad she bought the eCommerce Email Bootcamp after taking the quiz")+'</div></article>';
  }
  function caseProducts(){
    return '<article class="case" data-case="products" hidden><p class="case-h">'+E("products_h")+'</p>'+
      '<div class="compare">'+
        '<div class="side before"><span class="tag">'+E("before_lbl")+'</span><div class="stat">'+E("products_b0")+'<small>'+E("products_b1")+'</small></div></div>'+
        '<span class="then" aria-hidden="true">'+ARROW+'</span>'+
        '<div class="side after"><span class="tag">'+E("after_lbl")+'</span><div class="stat">'+E("products_a0")+'<small>'+E("products_a1")+'</small></div></div>'+
      '</div>'+results(["products_r0"])+'</article>';
  }

  /* ---------- Q3 answer → first case ---------- */
  var Q3_OPTIONS = ["Agency","Consultant/Fractional","B2B Service","Coaches and Course Creators","Creator/Personal Brand","SaaS","E-commerce","Other","(no answer)"];
  function readQ3(){
    return Q3_NAMES[data && data.q3] || "";
  }
  function caseForQ3(a){
    a = String(a || "").toLowerCase();
    if (/coach/.test(a)) return "services";
    if (/agency|consult|fractional|b2b|service/.test(a)) return "services";
    if (/creator|personal brand|influencer/.test(a)) return "courses";
    if (/saas|software|e-?commerce|ecom|product|store|shop/.test(a)) return "products";
    return "services";
  }
  var q3Answer = readQ3() || "(no answer)", currentCase = null;
  function showCase(c){
    currentCase = c;
    $$(".case").forEach(function(a){ a.hidden = a.getAttribute("data-case") !== c; });
    $$(".tabs button").forEach(function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-case") === c)); });
    growBars();
  }
  function growBars(){
    var bars = $$(".case:not([hidden]) .tl-bar i");
    bars.forEach(function(i){ i.style.width = "0"; });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ bars.forEach(function(i){ i.style.width = i.getAttribute("data-w") + "%"; }); }); });
  }

  /* ---------- the buyer pie (static: it only changes when the reader swaps the message cards) ---------- */
  var NS = "http://www.w3.org/2000/svg", cx = 150, cy = 150, PR = 112, paths = {};
  function pt(f, r){ var a = f*2*Math.PI; return [cx + r*Math.sin(a), cy - r*Math.cos(a)]; }
  function mk(svg, n, a, t){ var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (t !== undefined) e.textContent = t; svg.appendChild(e); return e; }
  function nameOf(k){ var v = String(COPY["slice_"+k+"_lbl"] || ""); var i = v.indexOf("·"); return (i > -1 ? v.slice(i+1) : v).trim(); }
  function buildPie(){
    var svg = $("#pie"); if (!svg) return; svg.innerHTML = ""; paths = {};
    var acc = 0;
    SLICES.forEach(function(s){
      var a0 = acc/100, a1 = (acc+s.pct)/100, p0 = pt(a0, PR), p1 = pt(a1, PR);
      paths[s.key] = mk(svg, "path", {d:"M"+cx+" "+cy+"L"+p0+"A"+PR+" "+PR+" 0 "+((a1-a0) > .5 ? 1 : 0)+" 1 "+p1+"Z", fill:s.color, "class":"sl"});
      s.mid = (a0+a1)/2; acc += s.pct;
    });
    SLICES.forEach(function(s){
      var lab = nameOf(s.key);
      if (s.pct < 10){
        var a = pt(s.mid, PR-4), b = pt(s.mid, PR+18), right = b[0] >= cx && s.key !== "ready", tx = b[0] + (right ? 3 : -3), an = right ? "start" : "end";
        mk(svg, "line", {x1:a[0], y1:a[1], x2:b[0], y2:b[1]});
        mk(svg, "text", {x:tx, y:b[1]-2, "text-anchor":an, "class":"out"}, s.pct+"%");
        mk(svg, "text", {x:tx, y:b[1]+9, "text-anchor":an, "class":"outn"}, lab);
      } else {
        var c = pt(s.mid, PR*.58), w = lab.split(" "), h = Math.ceil(w.length/2);
        mk(svg, "text", {x:c[0], y:c[1]+2, "text-anchor":"middle", "class":"pct"}, s.pct+"%");
        mk(svg, "text", {x:c[0], y:c[1]+15, "text-anchor":"middle", "class":"nm"}, w.slice(0,h).join(" "));
        mk(svg, "text", {x:c[0], y:c[1]+25, "text-anchor":"middle", "class":"nm"}, w.slice(h).join(" "));
      }
    });
    /* the 20× arc: always visible, dashed and grey until the symptom-led message wins it */
    var RR = PR+9, RT = PR+25;
    function arc(r, f0, f1, sweep){ var a = pt(f0, r), b = pt(f1, r); return "M"+a+" A"+r+" "+r+" 0 "+(Math.abs(f1-f0) > .5 ? 1 : 0)+" "+sweep+" "+b; }
    mk(svg, "path", {d:arc(RR, .10, .70, 1), "class":"ring"});
    var e0 = pt(.10, RR), e1 = pt(.70, RR);
    mk(svg, "circle", {cx:e0[0], cy:e0[1], r:4, "class":"ring-end"}); mk(svg, "circle", {cx:e1[0], cy:e1[1], r:4, "class":"ring-end"});
    var defs = mk(svg, "defs", {}), tp = document.createElementNS(NS, "path");
    tp.setAttribute("id", "ring-tp"); tp.setAttribute("d", arc(RT, .72, .26, 0)); defs.appendChild(tp);
    var rt = mk(svg, "text", {"class":"ring-txt", "text-anchor":"middle"});
    var tpath = document.createElementNS(NS, "textPath"); tpath.setAttribute("href", "#ring-tp"); tpath.setAttribute("startOffset", "50%"); tpath.textContent = COPY.ring_lbl; rt.appendChild(tpath);
  }
  var reachNow = 10;
  function count(from, to, ms){
    var el = $("#reach"); if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){ el.textContent = to+" of 100"; return; }
    var st = null; function f(t){ if (!st) st = t; var p = Math.min((t-st)/ms, 1); el.textContent = Math.round(from + (to-from)*p)+" of 100"; if (p < 1) requestAnimationFrame(f); } requestAnimationFrame(f);
  }
  function setLead(v, animate){
    if (animate && v !== lead){ var old = $('.msg[data-lead="'+lead+'"]'); if (old){ old.classList.remove("leaving"); void old.offsetWidth; old.classList.add("leaving"); S.timeout(function(){ old.classList.remove("leaving"); }, 600); } }
    lead = v; var L = LEAD[v];
    $$(".msg").forEach(function(m){
      var front = m.getAttribute("data-lead") === v;
      m.classList.toggle("front", front); m.classList.toggle("back", !front);
      m.setAttribute("tabindex", front ? "-1" : "0");
      m.setAttribute("aria-pressed", String(front));
    });
    var n = $("#nudge"); if (n) n.hidden = v !== "sol" || editing;
    SLICES.forEach(function(s){ if (paths[s.key]) paths[s.key].setAttribute("fill", L.green.indexOf(s.key) > -1 ? WON : s.color); });
    var pie = $("#pie"); if (pie) pie.classList.toggle("won", v === "sym");
    $$(".legend li").forEach(function(li){
      var k = li.getAttribute("data-s"), won = L.green.indexOf(k) > -1;
      li.classList.toggle("lit", L.lit.indexOf(k) > -1);
      li.style.setProperty("--c", won ? WON : SLICES.filter(function(s){ return s.key === k; })[0].color);
    });
    var lx = $("#leadx"); if (lx){ lx.classList.toggle("sol", v === "sol"); lx.classList.toggle("sym", v === "sym"); }
    var fl = $("#flip"); if (fl){ fl.classList.toggle("sol", v === "sol"); fl.classList.toggle("sym", v === "sym"); }
    var r = $("#reach");
    if (r){ r.classList.toggle("up", v === "sym"); if (animate && L.reach !== reachNow) count(reachNow, L.reach, 800); else r.textContent = L.reach+" of 100"; }
    reachNow = L.reach;
  }

  /* ---------- parts ---------- */
  function stage(){ return $(".stage"); }
  function show(p, dir){
    part = p;
    $$(".part").forEach(function(s){
      var on = +s.getAttribute("data-part") === p;
      s.hidden = !on; s.classList.remove("in-fwd","in-back");
      if (on && dir){ void s.offsetWidth; s.classList.add(dir === "fwd" ? "in-fwd" : "in-back"); }
    });
    $$(".tile").forEach(function(t){ var on = +t.getAttribute("data-go") === p; t.classList.toggle("on", on); t.setAttribute("aria-current", on ? "step" : "false"); });
    if (p === 1) growBars();
    markOneLine();
  }
  function go(p, dir){
    if (p === part) return;
    show(p, dir);
    var st = stage(), tl = $(".tiles"), pt = $('.part[data-part="'+p+'"]');
    if (st && pt) st.scrollTop = Math.max(0, pt.offsetTop - (tl ? tl.offsetHeight : 0) - 14);
    acc = 0; bottomSince = 0;
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
      if (!atBottom(st)) return;
      if (!bottomSince){ bottomSince = Date.now(); return; }
      if (Date.now() - bottomSince < 450) return;
      acc += e.deltaY; clearTimeout(accT); accT = S.timeout(function(){ acc = 0; }, 900);
      if (acc > 240) go(1, "fwd");
    }, {passive:true});
    st.addEventListener("touchstart", function(e){ var t = e.touches[0]; ty0 = t.clientY; tx0 = t.clientX; tBottom = atBottom(st); }, {passive:true});
    st.addEventListener("touchmove", function(e){
      if (editing || part !== 0 || !tBottom) return;
      var t = e.touches[0], dy = ty0 - t.clientY, dx = Math.abs(t.clientX - tx0);
      if (dy > 110 && dy > dx*1.5 && atBottom(st)){ tBottom = false; go(1, "fwd"); }
    }, {passive:true});
    st.addEventListener("touchend", function(e){
      if (editing) return;
      var t = e.changedTouches[0], dx = t.clientX - tx0, dy = t.clientY - ty0;
      if (e.target.closest && e.target.closest(".stack")) return;   /* swiping the message cards is not a part change */
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.5){
        if (dx < 0 && part === 0) go(1, "fwd");
        else if (dx > 0 && part === 1) go(0, "back");
      }
    }, {passive:true});
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
  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = S.timeout(function(){ markOneLine(); }, 120); });

  function bind(){
    $('[data-act="nc-back"]').addEventListener("click", function(){ back(); });
    $('[data-act="next"]').addEventListener("click", function(){ if (!editing) go(1, "fwd"); });
    $$(".tile").forEach(function(t){ t.addEventListener("click", function(e){
      if (editing) return;
      var p = +t.getAttribute("data-go"); go(p, p > part ? "fwd" : "back");
    }); });
    $('[data-act="cta"]').addEventListener("click", function(){
      if (editing) return;
      complete();
    });
    wireStack();
    $$(".msg").forEach(function(m){
      m.addEventListener("click", function(){ if (editing || m.classList.contains("front")) return; setLead(m.getAttribute("data-lead"), true); });
      m.addEventListener("keydown", function(e){ if (editing) return; if ((e.key === "Enter" || e.key === " ") && m.classList.contains("back")){ e.preventDefault(); setLead(m.getAttribute("data-lead"), true); } });
    });
    $$(".tabs button").forEach(function(b){ b.addEventListener("click", function(){ if (editing) return; showCase(b.getAttribute("data-case")); }); });
    /* the switch under the breakdown: swap the message, then bring the counter + pie into view so the change is seen */
    var fl = $("#flip"); if (fl) fl.addEventListener("click", function(){
      if (editing) return;
      setLead(lead === "sol" ? "sym" : "sol", true);
      var st = stage(), pb = $("#piebox"), tl = $(".tiles");
      if (st && pb){
        var top = pb.getBoundingClientRect().top - st.getBoundingClientRect().top + st.scrollTop - (tl ? tl.offsetHeight : 0) - 10;
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (pb.getBoundingClientRect().top < st.getBoundingClientRect().top + (tl ? tl.offsetHeight : 0)) st.scrollTo({top:Math.max(0, top), behavior: reduce ? "auto" : "smooth"});
      }
    });
    wireGestures();
  }
  /* HivedIn-style: the fan tilts toward the mouse; near the back card it lifts out. Phones: tap the round button or swipe. */
  function wireStack(){
    var area = $(".msg-area"), stack = $("#stack"), fan = $("#fan"); if (!area || !stack || !fan) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    area.addEventListener("pointermove", function(e){
      if (editing || reduce || e.pointerType !== "mouse") return;
      var r = stack.getBoundingClientRect(), x = (e.clientX - (r.left + r.width/2)) / (r.width/2), y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
      x = Math.max(-1.4, Math.min(1.4, x)); y = Math.max(-1.4, Math.min(1.4, y));
      fan.style.setProperty("--ry", (x*12).toFixed(2)+"deg"); fan.style.setProperty("--rx", (-y*9).toFixed(2)+"deg");
      stack.classList.toggle("peek", x > .35 && y < .2);
    });
    area.addEventListener("pointerleave", function(){ fan.style.setProperty("--ry","0deg"); fan.style.setProperty("--rx","0deg"); stack.classList.remove("peek"); });
    var sx = null, sy = null;
    stack.addEventListener("touchstart", function(e){ var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, {passive:true});
    stack.addEventListener("touchend", function(e){
      if (editing || sx === null) return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)*1.3) setLead(lead === "sol" ? "sym" : "sol", true);
    }, {passive:true});
  }

  /* [copy-editing code removed] */

  render();

  return function destroy(){
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
