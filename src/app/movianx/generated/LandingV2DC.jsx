"use client";
/* AUTO-GENERATED from approved design "MOVIANX Landing v2.dc.html". Do not hand-edit; regenerate via scripts/dc-to-react.js */
import { useEffect, useRef } from "react";

const STYLE = "\n  * { box-sizing: border-box; }\n  html,body{margin:0;padding:0;}\n  body { -webkit-font-smoothing: antialiased; }\n  ::selection { background: #D90429; color: #fff; }\n  image-slot { display:block; }\n  a { color: inherit; text-decoration: none; }\n  @keyframes mx-sheen { 0% { background-position: 0% 50%; } 100% { background-position: -200% 50%; } }\n  @keyframes mx-ken { 0% { transform: scale(1.08); } 100% { transform: scale(1.22); } }\n  @keyframes mx-cue { 0% { transform: translateY(0); opacity:.9; } 70% { opacity:.2;} 100% { transform: translateY(11px); opacity:0; } }\n  @media (max-width: 820px){ .mx-hide-sm { display:none !important; } }\n";
const MARKUP = "<div data-mx-root style=\"position:relative; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; color:#0E0E0E; background:#FAFAF9; overflow-x:hidden;\">\n\n  <!-- ===================== NAV ===================== -->\n  <nav style=\"position:fixed; top:0; left:0; right:0; z-index:60; backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%); background:rgba(250,250,249,0.6); border-bottom:1px solid rgba(0,0,0,0.06);\">\n    <div style=\"display:flex; align-items:center; justify-content:space-between; max-width:1320px; margin:0 auto; padding:15px 40px;\">\n      <a href=\"#\" data-magnetic style=\"display:flex; align-items:center; gap:11px;\">\n        <img src=\"/movianx-logo.png\" alt=\"Movianx\" style=\"height:26px; width:auto; display:block;\" />\n        <span style=\"font-family:'Inter Tight'; font-weight:700; font-size:16px; letter-spacing:0.14em;\">MOVIANX</span>\n      </a>\n      <div class=\"mx-hide-sm\" style=\"display:flex; align-items:center; gap:38px; font-size:13.5px; font-weight:500; letter-spacing:0.01em; color:#5a5a58;\">\n        <a href=\"#create\" style=\"\" style-hover=\"color:#0E0E0E;\">Studio</a>\n        <a href=\"#vision\" style=\"\" style-hover=\"color:#0E0E0E;\">Vision</a>\n        <a href=\"#access\" style=\"\" style-hover=\"color:#0E0E0E;\">Access</a>\n      </div>\n      <a href=\"#access\" data-magnetic style=\"display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:100px; background:#D90429; color:#fff; font-size:13.5px; font-weight:600; box-shadow:0 8px 24px rgba(217,4,41,0.26);\">Request access</a>\n    </div>\n  </nav>\n\n  <!-- ===================== HERO ===================== -->\n  <section style=\"position:relative; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 24px 80px;\">\n    <!-- faint grid -->\n    <div style=\"position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(#F0EFEC 1px, transparent 1px), linear-gradient(90deg,#F0EFEC 1px, transparent 1px); background-size:72px 72px; -webkit-mask-image:radial-gradient(120% 90% at 50% 35%, #000 0%, transparent 75%); mask-image:radial-gradient(120% 90% at 50% 35%, #000 0%, transparent 75%);\"></div>\n\n    <div data-reveal style=\"position:relative; font-size:12px; font-weight:600; letter-spacing:0.32em; text-transform:uppercase; color:#9a9a97;\">The AI-native creator ecosystem</div>\n\n    <!-- signature logo moment: metallic sheen M, cursor tilt + parallax -->\n    <div data-parallax=\"0.06\" style=\"position:relative; perspective:900px; margin:30px 0 6px;\">\n      <div data-tilt style=\"position:relative; width:min(40vw,168px); aspect-ratio:844 / 863; transition:transform .25s cubic-bezier(.2,.7,.2,1); will-change:transform; filter:drop-shadow(0 18px 40px rgba(0,0,0,0.18));\">\n        <img src=\"/movianx-logo.png\" alt=\"Movianx\" style=\"position:absolute; inset:0; width:100%; height:100%; object-fit:contain;\" />\n        <div style=\"position:absolute; inset:0; -webkit-mask:url('/movianx-logo.png') center/contain no-repeat; mask:url('/movianx-logo.png') center/contain no-repeat; background:linear-gradient(110deg, #1c1c1f 0%, #4a4a50 22%, #d6d6dc 42%, #f4f4f6 50%, #d6d6dc 58%, #4a4a50 78%, #1c1c1f 100%); background-size:300% 100%; animation:mx-sheen 7s linear infinite;\"></div>\n      </div>\n    </div>\n\n    <h1 data-reveal data-delay=\"80\" style=\"position:relative; margin:18px 0 0; font-family:'Inter Tight'; font-weight:600; font-size:clamp(40px,6.6vw,88px); line-height:0.98; letter-spacing:-0.035em; max-width:14ch;\">Where creativity becomes reality.</h1>\n\n    <p data-reveal data-delay=\"160\" style=\"position:relative; margin:22px 0 0; font-size:clamp(15px,1.5vw,18px); line-height:1.55; color:#6a6a67; max-width:30ch;\">Film, music, stories and worlds &mdash; created, streamed and owned by the people who make them.</p>\n\n    <!-- email capture -->\n    <div data-reveal data-delay=\"240\" id=\"access\" style=\"position:relative; scroll-margin-top:90px; display:flex; align-items:center; gap:8px; margin-top:34px; padding:7px 7px 7px 20px; border-radius:100px; background:#fff; border:1px solid #E6E5E2; box-shadow:0 18px 50px rgba(0,0,0,0.08);\">\n      <input type=\"email\" placeholder=\"Enter your email\" style=\"border:none; outline:none; background:transparent; font-family:inherit; font-size:15px; color:#0E0E0E; width:min(52vw,250px);\" />\n      <button data-magnetic style=\"display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border:none; border-radius:100px; background:#D90429; color:#fff; font-size:14.5px; font-weight:600; cursor:pointer; white-space:nowrap; box-shadow:0 10px 26px rgba(217,4,41,0.3);\">Request access <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"13 6 19 12 13 18\"></polyline></svg></button>\n    </div>\n    <div data-reveal data-delay=\"300\" style=\"position:relative; margin-top:15px; font-size:12.5px; color:#a3a3a0; letter-spacing:0.02em;\">Early access &nbsp;&middot;&nbsp; No spam &nbsp;&middot;&nbsp; Built for creators</div>\n\n    <div style=\"position:absolute; left:50%; bottom:26px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; color:#b5b5b2;\">\n      <span style=\"font-size:10px; letter-spacing:0.28em; text-transform:uppercase;\">Scroll</span>\n      <span style=\"position:relative; width:1px; height:34px; background:#dcdbd7; overflow:hidden;\"><span style=\"position:absolute; top:0; left:0; width:1px; height:14px; background:#0E0E0E; animation:mx-cue 1.8s ease-in-out infinite;\"></span></span>\n    </div>\n  </section>\n\n  <!-- ===================== STACK-WIPE CINEMATIC SECTIONS ===================== -->\n  <div id=\"create\" style=\"position:relative; scroll-margin-top:0;\">\n\n    <section style=\"position:sticky; top:0; z-index:1; height:100vh; overflow:hidden; background:#0C0C0D;\">\n      <div data-parallax-img style=\"position:absolute; inset:-8% 0; will-change:transform;\">\n        <div id=\"mx-cine-1\" style=\"position:absolute; inset:0; width:100%; height:100%; animation:mx-ken 16s ease-in-out infinite alternate;; background-image:url(''); background-size:cover; background-position:center; background-color:#0b0b0c;\"></div>\n      </div>\n      <div style=\"position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.34) 45%, rgba(0,0,0,0.1) 100%);\"></div>\n      <div style=\"position:absolute; inset:0; display:flex; align-items:center;\">\n        <div style=\"max-width:1320px; width:100%; margin:0 auto; padding:0 40px; color:#fff;\">\n          <div data-cine style=\"max-width:620px;\">\n            <div style=\"font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.55);\">01 &mdash; Create</div>\n            <h2 style=\"margin:18px 0 0; font-family:'Inter Tight'; font-weight:600; font-size:clamp(34px,5vw,68px); line-height:1.0; letter-spacing:-0.03em;\">Tools that move at the speed of imagination.</h2>\n            <p style=\"margin:22px 0 0; font-size:clamp(15px,1.4vw,18px); line-height:1.6; color:rgba(255,255,255,0.7); max-width:46ch;\">Produce films, music, podcasts and immersive worlds with AI as your crew &mdash; from first spark to final cut.</p>\n            <a href=\"#access\" data-magnetic style=\"display:inline-flex; align-items:center; gap:10px; margin-top:30px; font-size:14.5px; font-weight:600; color:#fff; border-bottom:1px solid rgba(255,255,255,0.4); padding-bottom:4px;\">Explore the studio <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"13 6 19 12 13 18\"></polyline></svg></a>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <section style=\"position:sticky; top:0; z-index:2; height:100vh; overflow:hidden; background:#0C0C0D;\">\n      <div data-parallax-img style=\"position:absolute; inset:-8% 0; will-change:transform;\">\n        <div id=\"mx-cine-2\" style=\"position:absolute; inset:0; width:100%; height:100%; animation:mx-ken 18s ease-in-out infinite alternate;; background-image:url(''); background-size:cover; background-position:center; background-color:#0b0b0c;\"></div>\n      </div>\n      <div style=\"position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0.74) 100%);\"></div>\n      <div style=\"position:absolute; inset:0; display:flex; align-items:center; justify-content:flex-end;\">\n        <div style=\"max-width:1320px; width:100%; margin:0 auto; padding:0 40px; color:#fff; display:flex; justify-content:flex-end;\">\n          <div data-cine style=\"max-width:620px; text-align:right;\">\n            <div style=\"font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.55);\">02 &mdash; Stream</div>\n            <h2 style=\"margin:18px 0 0; font-family:'Inter Tight'; font-weight:600; font-size:clamp(34px,5vw,68px); line-height:1.0; letter-spacing:-0.03em;\">Your audience, in one place.</h2>\n            <p style=\"margin:22px 0 0; margin-left:auto; font-size:clamp(15px,1.4vw,18px); line-height:1.6; color:rgba(255,255,255,0.7); max-width:46ch;\">Premiere, go live, and host watch parties &mdash; and build a community that belongs to you, not an algorithm.</p>\n            <a href=\"#access\" data-magnetic style=\"display:inline-flex; align-items:center; gap:10px; margin-top:30px; font-size:14.5px; font-weight:600; color:#fff; border-bottom:1px solid rgba(255,255,255,0.4); padding-bottom:4px;\">See how it works <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"13 6 19 12 13 18\"></polyline></svg></a>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <section style=\"position:sticky; top:0; z-index:3; height:100vh; overflow:hidden; background:#0C0C0D;\">\n      <div data-parallax-img style=\"position:absolute; inset:-8% 0; will-change:transform;\">\n        <div id=\"mx-cine-3\" style=\"position:absolute; inset:0; width:100%; height:100%; animation:mx-ken 17s ease-in-out infinite alternate;; background-image:url(''); background-size:cover; background-position:center; background-color:#0b0b0c;\"></div>\n      </div>\n      <div style=\"position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.34) 45%, rgba(0,0,0,0.1) 100%);\"></div>\n      <div style=\"position:absolute; inset:0; display:flex; align-items:center;\">\n        <div style=\"max-width:1320px; width:100%; margin:0 auto; padding:0 40px; color:#fff;\">\n          <div data-cine style=\"max-width:620px;\">\n            <div style=\"font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.55);\">03 &mdash; Own</div>\n            <h2 style=\"margin:18px 0 0; font-family:'Inter Tight'; font-weight:600; font-size:clamp(34px,5vw,68px); line-height:1.0; letter-spacing:-0.03em;\">Creativity becomes ownership.</h2>\n            <p style=\"margin:22px 0 0; font-size:clamp(15px,1.4vw,18px); line-height:1.6; color:rgba(255,255,255,0.7); max-width:46ch;\">Memberships, drops and commerce that turn your craft into a living &mdash; and your work into something you keep.</p>\n            <a href=\"#access\" data-magnetic style=\"display:inline-flex; align-items:center; gap:10px; margin-top:30px; font-size:14.5px; font-weight:600; color:#fff; border-bottom:1px solid rgba(255,255,255,0.4); padding-bottom:4px;\">Explore ownership <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"13 6 19 12 13 18\"></polyline></svg></a>\n          </div>\n        </div>\n      </div>\n    </section>\n\n  </div>\n\n  <!-- ===================== VISION ===================== -->\n  <section id=\"vision\" style=\"position:relative; z-index:4; background:#FAFAF9; padding:clamp(110px,16vh,200px) 24px; text-align:center; scroll-margin-top:70px;\">\n    <div data-reveal style=\"font-size:12px; font-weight:600; letter-spacing:0.32em; text-transform:uppercase; color:#9a9a97;\">The vision</div>\n    <h2 data-reveal data-delay=\"80\" style=\"margin:24px auto 0; max-width:18ch; font-family:'Inter Tight'; font-weight:600; font-size:clamp(30px,4.4vw,58px); line-height:1.06; letter-spacing:-0.03em;\">Creators deserve more than fragmented tools and rented audiences.</h2>\n    <p data-reveal data-delay=\"160\" style=\"margin:26px auto 0; max-width:54ch; font-size:clamp(15px,1.5vw,18px); line-height:1.65; color:#6a6a67;\">Movianx unifies creation, community and commerce into one cinematic platform &mdash; so the next generation of storytellers can build, grow and own their future in a single place.</p>\n  </section>\n\n  <!-- ===================== FINAL CTA ===================== -->\n  <section style=\"position:relative; z-index:4; overflow:hidden; background:#0B0B0C; color:#fff; padding:clamp(110px,16vh,190px) 24px; text-align:center;\">\n    <div data-parallax=\"0.05\" data-keepcenter style=\"position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:min(80vw,720px); aspect-ratio:844 / 863; opacity:0.06; -webkit-mask:url('/movianx-logo.png') center/contain no-repeat; mask:url('/movianx-logo.png') center/contain no-repeat; background:linear-gradient(110deg,#3a3a40,#ffffff,#3a3a40); background-size:300% 100%; animation:mx-sheen 9s linear infinite; pointer-events:none;\"></div>\n    <div data-reveal style=\"position:relative; font-size:12px; font-weight:600; letter-spacing:0.32em; text-transform:uppercase; color:rgba(255,255,255,0.5);\">Limited early access</div>\n    <h2 data-reveal data-delay=\"80\" style=\"position:relative; margin:22px auto 0; max-width:16ch; font-family:'Inter Tight'; font-weight:600; font-size:clamp(36px,5.4vw,76px); line-height:0.98; letter-spacing:-0.035em;\">Be first through the door.</h2>\n    <p data-reveal data-delay=\"150\" style=\"position:relative; margin:20px auto 0; max-width:40ch; font-size:clamp(15px,1.5vw,18px); line-height:1.6; color:rgba(255,255,255,0.65);\">Join the creators shaping what comes next. We&rsquo;re opening access in waves.</p>\n    <div data-reveal data-delay=\"220\" style=\"position:relative; display:inline-flex; align-items:center; gap:8px; margin-top:34px; padding:7px 7px 7px 20px; border-radius:100px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); backdrop-filter:blur(8px);\">\n      <input type=\"email\" placeholder=\"Enter your email\" style=\"border:none; outline:none; background:transparent; font-family:inherit; font-size:15px; color:#fff; width:min(52vw,250px);\" />\n      <button data-magnetic style=\"display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border:none; border-radius:100px; background:#D90429; color:#fff; font-size:14.5px; font-weight:600; cursor:pointer; white-space:nowrap; box-shadow:0 10px 30px rgba(217,4,41,0.4);\">Request access <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"13 6 19 12 13 18\"></polyline></svg></button>\n    </div>\n  </section>\n\n  <!-- ===================== FOOTER ===================== -->\n  <footer style=\"position:relative; z-index:4; background:#FAFAF9; border-top:1px solid rgba(0,0,0,0.06); padding:56px 40px 40px;\">\n    <div style=\"max-width:1320px; margin:0 auto; display:flex; align-items:flex-start; justify-content:space-between; gap:40px; flex-wrap:wrap;\">\n      <div style=\"max-width:300px;\">\n        <img src=\"/movianx-logo.png\" alt=\"Movianx\" style=\"height:64px; width:auto; display:block;\" />\n        <div style=\"margin-top:18px; font-size:13.5px; color:#6a6a67; line-height:1.5;\">Where creativity becomes reality.</div>\n      </div>\n      <div style=\"display:flex; gap:64px; flex-wrap:wrap;\">\n        <div style=\"display:flex; flex-direction:column; gap:12px; font-size:13.5px; color:#6a6a67;\">\n          <div style=\"font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#0E0E0E; margin-bottom:4px;\">Platform</div>\n          <a href=\"#create\" style=\"\" style-hover=\"color:#0E0E0E;\">Studio</a>\n          <a href=\"#vision\" style=\"\" style-hover=\"color:#0E0E0E;\">Vision</a>\n          <a href=\"#access\" style=\"\" style-hover=\"color:#0E0E0E;\">Access</a>\n        </div>\n        <div style=\"display:flex; flex-direction:column; gap:12px; font-size:13.5px; color:#6a6a67;\">\n          <div style=\"font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#0E0E0E; margin-bottom:4px;\">Company</div>\n          <a href=\"#\" style=\"\" style-hover=\"color:#0E0E0E;\">About</a>\n          <a href=\"#\" style=\"\" style-hover=\"color:#0E0E0E;\">News</a>\n          <a href=\"#\" style=\"\" style-hover=\"color:#0E0E0E;\">Contact</a>\n        </div>\n        <div style=\"display:flex; flex-direction:column; gap:14px;\">\n          <div style=\"font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#0E0E0E;\">Follow</div>\n          <div style=\"display:flex; gap:13px; color:#0E0E0E;\">\n            <a href=\"#\" data-magnetic style=\"display:flex;\" style-hover=\"color:#D90429;\"><svg width=\"19\" height=\"19\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"></rect><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><circle cx=\"17.4\" cy=\"6.6\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"></circle></svg></a>\n            <a href=\"#\" data-magnetic style=\"display:flex;\" style-hover=\"color:#D90429;\"><svg width=\"19\" height=\"19\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"7.5\" cy=\"17.5\" r=\"3\"></circle><path d=\"M10.5 17.5 V5 c2.8 0 4.6 1.4 5.5 3.4\"></path></svg></a>\n            <a href=\"#\" data-magnetic style=\"display:flex;\" style-hover=\"color:#D90429;\"><svg width=\"19\" height=\"19\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"><rect x=\"2.5\" y=\"6\" width=\"19\" height=\"12\" rx=\"3.5\"></rect><polygon points=\"10.5 9.2 15.5 12 10.5 14.8\" fill=\"currentColor\" stroke=\"none\"></polygon></svg></a>\n            <a href=\"#\" data-magnetic style=\"display:flex;\" style-hover=\"color:#D90429;\"><svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><line x1=\"4.5\" y1=\"4.5\" x2=\"19.5\" y2=\"19.5\"></line><line x1=\"19.5\" y1=\"4.5\" x2=\"4.5\" y2=\"19.5\"></line></svg></a>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div style=\"max-width:1320px; margin:40px auto 0; padding-top:22px; border-top:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; font-size:12px; color:#a3a3a0;\">\n      <div>&copy; 2026 Movianx. All rights reserved.</div>\n      <div style=\"display:flex; gap:22px;\"><a href=\"#\" style=\"\" style-hover=\"color:#0E0E0E;\">Privacy</a><a href=\"#\" style=\"\" style-hover=\"color:#0E0E0E;\">Terms</a></div>\n    </div>\n  </footer>\n\n</div>";

export default function LandingV2DC() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // minimal DC runtime shim
    class DCLogic { constructor(){ this.props = { motionEnabled: true }; } }
    let instance;
    try {
      
class Component extends DCLogic {
  componentDidMount() {
    const motion = this.props.motionEnabled ?? true;
    const fine = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer:fine)').matches;
    const root = root.querySelector('[data-mx-root]');
    if (!root) return;

    // ---- scroll reveals ----
    if (motion) {
      try {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); }
          });
        }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
        root.querySelectorAll('[data-reveal]').forEach((el) => {
          const r = el.getBoundingClientRect();
          const d = parseInt(el.getAttribute('data-delay') || '0', 10);
          el.style.transition = 'opacity .85s cubic-bezier(.2,.7,.2,1) ' + d + 'ms, transform .85s cubic-bezier(.2,.7,.2,1) ' + d + 'ms';
          if (r.top > window.innerHeight * 0.92) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(26px)';
            io.observe(el);
          }
        });
        // cinematic text blocks: hidden until their section pins
        const cio = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }
            else { e.target.style.opacity = '0'; e.target.style.transform = 'translateY(34px)'; }
          });
        }, { threshold: 0.5 });
        root.querySelectorAll('[data-cine]').forEach((el) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(34px)';
          el.style.transition = 'opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)';
          cio.observe(el);
        });
      } catch (e) {}
    }

    // ---- parallax (rAF, throttled) ----
    if (motion) {
      const pEls = Array.from(root.querySelectorAll('[data-parallax]'));
      const imgWraps = Array.from(root.querySelectorAll('[data-parallax-img]'));
      let ticking = false;
      const onScroll = () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const vh = window.innerHeight;
          pEls.forEach((el) => {
            const sp = parseFloat(el.getAttribute('data-parallax')) || 0.08;
            const r = el.getBoundingClientRect();
            const off = (r.top + r.height / 2 - vh / 2) * -sp;
            el.style.transform = (el.hasAttribute('data-keepcenter') ? 'translate(-50%,-50%) ' : '') + 'translateY(' + off.toFixed(1) + 'px)';
          });
          imgWraps.forEach((el) => {
            const r = el.parentElement.getBoundingClientRect();
            const prog = (r.top) / vh; // ~1 above, 0 centered, negative below
            el.style.transform = 'translateY(' + (prog * 7).toFixed(2) + '%)';
          });
          ticking = false;
        });
      };
      // keep the centered watermark centered while parallaxing
      root.querySelectorAll('[data-parallax]').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.transform && cs.transform.indexOf('matrix') === 0 && el.previousSibling === null) {}
      });
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // ---- cursor tilt on hero logo ----
    if (motion && fine) {
      const tilt = root.querySelector('[data-tilt]');
      if (tilt) {
        const wrap = tilt.parentElement;
        wrap.addEventListener('pointermove', (e) => {
          const r = wrap.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          tilt.style.transform = 'rotateY(' + (px * 14).toFixed(2) + 'deg) rotateX(' + (-py * 14).toFixed(2) + 'deg) scale(1.04)';
        });
        wrap.addEventListener('pointerleave', () => { tilt.style.transform = 'rotateY(0) rotateX(0) scale(1)'; });
      }
    }

    // ---- magnetic elements ----
    if (motion && fine) {
      root.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.style.transition = 'transform .4s cubic-bezier(.2,.7,.2,1)';
        el.style.willChange = 'transform';
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + (mx * 0.28).toFixed(1) + 'px,' + (my * 0.42).toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', () => { el.style.transform = 'translate(0,0)'; });
      });
    }

    // ---- custom cursor ----
    if (motion && fine) {
      try {
        const ring = document.createElement('div');
        ring.style.cssText = 'position:fixed;top:0;left:0;width:34px;height:34px;border:1px solid rgba(140,140,140,0.9);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .25s ease,height .25s ease,background .25s ease;mix-blend-mode:difference;';
        const dot = document.createElement('div');
        dot.style.cssText = 'position:fixed;top:0;left:0;width:6px;height:6px;background:#fff;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference;';
        document.body.appendChild(ring); document.body.appendChild(dot);
        document.documentElement.style.cursor = 'none';
        let rx = window.innerWidth / 2, ry = window.innerHeight / 2, tx = rx, ty = ry;
        window.addEventListener('pointermove', (e) => {
          tx = e.clientX; ty = e.clientY;
          dot.style.left = tx + 'px'; dot.style.top = ty + 'px';
        });
        const loop = () => { rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop); };
        loop();
        const grow = () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.background = 'rgba(255,255,255,0.12)'; };
        const shrink = () => { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.background = 'transparent'; };
        root.querySelectorAll('a, button, input, [data-magnetic]').forEach((el) => {
          el.addEventListener('pointerenter', grow); el.addEventListener('pointerleave', shrink);
        });
        window.addEventListener('pointerdown', () => { ring.style.width = '24px'; ring.style.height = '24px'; });
        window.addEventListener('pointerup', shrink);
      } catch (e) {}
    }
  }
  renderVals() { return {}; }
}

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
