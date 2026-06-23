#!/usr/bin/env node
/**
 * dc-to-react.js — convert the approved Movianx "Director Component" HTML exports into faithful
 * Next.js client components. Preserves markup, styles and animation scripts exactly; only:
 *   - <image-slot src=X> → <div> with background-image (no DC image runtime needed)
 *   - cross-page links → app routes (/ /creators /explore)
 *   - media/* and logo-* → real repo assets
 *   - {{ motionAttr }} → "on"
 *   - the original dc-script class is run in useEffect via a tiny DCLogic shim
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DL = '/Users/jahspringer/Downloads';
const OUT = path.join(__dirname, '../src/app/movianx/generated');
fs.mkdirSync(OUT, { recursive: true });

// media/logo → real repo assets (on-brand)
const ASSET = {
  'logo-mark.png': '/movianx-logo.png',
  'logo-mark-red.png': '/movianx-logo.png',
  'logo-full.png': '/movianx-logo.png',
  'media/hero-still.png': '/images/backgrounds/hero-cinematic.jpg',
  'media/nosferatu.png': '/images/movies/nosferatu.jpg',
  'media/series-eye.png': '/images/generated-live/content/wave-2-atmospheric-mystery/rail.jpg',
  'media/woman-red.png': '/images/wraith/portrait.jpg',
  'media/singer.png': '/images/wraith/performance-red.png',
  'media/podcast-90s.png': '/images/music/velvet-static.jpg',
  'media/family-nosferatu.png': '/images/movies-noir-city.jpg',
  'media/skull-tee.png': '/images/wraith/editorial.png',
  'media/siphon-comic.png': '/images/stories/city-of-glass.jpg',
  'media/mystery-face.png': '/images/generated-live/content/wave-2-atmospheric-mystery/thumbnail.jpg',
  'media/cine-create-live.png': '/images/creators/director-noir.jpg',
  'media/cine-stream-ecosystem.png': '/images/creators/spotlight-lab.jpg',
  'media/cine-own-world.png': '/images/creators/sound-architect.jpg',
  'media/creator-still.png': '/images/creators/visual-poet.jpg',
  'media/hp-founders.png': '/images/wraith/hero-red.png',
  'media/hp-black.png': '/images/wraith/studio-red.png',
};
const LINK = {
  'MOVIANX%20Portal.dc.html': '/',
  'MOVIANX%20Landing%20v2.dc.html': '/creators',
  'MOVIANX%20Experience.dc.html': '/explore',
  'MOVIANX Portal.dc.html': '/',
  'MOVIANX Landing v2.dc.html': '/creators',
  'MOVIANX Experience.dc.html': '/explore',
};
function mapAsset(src) {
  if (ASSET[src]) return ASSET[src];
  if (src.startsWith('media/')) return '/images/backgrounds/hero-cinematic.jpg'; // safe on-brand fallback
  return src;
}

function between(s, startRe, endStr) {
  const m = s.match(startRe);
  if (!m) return null;
  const start = m.index;
  const end = s.indexOf(endStr, start);
  return s.slice(start, end + endStr.length);
}

// convert an <image-slot .../></image-slot> (or self-closing) to a <div> with bg
function convertImageSlots(html) {
  return html.replace(/<image-slot\b([^>]*?)>(<\/image-slot>)?/g, (full, attrs) => {
    const get = (n) => { const m = attrs.match(new RegExp(n + '="([^"]*)"')); return m ? m[1] : null; };
    const id = get('id');
    const src = mapAsset(get('src') || '');
    const style = get('style') || '';
    const radius = get('radius');
    const shape = get('shape');
    const dataCat = attrs.match(/data-cat-img="([^"]*)"/);
    let extra = `background-image:url('${src}'); background-size:cover; background-position:center; background-color:#0b0b0c;`;
    if (shape === 'rounded' && radius) extra += ` border-radius:${radius}px;`;
    const idAttr = id ? ` id="${id}"` : '';
    const catAttr = dataCat ? ` data-cat-img="${dataCat[1]}"` : '';
    return `<div${idAttr}${catAttr} style="${style}; ${extra}"></div>`;
  });
}

function transform(file, compName) {
  let raw = fs.readFileSync(path.join(DL, file), 'utf8');

  // 1) style (inside helmet)
  let style = between(raw, /<style>/, '</style>');
  style = style.replace(/^<style>/, '').replace(/<\/style>$/, '');
  // keep keyframes/resets; neutralise global html/body background so client-nav doesn't bleed
  style = style.replace(/html\s*,\s*body\s*\{[^}]*\}/g, 'html,body{margin:0;padding:0;}');

  // 2) markup: the root div (data-mx-root or data-motion) up to the last </div> before </x-dc>
  const rootStart = raw.search(/<div data-mx-root|<div data-motion/);
  const xdcEnd = raw.indexOf('</x-dc>');
  let markup = raw.slice(rootStart, xdcEnd).trim();
  // strip trailing whitespace/newlines
  markup = markup.replace(/\s+$/, '');

  // 3) dc-script class body
  let script = between(raw, /<script type="text\/x-dc"[^>]*>/, '</script>');
  script = script.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');

  // ---- transforms on markup + style ----
  const applyCommon = (s) => {
    for (const [k, v] of Object.entries(LINK)) s = s.split(k).join(v);
    s = s.replace(/\{\{\s*motionAttr\s*\}\}/g, 'on');
    return s;
  };
  markup = convertImageSlots(markup);
  markup = applyCommon(markup);
  // remap any remaining logo/media srcs in <img>/url()
  for (const [k, v] of Object.entries(ASSET)) markup = markup.split(k).join(v);
  markup = markup.replace(/url\('?(media\/[a-z0-9-]+\.png)'?\)/g, (m, p) => `url('${mapAsset(p)}')`);
  markup = markup.replace(/(src|mask|-webkit-mask)=?:?\s*url\('?(logo-[a-z-]*\.png)'?\)/g, (m) => m.split(/logo-[a-z-]*\.png/).join('/movianx-logo.png'));
  markup = markup.split('logo-mark-red.png').join('/movianx-logo.png')
                 .split('logo-mark.png').join('/movianx-logo.png')
                 .split('logo-full.png').join('/movianx-logo.png');

  // ---- emit component ----
  const comp = `"use client";
/* AUTO-GENERATED from approved design "${file}". Do not hand-edit; regenerate via scripts/dc-to-react.js */
import { useEffect, useRef } from "react";

const STYLE = ${JSON.stringify(style)};
const MARKUP = ${JSON.stringify(markup)};

export default function ${compName}() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // minimal DC runtime shim
    class DCLogic { constructor(){ this.props = { motionEnabled: true }; } }
    let instance;
    try {
      ${script.replace(/document\.querySelector(All)?\(/g, 'root.querySelector$1(')}
      instance = new Component();
      instance.componentDidMount && instance.componentDidMount();
    } catch (e) { /* non-fatal: animations degrade gracefully */ console.warn('dc init', e); }
    // style-hover shim (handled by the DC runtime in the original)
    const hov = [];
    root.querySelectorAll('[style-hover]').forEach((el) => {
      const base = el.getAttribute('style') || '';
      const over = el.getAttribute('style-hover') || '';
      const on = () => { el.setAttribute('style', base + ';' + over); };
      const off = () => { el.setAttribute('style', base); };
      el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
      hov.push(() => { el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off); });
    });
    return () => { try { instance && instance.componentWillUnmount && instance.componentWillUnmount(); } catch(e){} hov.forEach(f=>f()); };
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
`;
  fs.writeFileSync(path.join(OUT, compName + '.jsx'), comp);
  console.log('wrote', compName + '.jsx', '(' + markup.length + ' bytes markup)');
}

transform('MOVIANX Portal.dc.html', 'PortalDC');
transform('MOVIANX Landing v2.dc.html', 'LandingV2DC');
transform('MOVIANX Experience.dc.html', 'ExperienceDC');
console.log('done');
