export const C = {
  accent: "#8B1A1A", dark: "#f8f9fa", surface: "rgba(255,255,255,0.7)",
  surface2: "rgba(255,255,255,0.5)", border: "rgba(0,0,0,0.06)",
  text: "#1a1a2e", text2: "rgba(26,26,46,0.55)", gold: "#B8860B",
  green: "#16a34a", purple: "#6366f1", red: "#8B1A1A",
  glass: "rgba(255,255,255,0.7)", glassBorder: "rgba(0,0,0,0.06)",
  bg: "linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 50%, #f5f3f0 100%)",
  bgSolid: "#f8f9fa",
  cardBg: "rgba(255,255,255,0.6)",
  pillBg: "rgba(0,0,0,0.04)",
  shadow: "0 4px 24px rgba(0,0,0,0.06)",
  shadowHover: "0 12px 40px rgba(139,26,26,0.12)",
};

export const THEMES = {
  cream: { bg: "#F5F1E8", text: "#2C2C2C", name: "Cream" },
  eink: { bg: "#E5E5E5", text: "#1A1A1A", name: "E-Ink" },
  night: { bg: "#121218", text: "#E5E5E5", name: "Night" },
  sepia: { bg: "#F4ECD8", text: "#5C4B37", name: "Sepia" },
};

export const FONTS = ["Georgia", "Merriweather", "Open Sans", "system-ui"];
export const FF = "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const SPEECH_PROFILES = {
  terrified: { rate: 1.3, pitch: 1.15, volume: 0.95 },
  panicked: { rate: 1.3, pitch: 1.15, volume: 0.95 },
  tense: { rate: 1.0, pitch: 1.05, volume: 0.9 },
  nervous: { rate: 1.05, pitch: 1.0, volume: 0.9 },
  calm: { rate: 0.9, pitch: 0.95, volume: 0.9 },
  reflective: { rate: 0.85, pitch: 0.92, volume: 0.85 },
  ambitious: { rate: 0.95, pitch: 1.0, volume: 0.9 },
  curious: { rate: 0.95, pitch: 1.0, volume: 0.9 },
  anguished: { rate: 0.9, pitch: 1.1, volume: 0.95 },
  whispering: { rate: 0.85, pitch: 0.9, volume: 0.5 },
  devastated: { rate: 0.8, pitch: 0.85, volume: 0.8 },
};

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body,#__next{height:auto;overflow:auto;overflow-x:hidden}
  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12);border-radius:3px}
  input::placeholder{color:rgba(0,0,0,0.3)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.8}}
  @keyframes breathe{0%,100%{opacity:0.4}50%{opacity:1}}
  @keyframes pageTurn{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(-30px)}}
  @keyframes pageEnter{0%{opacity:0;transform:translateX(30px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes driftFog{0%{transform:translateX(-5%)}50%{transform:translateX(5%)}100%{transform:translateX(-5%)}}
  @keyframes flicker{0%,100%{opacity:0.6}20%{opacity:0.8}40%{opacity:0.5}60%{opacity:0.9}80%{opacity:0.55}}
  @keyframes sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
  @keyframes slowTurn{0%{transform:scaleX(1)}50%{transform:scaleX(1.02) translateX(2px)}100%{transform:scaleX(1)}}
  @keyframes rise{0%{transform:translateY(0);opacity:0.3}50%{transform:translateY(-10px);opacity:0.7}100%{transform:translateY(-20px);opacity:0}}
  @keyframes eyeGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(200,180,50,0.3))}50%{filter:drop-shadow(0 0 12px rgba(200,180,50,0.8))}}
  @keyframes iceShift{0%{transform:translateX(0) translateY(0)}33%{transform:translateX(3px) translateY(-2px)}66%{transform:translateX(-2px) translateY(1px)}100%{transform:translateX(0) translateY(0)}}
  @keyframes lightning{0%,95%,100%{opacity:0}96%{opacity:0.8}97%{opacity:0}98%{opacity:0.5}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes immersePulse{0%,100%{opacity:1}50%{opacity:0.97}}
  @keyframes timerShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.5px)}75%{transform:translateX(1.5px)}}
  @keyframes chapterFadeOut{0%{opacity:1}100%{opacity:0;background:#000}}
  @keyframes chapterFadeIn{0%{opacity:0}100%{opacity:1}}
`;

export function getSpeechProfile(emotion="calm"){
  return SPEECH_PROFILES[emotion]||SPEECH_PROFILES.calm;
}

export function estimateSpeechDurationMs(text="",emotion="calm"){
  const cleaned=(text||"").trim();
  if(!cleaned)return 1500;
  const words=cleaned.split(/\s+/).filter(Boolean).length;
  const profile=getSpeechProfile(emotion);
  const baseMs=(words*60000)/(175*profile.rate);
  const sentencePauses=(cleaned.match(/[.!?]/g)?.length||0)*260;
  const commaPauses=(cleaned.match(/[,:;]/g)?.length||0)*120;
  const cuePauses=(cleaned.match(/\[[^\]]+\]/g)?.length||0)*700;
  return Math.max(1500,Math.round(baseMs+sentencePauses+commaPauses+cuePauses+500));
}
