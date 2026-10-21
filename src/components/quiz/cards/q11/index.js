/* Q11 One Table card (after Q11, before the loading screen).
   The card's own script from "Q11 One Table.html", ported for the quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed;
   - the table drawing's "Revenue Per Visitor™" label uses the card's own
     Montserrat (the quiz's "Montserrat" has no 900 weight);
   - lookups run inside the card's shadow root; every window listener,
     timer and both IntersectionObservers (rooms tick-in, chat reveal) stop
     when the screen closes;
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
  host.style.setProperty("--texture", 'url("'+A.texture.src+'")');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  /* {{text}} = green number, [[text]] = red number, **text** = accent. A line break in the copy shows as a line break. */
  function br(s){return String(s).replace(/\n/g,"<br>");}
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>').replace(/\*\*(.+?)\*\*/g,'<em>$1</em>'));}
  function E(k, rch){ var v = COPY[k]; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }

  /* hand-drawn arrows: straight down into the tiles (phones), curving in from the left margin (wide screens), and between the tiles */
  /* (callout arrows kept for reuse) */
  var A_DN = '<svg class="a-dn bob" viewBox="0 0 44 72" aria-hidden="true"><path d="M40 8C16 12 6 34 14 66"/><path d="M4 56l10 12 10-10"/></svg>';
  var A_SIDE = '<svg class="a-side bob" viewBox="0 0 150 74" aria-hidden="true"><path d="M30 4C20 36 64 62 140 58"/><path d="M127 46l13 12-14 10"/></svg>';
  var TARR = '<span class="tarr" aria-hidden="true"><svg viewBox="0 0 24 22"><path d="M2 12c6-3 12-3 18-.5"/><path d="M15 6.5l5.5 5-6 4"/></svg></span>';
  var GO_IC = '<svg class="go-ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var STAR = 'M0,-11 L3,-3.7 L10.6,-3.4 L4.8,1.6 L6.7,9.1 L0,4.9 L-6.7,9.1 L-4.8,1.6 L-10.6,-3.4 L-3,-3.7 Z';
  function star(sz){ return '<svg viewBox="-12 -12 24 24" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="'+STAR+'" fill="var(--green)"/></svg>'; }

  /* one colour per department, used on its room card, its seat and its chat messages */
  var C = {content:"#4F7FA8", ads:"#B0583D", cro:"#5D1B4E", cs:"#23727F"};
  var visited2 = false;

  function render(){
    var D = [["d_content",C.content],["d_ads",C.ads],["d_cro",C.cro],["d_cs",C.cs]];
    app.innerHTML =
      '<main class="stage" aria-label="Separate rooms versus one table"><div class="col">'+
        backButton()+
        '<h1>'+E("h1",1)+'</h1>'+
        '<p class="sub">'+E("sub")+'</p>'+
        '<nav class="tiles" aria-label="Two views">'+tile(0,1,"t1")+TARR+tile(1,2,"t2")+'</nav>'+
        '<section class="part" data-part="0" aria-label="View 1 of 2: separate rooms">'+
          '<div class="roomsbox" id="roomsbox"><span class="kick">'+E("rooms_h")+'</span><div class="rooms">'+
            D.map(function(d){ return '<div class="rm" style="--c:'+d[1]+'"><span class="n">'+E(d[0])+'</span><span class="r">'+E(d[0]+"_r")+'</span><span class="v">'+E(d[0]+"_v")+'</span></div>'; }).join("")+
          '</div><p class="others">'+E("others")+'</p>'+
          '<div class="revline"><span class="pair">'+E("rev_l")+'<b>'+E("rev_lv")+'</b></span><span class="ar">→</span><span class="pair">'+E("rev_t")+'<b>'+E("rev_tv")+'</b></span></div></div>'+
          '<p class="stuck">'+E("stuck")+'</p>'+
          '<div class="go"><button class="cta next" type="button" data-act="next">'+ctaLabel(COPY.next1)+'</button></div>'+
        '</section>'+
        '<section class="part" data-part="1" aria-label="View 2 of 2: one table" hidden>'+
          '<div class="tablebox">'+TABLE()+
            '<div class="north">'+star(26)+'<div><b>'+E("north_h")+'</b><span>'+E("north_s")+'</span></div></div></div>'+
          '<div class="chatwin">'+
            '<div class="chathead"><span class="hash">#</span><b>'+E("chan")+'</b><span class="avs"><i style="--c:'+C.ads+'"></i><i style="--c:'+C.cro+'"></i><i style="--c:'+C.cs+'"></i></span></div>'+
            '<div class="chatbody">'+
              sp("d_ads","c1")+sp("d_cro","c2","t_good","var(--red)")+sp("d_cro","c3")+sp("d_cs","c4","t_bad","var(--green)")+
              FIVE()+sp("d_ads","c5")+sp("d_cro","c6")+DECIDE()+
            '</div></div>'+
          '<p class="note">'+E("ex")+'</p>'+
          '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
            '<div class="upnext">'+E("up_next")+'</div></div>'+
        '</section>'+
      '</div></main>';
    show(part, null);
    bind();
  }
  function tile(p, n, k){
    return '<button class="tile'+(p === 1 && !visited2 ? ' pulse' : '')+'" type="button" data-go="'+p+'" data-n="'+n+'"><span class="top"><span class="n">'+n+'</span><b>'+E(k)+'</b>'+GO_IC+'</span><span class="s">'+E(k+"s")+'</span></button>';
  }
  function initials(n){ return String(n).replace(/[^A-Za-z& ]/g,"").split(/\s+|&/).filter(Boolean).slice(0,2).map(function(w){ return w[0]; }).join("").toUpperCase(); }
  /* a chat message; a tag (if any) hangs off the message it explains */
  function sp(whoK, k, tagK, tagCol){
    var col = C[whoK.replace("d_","")];
    var tg = tagK ? '<div class="react wait"><span class="mtag" style="--t:'+tagCol+'">'+E(tagK)+'</span></div>' : '';
    return '<div class="cmsg rv wait" data-who="'+whoK+'" style="--c:'+col+'"><span class="av">'+initials(COPY[whoK])+'</span><div><span class="who">'+E(whoK)+'</span><span class="dots"><i></i><i></i><i></i></span><div class="txt">'+E(k)+'</div>'+tg+'</div></div>';
  }
  function FIVE(){
    return '<div class="ccard rv wait"><span class="kick">'+E("plot_h")+'</span><span class="f-eq">'+E("five_h")+'</span>'+
      '<div class="f-chips"><span class="bl" aria-hidden="true">'+E("p1")+'</span><span class="hit">'+E("p2")+'</span><span class="bl" aria-hidden="true">'+E("p3")+'</span><span class="bl" aria-hidden="true">'+E("p4")+'</span><span class="bl" aria-hidden="true">'+E("p5")+'</span></div>'+
      '<span class="kick">'+E("gap_h")+'</span><div class="g-row"><span class="g-l">'+E("gap_l")+'</span><span class="g-t"><i></i><b></b></span><span class="g-p">'+E("gap_p")+'</span></div>'+
      '<div class="legend"><span><i></i>'+E("lg_cur")+'</span><span><i class="tg"></i>'+E("lg_tgt")+'</span></div></div>';
  }
  function DECIDE(){
    return '<div class="decide rv wait"><b>'+E("dec_h")+'</b><span class="d">'+E("dec",1)+'</span>'+
      '<div class="proj"><div><small>'+E("pj_a")+'</small><strong>'+E("pj_av")+'</strong></div><span class="pa">→</span><div><small>'+E("pj_b")+'</small><strong class="up">'+E("pj_bv")+'</strong></div></div></div>';
  }
  /* everyone at one table around Revenue Per Visitor™, drawn in perspective: people on the far side sit behind the table,
     people on the near side sit with their backs to us. The three speakers' halos light up as they talk. */
  function TABLE(){
    var G = "#17703F", cx = 160, cy = 104;
    var SPEAK = {0:["d_ads",C.ads], 3:["d_cro",C.cro], 7:["d_cs",C.cs]};
    function person(j){
      var a = -Math.PI/2 + j*2*Math.PI/10, sn = Math.sin(a), x = cx + 126*Math.cos(a), y = cy + 58*sn + (sn > 0 ? 8 : 0),
          sc = 0.78 + 0.32*(sn+1)/2, s = SPEAK[j], col = s ? s[1] : "#7E8BA1", far = sn < 0, fr = col;
      var g = '<g class="seat"'+(s?' data-seat="'+s[0]+'"':'')+' transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') scale('+sc.toFixed(2)+')">';
      g += '<circle class="ring" cx="0" cy="-16" r="19" fill="'+col+'" fill-opacity=".16" stroke="'+col+'" stroke-width="2.4" opacity="0" style="transition:opacity .3s"/>';
      var chair = '<rect x="-12" y="-30" width="24" height="30" rx="7" fill="#5B6880"/><rect x="-12" y="-30" width="24" height="30" rx="7" fill="url(#chairShade)"/>';
      var body = '<path d="M-12,2 C-12,-12 -7,-15 0,-15 C7,-15 12,-12 12,2 Z" fill="'+fr+'"/><path d="M-12,2 C-12,-12 -7,-15 0,-15 C7,-15 12,-12 12,2 Z" fill="url(#bodyShade)"/>'+
                 '<circle cx="0" cy="-22" r="7.5" fill="'+fr+'"/><circle cx="0" cy="-22" r="7.5" fill="url(#headShade)"/>';
      if (far) g += chair + body;                                              /* facing us, chair behind them */
      else g += body + '<rect x="-13" y="-3" width="26" height="12" rx="5" fill="#46536B"/><rect x="-13" y="-3" width="26" height="12" rx="5" fill="url(#chairShade)"/>'; /* backs to us, chair in front */
      return {far:far, y:y, svg:g+'</g>'};
    }
    var P = []; for (var j=0;j<10;j++) P.push(person(j));
    P.sort(function(a,b){ return a.y - b.y; });
    var h = '<svg class="table" viewBox="0 0 320 210" role="img" aria-label="Everyone who touches revenue seated around one table, with Revenue Per Visitor in the middle">'+
      '<defs>'+
        '<radialGradient id="top" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#FFFDFB"/><stop offset=".65" stop-color="#F1E2D9"/><stop offset="1" stop-color="#E4C8BC"/></radialGradient>'+
        '<linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="#9C7462"/><stop offset=".5" stop-color="#C79C88"/><stop offset="1" stop-color="#9C7462"/></linearGradient>'+
        '<linearGradient id="bodyShade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>'+
        '<radialGradient id="headShade" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>'+
        '<linearGradient id="chairShade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>'+
        '<filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'+
      '</defs>';
    h += '<ellipse cx="'+cx+'" cy="'+(cy+44)+'" rx="150" ry="40" fill="#152638" opacity=".16" filter="url(#soft)"/>';
    P.forEach(function(p){ if (p.far) h += p.svg; });
    /* the table: shadow, thick edge, top */
    h += '<ellipse cx="'+cx+'" cy="'+(cy+22)+'" rx="112" ry="40" fill="#152638" opacity=".22" filter="url(#soft)"/>';
    h += '<path d="M'+(cx-108)+','+cy+' L'+(cx-108)+','+(cy+12)+' A108,42 0 0 0 '+(cx+108)+','+(cy+12)+' L'+(cx+108)+','+cy+' Z" fill="url(#edge)"/>';
    h += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="108" ry="42" fill="url(#top)" stroke="#B48C79" stroke-width="1"/>';
    h += '<ellipse cx="'+cx+'" cy="'+cy+'" rx="94" ry="34" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>';
    /* Revenue Per Visitor™ at the centre of the table */
    h += '<ellipse cx="'+cx+'" cy="'+(cy-6)+'" rx="30" ry="12" fill="'+G+'" fill-opacity=".16" class="glow"/>';
    h += '<path transform="translate('+cx+' '+(cy-10)+') scale(.9)" d="'+STAR+'" fill="'+G+'"/>';
    h += '<text x="'+cx+'" y="'+(cy+14)+'" text-anchor="middle" font-family="Card Montserrat, system-ui, sans-serif" font-weight="900" font-size="10.5" fill="'+G+'">'+esc(COPY.rpv)+'</text>';
    P.forEach(function(p){ if (!p.far) h += p.svg; });
    return h + '</svg>';
  }

  /* ---------- the two views ---------- */
  var part = 0;
  function stage(){ return $(".stage"); }
  function show(p, dir){
    part = p;
    if (p === 1) visited2 = true;
    $$(".part").forEach(function(s){
      var on = +s.getAttribute("data-part") === p;
      s.hidden = !on; s.classList.remove("in-fwd","in-back");
      if (on && dir){ void s.offsetWidth; s.classList.add(dir === "fwd" ? "in-fwd" : "in-back"); }
    });
    $$(".tile").forEach(function(t){ var on = +t.getAttribute("data-go") === p; t.classList.toggle("on", on); t.setAttribute("aria-current", on ? "step" : "false"); if (visited2) t.classList.remove("pulse"); });
    if (p === 0) watchRooms();
    watchReveal();
  }
  function go(p, dir){
    if (p === part || !$('.part[data-part="'+p+'"]')) return;
    show(p, dir);
    var st = stage(), tl = $(".tiles"), pt = $('.part[data-part="'+p+'"]');
    if (st && pt) st.scrollTop = Math.max(0, pt.offsetTop - (tl ? tl.offsetHeight : 0) - 14);
    acc = 0; bottomSince = 0;
  }
  /* keep scrolling past the end of view 1 → view 2; swipe left/right switches views */
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
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.5){
        if (dx < 0 && part === 0) go(1, "fwd"); else if (dx > 0 && part === 1) go(0, "back");
      }
    }, {passive:true});
  }

  /* ---------- view 1: each department's number ticks in ---------- */
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches, roomsT = [], roomsIO = null;
  function playRooms(){
    var rs = $$(".rm"); roomsT.forEach(clearTimeout); roomsT = [];
    if (RM || editing){ rs.forEach(function(r){ r.classList.add("done"); }); return; }
    rs.forEach(function(r,i){ roomsT.push(S.timeout(function(){ r.classList.add("done"); }, 300 + i*420)); });
  }
  function watchRooms(){
    var rb = $("#roomsbox"); if (!rb) return;
    if (roomsIO) roomsIO.disconnect();
    if (RM || editing || !("IntersectionObserver" in window)){ playRooms(); return; }
    roomsIO = S.track(new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && e.intersectionRatio > .4){ roomsIO.disconnect(); playRooms(); } }); }, {root: stage(), threshold:[0,.4,1]}));
    roomsIO.observe(rb);
  }

  /* ---------- view 2: chat messages type, then appear, one after another, as the reader reaches them ---------- */
  var rvIO = null, rvQueue = [], rvBusy = false;
  function showNow(el){
    el.classList.remove("wait","typing"); el.classList.add("shown");
    var r = el.querySelector(".react.wait"); if (r) S.timeout(function(){ r.classList.remove("wait"); }, RM ? 0 : 450);
    var w = el.getAttribute && el.getAttribute("data-who");
    if (w) $$("[data-seat] .ring").forEach(function(g){ g.setAttribute("opacity", g.parentNode.getAttribute("data-seat") === w ? 1 : 0); });
  }
  function pump(){
    if (rvBusy || !rvQueue.length) return;
    rvBusy = true;
    var el = rvQueue.shift();
    if (el.classList.contains("cmsg") && !RM){
      el.classList.remove("wait"); el.classList.add("typing");
      S.timeout(function(){ showNow(el); S.timeout(function(){ rvBusy = false; pump(); }, el.querySelector(".react") ? 900 : 300); }, 560);
    } else { showNow(el); S.timeout(function(){ rvBusy = false; pump(); }, RM ? 0 : 500); }
  }
  function revealAll(){ $$(".rv").forEach(showNow); $$(".react.wait").forEach(function(r){ r.classList.remove("wait"); }); }
  function watchReveal(){
    if (rvIO) rvIO.disconnect();
    if (editing || RM || !("IntersectionObserver" in window)){ revealAll(); return; }
    rvIO = S.track(new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting && e.target.classList.contains("wait") && rvQueue.indexOf(e.target) < 0){ rvQueue.push(e.target); rvIO.unobserve(e.target); }
      });
      rvQueue.sort(function(a,b){ return a.compareDocumentPosition(b) & 2 ? 1 : -1; });
      pump();
    }, {root: stage(), rootMargin:"0px 0px -12% 0px", threshold:0.01}));
    $$(".part:not([hidden]) .rv.wait").forEach(function(el){ rvIO.observe(el); });
  }

  var rt = null;

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
