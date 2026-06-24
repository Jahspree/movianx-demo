#!/usr/bin/env node
/**
 * bundle-pages.js — install the approved "Bundled Page" exports as the live site.
 * Copies the 3 self-contained HTML bundles into public/site/ and injects a wiring/responsive/
 * font/transition script before </body>:
 *   - rewires CTAs/nav to /  /creators  /explore
 *   - loads Inter + Inter Tight; remaps the Portal's Archivo → Inter Tight (brand spec)
 *   - stacks the Portal cards + fits text on mobile, adds bottom breathing room
 *   - smooth fade transition on page load + internal navigation
 * Original bundle markup/assets/animations are untouched.
 */
'use strict';
const fs = require('fs'), path = require('path');
const SRC = '/tmp/mx-zip/downloads';
const OUT = path.join(__dirname, '../public/site');
fs.mkdirSync(OUT, { recursive: true });

const MAP = [
  { src: 'MOVIANX Portal.html',     out: 'portal.html',     bg: '#020203' },
  { src: 'MOVIANX Landing v2.html', out: 'creators.html',   bg: '#FAFAF9' },
  { src: 'MOVIANX Experience.html', out: 'experience.html', bg: '#FAFAF9' },
];

const INJECT = (bg) => `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap">
<script>
(function(){
  var d = document, BG = ${JSON.stringify(bg)};
  // ---- page-transition overlay (survives bundler body re-render; never deadlocks on bfcache) ----
  // Bug fix: previously, on browser-Back the page restored from bfcache with the overlay still
  // 'covering' (opacity 1, pointer-events auto) from the outgoing navigation, so the Create/Explore
  // selector was unclickable until a refresh. Now a 'navigating' flag + a bfcache-aware pageshow
  // handler guarantee the overlay is cleared on return.
  var ov = d.createElement('div');
  ov.setAttribute('data-mx-overlay','1');
  ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:'+BG+';opacity:1;transition:opacity .45s ease;pointer-events:none;';
  var navigating = false;
  function attach(){ try{ if(!ov.isConnected) d.documentElement.appendChild(ov); }catch(e){} }
  function cover(){ attach(); ov.style.pointerEvents='auto'; ov.style.opacity='1'; }
  function uncover(){ attach(); ov.style.opacity='0'; ov.style.pointerEvents='none'; }
  cover();                                  // cover during the initial bundle decode
  function reveal(){ if (navigating) return; uncover(); }

  // ---- perf: pause infinite animations + drop GPU layers in OFFSCREEN sections ----
  // The bundles run continuous animations (marquee, node-graph float/nerve, ken-burns) even when
  // scrolled out of view, and pin ~22 will-change layers. That's the Explore scroll lag/freeze.
  // Pausing offscreen animations + releasing will-change is non-visual for anything on screen.
  var animIO = null;
  function perfStyle(){
    if (!d.getElementById('mx-perf-style')){           // re-add if the bundler wiped <head>
      var ps = d.createElement('style'); ps.id='mx-perf-style';
      ps.textContent='[data-mx-off] *{animation-play-state:paused !important;will-change:auto !important;}';
      (d.head||d.documentElement).appendChild(ps);
    }
  }
  function perfHarden(){
    perfStyle();
    if (!animIO){ try{ animIO = new IntersectionObserver(function(es){ es.forEach(function(e){
      if (e.isIntersecting) e.target.removeAttribute('data-mx-off'); else e.target.setAttribute('data-mx-off','');
    }); }, { rootMargin:'300px' }); }catch(e){ return; } }
    d.querySelectorAll('section').forEach(function(s){ if(!s.__mxObs){ s.__mxObs=1; try{ animIO.observe(s); }catch(e){} } });
  }

  function rewire(){
    d.querySelectorAll('a[href]').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if (/experience/i.test(h))            a.setAttribute('href','/explore');
      else if (/landing/i.test(h))          a.setAttribute('href','/creators');
      else if (/portal\\.dc|portal\\.html|MOVIANX%20Portal/i.test(h)) a.setAttribute('href','/');
    });
    d.querySelectorAll('a').forEach(function(a){
      var t = (a.textContent||'').toUpperCase().replace(/\\s+/g,' ');
      if (/ENTER CREATOR PORTAL/.test(t))  a.setAttribute('href','/creators');
      if (/ENTER EXPLORER PORTAL/.test(t)) a.setAttribute('href','/explore');
    });
  }
  function fonts(){
    // brand spec: Inter Tight for display, Inter for body. The Portal ships in Archivo — remap it.
    d.querySelectorAll('[style*="Archivo"]').forEach(function(el){
      el.style.fontFamily = el.style.fontFamily.replace(/Archivo/g, "'Inter Tight'");
    });
  }
  function responsive(){
    var w = window.innerWidth;
    var cards = d.querySelectorAll('[data-tilt][data-accent]');
    if (cards.length >= 2){
      var row = cards[0].parentElement;
      var rootPad = row.closest('[data-motion]') || d.body;
      if (w <= 820){
        row.style.flexDirection='column'; row.style.alignItems='stretch'; row.style.gap='16px';
        row.style.maxWidth='440px'; row.style.margin='24px auto 0';
        cards.forEach(function(c){ c.style.flex='1 1 auto'; c.style.width='100%'; c.style.maxWidth='100%'; c.style.minHeight = w<=480?'300px':'360px'; });
        Array.from(row.children).forEach(function(ch){ if(!ch.hasAttribute('data-tilt')){ ch.style.flex='0 0 auto'; ch.style.padding='2px 0'; ch.style.minHeight='0'; }});
        if (rootPad && rootPad.style) rootPad.style.paddingBottom = '72px';   // breathing room + bounce at the end
      } else {
        row.style.flexDirection=''; row.style.alignItems=''; row.style.gap='';
        row.style.maxWidth = w>=1700?'1180px':''; row.style.margin = w>=1700?'':'';
        cards.forEach(function(c){ c.style.flex=''; c.style.width=''; c.style.maxWidth=''; c.style.minHeight=''; });
        Array.from(row.children).forEach(function(ch){ if(!ch.hasAttribute('data-tilt')){ ch.style.flex=''; ch.style.padding=''; ch.style.minHeight=''; }});
        if (rootPad && rootPad.style) rootPad.style.paddingBottom='';
      }
    } else if (w <= 820 && d.body && d.body.style) {
      d.body.style.paddingBottom = '48px';
    }
  }
  function bindNav(){
    d.querySelectorAll('a[href^="/"]').forEach(function(a){
      if (a.__mxbound) return; a.__mxbound = 1;
      a.addEventListener('click', function(ev){
        var href = a.getAttribute('href') || '';
        if (/^\\/(creators|explore)?$/.test(href)){
          ev.preventDefault(); navigating = true; cover();
          setTimeout(function(){ window.location.href = href; }, 360);
        }
      });
    });
  }
  function run(){ try{ attach(); rewire(); fonts(); responsive(); bindNav(); perfHarden(); }catch(e){} }

  var tries = 0, iv = setInterval(function(){
    tries++; run();
    if (d.querySelector('a[data-tilt], nav a, h1, [data-mx-root]')) reveal();
    if (tries > 50){ reveal(); clearInterval(iv); }
  }, 150);
  try { new MutationObserver(run).observe(d.documentElement, { childList:true, subtree:true }); } catch(e){}
  window.addEventListener('resize', function(){ try{ responsive(); }catch(e){} });
  window.addEventListener('load', function(){ run(); setTimeout(reveal, 600); });
  // bfcache restore (browser Back/Forward): force the overlay clear so the selector is usable
  // again without a refresh — this is the Create/Explore navigation-lock fix.
  window.addEventListener('pageshow', function(e){ if (e.persisted){ navigating = false; uncover(); run(); } });
  // safety net: a tap when not mid-navigation guarantees the overlay is never a blocker
  window.addEventListener('pointerdown', function(){ if(!navigating) uncover(); }, true);
})();
</script>
`;

for (const m of MAP) {
  let html = fs.readFileSync(path.join(SRC, m.src), 'utf8');
  const idx = html.lastIndexOf('</body>');
  if (idx === -1) { console.error('no </body> in', m.src); continue; }
  html = html.slice(0, idx) + INJECT(m.bg) + '\n' + html.slice(idx);
  fs.writeFileSync(path.join(OUT, m.out), html);
  console.log('wrote public/site/' + m.out, '(' + (html.length/1024/1024).toFixed(1) + ' MB)');
}
console.log('done');
