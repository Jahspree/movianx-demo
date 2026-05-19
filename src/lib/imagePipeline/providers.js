function hueFromText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  return hash % 360;
}

function escapeXml(value) {
  return String(value || "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
}

export class LocalCinematicImageProvider {
  constructor({ providerId = "local-cinematic-svg" } = {}) {
    this.providerId = providerId;
  }

  async generate({ contentId, title, type, width, height, prompt }) {
    const hue = hueFromText(`${contentId}:${type}:${prompt}`);
    const accent = `hsl(${hue} 76% 46%)`;
    const warm = `hsl(${(hue + 42) % 360} 88% 60%)`;
    const label = escapeXml(title || contentId);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#050507"/><stop offset=".55" stop-color="#151114"/><stop offset="1" stop-color="#030305"/></linearGradient>
        <radialGradient id="glow" cx="70%" cy="32%" r="70%"><stop stop-color="${warm}" stop-opacity=".42"/><stop offset=".45" stop-color="${accent}" stop-opacity=".2"/><stop offset="1" stop-color="#050507" stop-opacity="0"/></radialGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .12"/></feComponentTransfer></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <g opacity=".18">${Array.from({ length: 12 }, (_, i) => `<path d="M-${width * .08} ${height * (.18 + i * .055)} C ${width * .24} ${height * (.09 + i * .04)} ${width * .62} ${height * (.14 + i * .05)} ${width * 1.08} ${height * (.08 + i * .06)}" fill="none" stroke="white" stroke-width="${Math.max(2, width * .0018)}"/>`).join("")}</g>
      <g opacity=".76">
        <rect x="${width * .14}" y="${height * .22}" width="${width * .72}" height="${height * .56}" rx="${Math.min(width, height) * .035}" fill="rgba(0,0,0,.42)" stroke="${accent}" stroke-width="${Math.max(4, width * .006)}"/>
        <circle cx="${width * .68}" cy="${height * .42}" r="${Math.min(width, height) * .14}" fill="${warm}" opacity=".25"/>
        <path d="M${width * .36} ${height * .77} L${width * .50} ${height * .36} L${width * .66} ${height * .77} Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" stroke-width="${Math.max(2, width * .002)}"/>
      </g>
      <rect width="100%" height="100%" fill="black" opacity=".12"/>
      <rect width="100%" height="100%" filter="url(#grain)"/>
      <text x="${width * .07}" y="${height * .88}" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(48, width * .06)}" font-weight="800" letter-spacing="-2">${label}</text>
      <text x="${width * .072}" y="${height * .94}" fill="rgba(255,255,255,.68)" font-family="Arial, Helvetica, sans-serif" font-size="${Math.max(20, width * .024)}" font-weight="700" letter-spacing="5">MOVIANX GENERATED</text>
    </svg>`;

    return {
      providerId: this.providerId,
      contentType: "image/svg+xml",
      extension: ".svg",
      bytes: Buffer.from(svg),
      width,
      height,
      prompt,
      type,
    };
  }
}

export function createImageProvider(provider = "local") {
  if (provider === "local") return new LocalCinematicImageProvider();
  throw new Error(`Image provider is not configured: ${provider}`);
}
