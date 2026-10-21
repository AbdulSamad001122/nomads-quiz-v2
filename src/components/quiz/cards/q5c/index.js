/* Q5C Contrarian POV card (after Q5, answer C; same card for PLG and SLG).
   The card's own script from "Q5C Contrarian POV Card.html", ported for the
   quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed;
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
    var editing = false;

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function br(s){return String(s).replace(/\n/g,"<br>");}
  /* {{text}} = green, [[text]] = red, **text** = accent, *text* = emphasis */
  /* \* in the copy shows a literal asterisk */
  function rich(s){return br(esc(s).replace(/\\\*/g,'\u0001').replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>').replace(/\*\*(.+?)\*\*/g,'<em>$1</em>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/\u0001/g,'*'));}
  function E(k, rch){ var v = COPY[k]; if (v === undefined) v = ""; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  var QPATH = "M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z";
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SWAP = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var QM = '<svg class="qm" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  var A_PH = '<svg class="a-ph bob" viewBox="0 0 76 58" aria-hidden="true"><path d="M4 8C32 2 56 16 62 48"/><path d="M51 42l11 8 5-12"/></svg>';
  var A_DK = '<svg class="a-dk bob" viewBox="0 0 120 70" aria-hidden="true"><path d="M116 14C82 4 42 20 12 50"/><path d="M9 37l2 14 14-2"/></svg>';
  host.style.setProperty("--texture", A.texture_navy ? 'url("'+A.texture_navy.src+'")' : "none");

  var part = 0, lead = "b";
  function render(){
    app.innerHTML =
      '<main class="stage" data-ground="navy" aria-label="Case study: Contrarian POV"><div class="col">'+
        backButton()+
        '<div class="said"><div class="top">'+QM+'<span class="lbl">'+E("echo_label")+'</span></div><span class="txt">'+E("echo")+'</span></div>'+
        '<nav class="tiles" aria-label="Two parts">'+tile(0,"t1")+tile(1,"t2")+'</nav>'+
        /* PART 1 */
        '<section class="part" data-part="0" aria-label="Part 1 of 2">'+
          '<h1>'+E("p1_h1",1)+'</h1>'+
          '<p class="context">'+E("p1_body",1)+'</p>'+
          '<article class="case nm">'+
            '<div class="case-tag">'+E("nm_tag")+'</div>'+
            '<p class="story">'+E("story_a",1)+'</p>'+
            '<div class="mk-row">'+mkFig("was")+'<span class="then" aria-hidden="true">'+ARROW+'</span>'+mkFig("now")+'</div>'+
            '<p class="story punch">'+E("story_b",1)+'</p>'+
            '<div class="winbox"><span class="v">'+E("win_v",1)+'</span><small>'+E("win_s")+'</small></div>'+
          '</article>'+
          '<div class="go"><button class="cta next" type="button" data-act="next">'+ctaLabel(COPY.next1, ARROW)+'</button></div>'+
        '</section>'+
        /* PART 2 */
        '<section class="part" data-part="1" aria-label="Part 2 of 2" hidden>'+
          '<h1>'+E("p2_h1",1)+'</h1>'+
          '<p class="context">'+E("p2_body",1)+'</p>'+
          '<div class="vbox" id="vbox"><div class="vin">'+
            '<div class="bl-top">'+
              '<div class="blurb" data-z="cust"><b>'+E("cust_t")+'</b>'+E("cust")+'</div>'+
              '<div class="blurb" data-z="mkt"><b>'+E("mkt_t")+'</b>'+E("mkt")+'</div>'+
            '</div>'+
            '<div class="vwrap">'+VENN()+
              '<span class="vl gap">'+E("gap_t")+'</span>'+
            '</div>'+
            '<div class="blurb mid" data-z="proc"><b>'+E("proc_t")+'</b>'+E("proc")+'</div>'+
          '</div></div>'+
          '<article class="case">'+
            '<div class="case-tag">'+E("case_tag")+'</div>'+
            '<p class="case-h">'+E("case_h")+'</p>'+
            '<div class="msg-area cs-area">'+
              '<div class="callout" id="nudge"><span class="ct">'+E("cs_nudge")+'</span>'+A_PH+A_DK+'</div>'+
              '<div class="stack" id="stack"><div class="fan" id="fan">'+csCard("b")+csCard("a")+'</div></div>'+
            '</div>'+
            (A.case_shot ? '<figure class="cshot"><img src="'+A.case_shot.src+'" alt="The founder’s LinkedIn post: after call 29 he tweaked his messaging, and closed 26 of the next 31 calls"></figure>' : '')+
            '<div class="strip"><div class="bad">'+E("case_bp")+'</div><div class="good">'+E("case_ap")+'</div></div>'+
            '<div class="growth">'+E("case_growth",1)+'</div>'+
          '</article>'+
          '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
            '<div class="upnext">'+E("up_next")+'</div></div>'+
        '</section>'+
        '<div class="quad"><p class="quad-h">'+E("quad")+'</p><div class="qmap"><ul>'+
          '<li>'+E("q1")+'</li><li class="on">'+E("q2")+'</li><li>'+E("q3")+'</li><li>'+E("q4")+'</li></ul>'+
          '<span class="rose" aria-hidden="true">'+(A.compass?'<img src="'+A.compass.src+'" alt="">':'')+'</span></div></div>'+
        '<p class="ice">'+E("iceberg")+'</p>'+
      '</div></main>';
    setLead(lead, false);
    show(part, null);
    bind();
  }
  function tile(p, k){
    return '<button class="tile" type="button" data-go="'+p+'"><span class="n">'+(p+1)+' of 2</span><b>'+E(k)+'</b><span class="go-ic" aria-hidden="true">'+ARROW+'</span></button>';
  }
  /* part 1: the two market drawings, side by side (stacked with a down arrow on phones) */
  function mkFig(k){
    var key = k === "was"
      ? '<span class="legend"><span><i class="lg"></i>'+E("lbl_leadgen")+'</span></span>'
      : '<span class="legend"><span><i style="background:var(--c-cro)"></i>'+E("lbl_cro")+'</span><span><i style="background:var(--c-email)"></i>'+E("lbl_email")+'</span><span><i style="background:var(--c-pos)"></i>'+E("lbl_pos")+'</span></span>';
    return '<figure class="mk '+k+'"><span class="mk-h">'+E(k+"_h")+'</span>'+(k === "was" ? leadGen() : overlap())+'<figcaption class="call">'+E(k+"_call")+'</figcaption>'+key+'</figure>';
  }
  /* part 2: the before / after cards, fanned like trading cards ("b" in front, "a" peeking out behind) */
  function csCard(k){
    return '<div class="msg cs '+k+'" data-lead="'+k+'" role="button" tabindex="-1" aria-label="'+esc(COPY["case_"+k+"_h"])+'">'+
      '<div class="hd"><span>'+E("case_"+k+"_h")+'</span></div><span class="swap" aria-hidden="true">'+SWAP+'</span>'+
      '<div class="bd"><div class="quote">'+E("case_"+k)+'</div><div class="callnum">'+E("case_"+k+"n")+'</div><small>'+E("case_"+k+"s")+'</small></div></div>';
  }

  /* ---------- part 1 drawings (fixed seed, so they never change) ---------- */
  function rng(seed){ return function(){ seed = (seed*16807) % 2147483647; return (seed-1)/2147483646; }; }
  function dotsvg(x, y, r, fill, op){ return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(2)+'" fill="'+fill+'" fill-opacity="'+op+'"/>'; }
  var STAR = 'M0,-10 L2.7,-3.3 L9.6,-3.1 L4.3,1.4 L6,8.2 L0,4.4 L-6,8.2 L-4.3,1.4 L-9.6,-3.1 L-2.7,-3.3 Z';
  function leadGen(){
    var r = rng(7), h = '', cx = 100, cy = 100, R = 88;
    h += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+3)+'" fill="#FBEDEA" stroke="#A6342B" stroke-width="1.6"/>';
    for (var i=0;i<500;i++){
      var rad = 1.6 + Math.pow(r(),3)*9, a = r()*Math.PI*2, d = Math.sqrt(r())*(R-rad);
      h += dotsvg(cx + d*Math.cos(a), cy + d*Math.sin(a), rad, "#7C6A75", .5);
    }
    return '<svg class="mk-svg" viewBox="0 0 200 200" role="img" aria-label="Lead gen: hundreds of overlapping competitors">'+h+'</svg>';
  }
  function overlap(){
    var r = rng(11), h = '', C = [[76,78],[124,78],[100,120]], CR = 56;
    var col = ["var(--c-cro)","var(--c-email)","var(--c-pos)"];
    C.forEach(function(c,j){ h += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+CR+'" fill="'+col[j]+'" fill-opacity=".24" stroke="'+col[j]+'" stroke-width="1.6"/>'; });
    C.forEach(function(c, j){
      var placed = 0, tries = 0;
      while (placed < 100 && tries < 20000){
        tries++;
        var a = r()*Math.PI*2, d = Math.sqrt(r())*(CR-3), x = c[0]+d*Math.cos(a), y = c[1]+d*Math.sin(a);
        var k = C.filter(function(o){ return Math.hypot(x-o[0], y-o[1]) < CR-1; }).length;
        if (k >= 3) continue;
        if (k === 2 && r() > 0.15) continue;
        h += dotsvg(x, y, 1.1 + Math.pow(r(),3)*2.6, col[j], .7); placed++;
      }
    });
    [[86,92],[114,92],[91,110],[109,110]].forEach(function(p){ h += dotsvg(p[0], p[1], 2.4, "#152638", .55); });
    h += '<g transform="translate(100 98)"><circle r="14" fill="#17703F" fill-opacity=".18"/><path d="'+STAR+'" fill="#17703F"/></g>';
    return '<svg class="mk-svg" viewBox="0 0 200 200" role="img" aria-label="CRO, lifecycle email and positioning overlap; very few agencies sit where all three meet, and we are the star in the middle">'+h+'</svg>';
  }
  /* ---------- part 2 Venn (static: every circle and description always visible) ---------- */
  /* part 2 Venn: three dark circles, each labelled inside, on ice. Labels come from the copy titles. */
  function vlab(x, y, t){
    var w = String(t).split(" "), lines = w.length > 1 ? [w.slice(0, Math.ceil(w.length/2)).join(" "), w.slice(Math.ceil(w.length/2)).join(" ")] : [t];
    return '<text x="'+x+'" y="'+(y - (lines.length-1)*7)+'" text-anchor="middle" class="vt">'+lines.map(function(l,i){ return '<tspan x="'+x+'" dy="'+(i?14:0)+'">'+esc(l)+'</tspan>'; }).join("")+'</text>';
  }
  function VENN(){ return '<svg class="venn" viewBox="0 0 320 300" role="img" aria-label="Three overlapping circles: your customer, the market and your process. Your Contrarian POV sits where all three meet.">'+
    '<defs>'+[['cust','v-cust'],['mkt','v-mkt'],['proc','v-proc']].map(function(c){ return '<marker id="ah-'+c[0]+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--'+c[1]+')"/></marker>'; }).join('')+'</defs>'+
    '<path d="M58,2 C 58,20 66,34 78,50" fill="none" stroke="var(--v-cust)" stroke-width="1.8" marker-end="url(#ah-cust)"/>'+
    '<path d="M262,2 C 262,20 254,34 242,50" fill="none" stroke="var(--v-mkt)" stroke-width="1.8" marker-end="url(#ah-mkt)"/>'+
    '<path d="M160,298 L160,268" fill="none" stroke="var(--v-proc)" stroke-width="1.8" marker-end="url(#ah-proc)"/>'+
    '<g class="vc"><circle cx="124" cy="118" r="80" fill="var(--v-cust)"/>'+
    '<circle cx="196" cy="118" r="80" fill="var(--v-mkt)"/>'+
    '<circle cx="160" cy="182" r="80" fill="var(--v-proc)"/></g>'+
    '<circle cx="124" cy="118" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<circle cx="196" cy="118" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<circle cx="160" cy="182" r="80" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>'+
    '<circle cx="160" cy="151" r="34" fill="#FFFFFF" stroke="#17703F" stroke-width="2.4"/>'+
    vlab(80, 108, COPY.cust_t)+vlab(240, 108, COPY.mkt_t)+vlab(160, 238, COPY.proc_t)+
    '</svg>'; }

  /* ---------- the market cards ---------- */
  function setLead(v, animate){
    if (animate && v !== lead){ var old = $('.msg[data-lead="'+lead+'"]'); if (old){ old.classList.remove("leaving"); void old.offsetWidth; old.classList.add("leaving"); S.timeout(function(){ old.classList.remove("leaving"); }, 600); } }
    lead = v;
    $$(".msg").forEach(function(m){
      var front = m.getAttribute("data-lead") === v;
      m.classList.toggle("front", front); m.classList.toggle("back", !front);
      m.setAttribute("tabindex", front ? "-1" : "0");
      m.setAttribute("aria-pressed", String(front));
    });
    var n = $("#nudge"); if (n) n.hidden = v !== "b" && !editing;
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
    var ic = $(".ice"); if (ic) ic.hidden = p !== 1;   /* her closing line ends part 2 */
    markOneLine();
  }
  function go(p, dir){
    if (p === part) return;
    show(p, dir);
    var st = stage(), tl = $(".tiles"), pt = $('.part[data-part="'+p+'"]');
    if (st && pt) st.scrollTop = Math.max(0, pt.offsetTop - (tl ? tl.offsetHeight : 0) - 14);
    acc = 0; bottomSince = 0;
  }
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
      if (e.target.closest && e.target.closest(".stack")) return;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.5){
        if (dx < 0 && part === 0) go(1, "fwd");
        else if (dx > 0 && part === 1) go(0, "back");
      }
    }, {passive:true});
  }
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
    $$(".tile").forEach(function(t){ t.addEventListener("click", function(){
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
    wireGestures();
  }
  /* HivedIn-style: the fan tilts toward the mouse; near the back card it lifts out. Phones: tap the round button or swipe. */
  function wireStack(){
    var area = $(".cs-area"), stack = $("#stack"), fan = $("#fan"); if (!area || !stack || !fan) return;
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
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)*1.3) setLead(lead === "b" ? "a" : "b", true);
    }, {passive:true});
  }

  /* [copy-editing code removed] */

  render();

  return function destroy(){
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
