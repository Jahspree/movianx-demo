#!/usr/bin/env node
/**
 * bundle-pages.js — install the approved "Bundled Page" exports as the live site.
 * Copies the 3 self-contained HTML bundles into public/site/ and injects a small wiring + responsive
 * script before </body> in each:
 *   - rewires cross-page links (.dc.html → /  /creators  /explore) and CREATE/EXPLORE CTAs
 *   - makes the Portal cards stack + fit on mobile, and scale cleanly on large/TV screens
 * Fidelity-preserving: the original bundle markup/assets/animations are untouched.
 */
'use strict';
const fs = require('fs'), path = require('path');
const SRC = '/tmp/mx-zip/downloads';
const OUT = path.join(__dirname, '../public/site');
fs.mkdirSync(OUT, { recursive: true });

const MAP = [
  { src: 'MOVIANX Portal.html',     out: 'portal.html' },
  { src: 'MOVIANX Landing v2.html', out: 'creators.html' },
  { src: 'MOVIANX Experience.html', out: 'experience.html' },
];

// Injected at runtime AFTER the bundler renders the page. Self-contained, defensive.
const INJECT = `
<script>
(function(){
  function rewire(){
    // 1) cross-page links: .dc.html / portal / landing / experience -> clean routes
    document.querySelectorAll('a[href]').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if (/experience/i.test(h))       a.setAttribute('href','/explore');
      else if (/landing/i.test(h))     a.setAttribute('href','/creators');
      else if (/portal\\.dc|portal\\.html|^index/i.test(h)) a.setAttribute('href','/');
    });
    // 2) CTA fallback by text (in case an export shipped without an href)
    document.querySelectorAll('a').forEach(function(a){
      var t = (a.textContent||'').toUpperCase().replace(/\\s+/g,' ');
      if (/ENTER CREATOR PORTAL/.test(t))  a.setAttribute('href','/creators');
      if (/ENTER EXPLORER PORTAL/.test(t)) a.setAttribute('href','/explore');
    });
    // 3) logo/home links -> /
    document.querySelectorAll('a').forEach(function(a){
      var h=a.getAttribute('href')||'';
      if (/MOVIANX%20Portal|Portal\\.dc/i.test(h)) a.setAttribute('href','/');
    });
  }
  function responsive(){
    var w = window.innerWidth;
    var cards = document.querySelectorAll('[data-tilt][data-accent]');
    if (cards.length >= 2){
      var row = cards[0].parentElement;
      if (w <= 820){
        row.style.flexDirection = 'column';
        row.style.alignItems = 'stretch';
        row.style.gap = '16px';
        row.style.maxWidth = '440px';
        row.style.margin = '24px auto 0';
        cards.forEach(function(c){
          c.style.flex='1 1 auto'; c.style.width='100%'; c.style.maxWidth='100%';
          c.style.minHeight = w<=480 ? '300px':'360px';
        });
        Array.from(row.children).forEach(function(ch){
          if(!ch.hasAttribute('data-tilt')){ ch.style.flex='0 0 auto'; ch.style.padding='2px 0'; ch.style.minHeight='0'; }
        });
        // tighten CTA letter-spacing so it doesn't clip on narrow screens
        row.querySelectorAll('[data-cta] span, span').forEach(function(s){
          if (/ENTER (CREATOR|EXPLORER) PORTAL/.test((s.textContent||'').toUpperCase())) s.style.letterSpacing='0.12em';
        });
      } else {
        row.style.flexDirection=''; row.style.alignItems=''; row.style.gap='';
        row.style.maxWidth = w>=1700 ? '1180px' : ''; row.style.margin = w>=1700 ? '' : '';
        cards.forEach(function(c){ c.style.flex=''; c.style.width=''; c.style.maxWidth=''; c.style.minHeight=''; });
        Array.from(row.children).forEach(function(ch){ if(!ch.hasAttribute('data-tilt')){ ch.style.flex=''; ch.style.padding=''; ch.style.minHeight=''; }});
      }
    }
  }
  function run(){ try{ rewire(); responsive(); }catch(e){} }
  // the bundle renders async; poll + observe until content exists, then keep it wired
  var tries=0, iv=setInterval(function(){ tries++; run(); if (document.querySelector('a[href]') && tries>6 || tries>60) clearInterval(iv); },200);
  try { new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true}); } catch(e){}
  window.addEventListener('resize', function(){ try{responsive();}catch(e){} });
  window.addEventListener('load', run);
})();
</script>
`;

for (const m of MAP) {
  let html = fs.readFileSync(path.join(SRC, m.src), 'utf8');
  const idx = html.lastIndexOf('</body>');
  if (idx === -1) { console.error('no </body> in', m.src); continue; }
  html = html.slice(0, idx) + INJECT + '\n' + html.slice(idx);
  fs.writeFileSync(path.join(OUT, m.out), html);
  console.log('wrote public/site/' + m.out, '(' + (html.length/1024/1024).toFixed(1) + ' MB)');
}
console.log('done');
