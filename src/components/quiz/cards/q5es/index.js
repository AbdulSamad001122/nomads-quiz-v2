/* Q5E SLG Estelle card (after Q5, answer E, SLG path).
   The card's own script from "Q5E SLG Estelle Card.html", ported for the
   quiz:
   - preview chrome (grey bar, stand-in header) and copy editing removed,
     including the editor-only calendar inputs (.ebox);
   - lookups run inside the card's shadow root; every window listener,
     timer and the calendars' IntersectionObserver stop when the screen
     closes;
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

  var COPY = COPY_JSON;
  var A = ASSETS;
    var editing = false;
  host.style.setProperty("--texture", 'url("'+A.texture.src+'")');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  /* {{text}} = green (after) number, [[text]] = red (before) number */
  function br(s){return String(s).replace(/\n/g,"<br>");}
  function rich(s){return br(esc(s).replace(/\{\{(.+?)\}\}/g,'<span class="o">$1</span>').replace(/\[\[(.+?)\]\]/g,'<span class="t">$1</span>'));}
  function E(k, rch){ var v = COPY[k]; return '<span data-k="'+k+'"'+(rch?' data-rich':'')+'>'+(rch?rich(v):br(esc(v)))+'</span>'; }
  function $(s){ return app.querySelector(s); }
  function $$(s){ return app.querySelectorAll(s); }
  var QPATH = "M15.5 3.2C8.6 5.3 2.4 11.4 2 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1zM36.5 3.2C29.6 5.3 23.4 11.4 23 19.6c-.3 6 3.2 9.6 7.6 9.4 4.2-.2 7-3.4 6.6-7.2-.4-3.6-3.3-5.6-6.6-5.2 1-4.6 4.4-8.4 7.4-10.2.9-.6.7-2.1-.4-2.2-.4 0-.7 0-1.1-.1z";
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5c5-.8 10-1 15-.4M14 6.5l5.5 5.6-5.8 5.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function render(){
    var c = COPY.cal;
    app.innerHTML =
      '<main class="stage" aria-label="Case study: Estelle Winsett"><div class="col">'+
        backButton()+
        '<div class="said"><div class="top">'+QM+'<span class="lbl">'+E("echo_label")+'</span></div><span class="txt">'+E("echo")+QE+'</span></div>'+
        '<p class="hook">'+E("hook")+'</p>'+
        '<h1>'+E("h1",1)+'</h1>'+
        '<p class="context">'+E("context")+'</p>'+
        '<div class="compare">'+
          '<div class="side before"><span class="tag">'+E("before_label")+'</span><div class="what">'+E("before_what")+'</div><div class="body">'+
            '<div class="stat">'+E("before_stat")+'<small>'+E("before_sub")+'</small></div>'+
            '<div class="cal" id="cal-before" role="img" aria-label="One month: '+c.before_per_month+' sales calls"></div>'+
          '</div></div>'+
          '<span class="then" aria-hidden="true">'+ARROW+'</span>'+
          '<div class="side after"><span class="tag">'+E("after_label")+'</span><div class="what">'+E("after_what")+'</div><div class="body">'+
            '<div class="stat">'+E("after_stat")+'<small>'+E("after_sub")+'</small></div>'+
            '<div class="cal" id="cal-after" role="img" aria-label="One month: '+c.after_per_week+' sales calls every week"></div>'+
          '</div></div>'+
        '</div>'+
        '<div class="cbox">'+'<div class="built"><div class="sec-h"><img src="'+A.compass.src+'" alt="">'+E("built_h")+'</div><ol class="steps">'+
          '<li><span class="n">1</span>'+E("built_1")+'</li><li><span class="n">2</span>'+E("built_2")+'</li><li><span class="n">3</span>'+E("built_3")+'</li></ol></div>'+
        '<div class="shots">'+shot("shot_results")+shot("shot_comments")+'</div>'+
        '<div class="result">'+
          '<div>'+E("r0")+'<small>'+E("r0s")+'</small></div>'+
          '<div>'+E("r1")+'<small>'+E("r1s")+'</small></div>'+
          '<div>'+E("r2")+'<small>'+E("r2s")+'</small></div></div>'+
        '</div>'+'<p class="why"><b>'+E("why_label")+'</b>'+E("why")+'</p>'+
        '<div class="go"><button class="cta" type="button" data-act="cta">'+ctaLabel(COPY.cta)+'</button>'+
          '<div class="upnext">'+E("up_next")+'</div></div>'+
        '<div class="quad"><p class="quad-h">'+E("quad")+'</p><div class="qmap"><ul>'+
          '<li>'+E("q1")+'</li><li>'+E("q2")+'</li><li class="on">'+E("q3")+'</li><li>'+E("q4")+'</li></ul>'+
          '<span class="rose" aria-hidden="true"><img src="'+A.compass.src+'" alt=""></span></div></div>'+
      '</div></main>';
    drawCals(COPY.cal);
    placeThen();
    markOneLine();
    watchCals();
    bind();
  }
  var QM = '<svg class="qm" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  var QE = '<svg class="qe" viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="'+QPATH+'"/></svg>';
  function shot(k){
    var img = A[k];
    return '<figure class="shot"><div class="frame'+(img?' has':'')+'">'+
      (img ? '<img src="'+img.src+'" alt="'+esc(COPY[k])+'">' : '<span class="ph">Screenshot<br>to come</span>')+
      '</div></figure>';
  }

  /* arrow badge sits between the cards, just above where the calendars start (600px and up) */
  var WIDE = window.matchMedia("(min-width: 600px)");
  function placeThen(){
    var t = $(".then"), b = $("#cal-before"), c = $(".compare"); if (!t || !b || !c) return;
    if (!WIDE.matches){ t.style.top = ""; return; }
    var r = b.getBoundingClientRect(), cr = c.getBoundingClientRect();
    t.style.top = (r.top - cr.top - t.offsetHeight - 8) + "px";
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

  /* ---------- calendars: one month, booked days lit ---------- */
  function spread(n, slots){ var out = []; if (n <= 0) return out; for (var k=0;k<n;k++) out.push(slots[Math.min(slots.length-1, Math.floor((k+0.5)*slots.length/n))]); return out; }
  function drawCal(id, days){
    var el = root.getElementById(id); if (!el) return;
    var h = '';
    ["M","T","W","T","F","S","S",""].forEach(function(x){ h += '<span class="h">'+x+'</span>'; });
    var seq = 0;
    for (var w=0; w<4; w++){
      var n = 0;
      for (var d=0; d<7; d++){ var i = w*7+d, on = days.indexOf(i) > -1; if (on){ n++; h += '<i class="on" style="--n:'+(seq++)+'"></i>'; } else h += '<i></i>'; }
      h += '<span class="wk'+(n?' n':'')+'">'+(n||"–")+'</span>';
    }
    el.innerHTML = h;
  }
  function drawCals(c){
    var weekdays = []; for (var w=0; w<4; w++) for (var d=0; d<5; d++) weekdays.push(w*7+d);
    var bm = Math.max(0, Math.min(28, c.before_per_month|0)), aw = Math.max(0, Math.min(7, c.after_per_week|0));
    /* before: the month's calls scattered on weekdays; after: the same weekly pattern every week */
    var before = bm === 3 ? [1,15,24] : spread(bm, bm > 20 ? Array.from({length:28},function(_,i){return i;}) : weekdays);
    /* after: the same number of calls every week, on different days each week so it reads like a real calendar */
    var WEEKS3 = [[0,2,3],[1,3,4],[0,1,4],[1,2,4]];
    var after = [];
    for (var w=0; w<4; w++){
      var days;
      if (aw === 3) days = WEEKS3[w];
      else {
        var pool = aw > 5 ? [0,1,2,3,4,5,6] : [0,1,2,3,4], seed = 7*(w+1)+aw;
        days = pool.map(function(x){ return [x, Math.sin(seed*(x+3))]; }).sort(function(a,b){ return a[1]-b[1]; }).slice(0, aw).map(function(p){ return p[0]; });
      }
      days.forEach(function(d){ after.push(w*7+d); });
    }
    after.sort(function(a,b){ return a-b; });
    drawCal("cal-before", before); drawCal("cal-after", after);
  }
  /* booked days fill in once, when the calendars scroll into view */
  var played = false;
  function watchCals(){
    var cals = $$(".cal"); if (played || !("IntersectionObserver" in window)) return;
    cals.forEach(function(c){ c.classList.add("wait"); });
    var io = S.track(new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting && e.intersectionRatio > .6){ e.target.classList.remove("wait"); e.target.classList.add("anim"); io.unobserve(e.target); } });
      if (!$$(".cal.wait").length) played = true;
    }, {root: $(".stage"), threshold: [0, .6, 1]}));
    cals.forEach(function(c){ io.observe(c); });
  }

  var rt = null;
  S.on(window, "resize", function(){ clearTimeout(rt); rt = S.timeout(function(){ placeThen(); markOneLine(); }, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (!S.alive) return; placeThen(); markOneLine(); });

  function bind(){
    $('[data-act="nc-back"]').addEventListener("click", function(){ back(); });
    $('[data-act="cta"]').addEventListener("click", function(){
      if (editing) return;
      complete();
    });
  }

  /* [copy-editing code removed] */

  render();

  return function destroy(){
    S.destroy();
    host.style.removeProperty('--texture');
  };
}
