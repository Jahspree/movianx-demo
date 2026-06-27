/** @type {import('next').NextConfig} */
// vercel.json sets cleanUrls:true, which 308-redirects "/site/x.html" -> "/site/x". So on Vercel
// the rewrite must target the extensionless clean URL; in `next dev` (no cleanUrls) it must keep
// the .html. Pick per environment.
const onVercel = !!process.env.VERCEL;
const ext = onVercel ? '' : '.html';

const nextConfig = {
  // The CERTIFIED Creative Intelligence Engine (src/intelligence/**) is CommonJS that uses
  // require(path.resolve(__dirname, ...)) and lazy-loads optional SDKs — patterns that do NOT survive
  // webpack bundling. The integration seam (src/lib/creator/engineIntegration.js) therefore loads the
  // engine at REQUEST time via a webpackIgnore'd dynamic import (from disk, where __dirname resolves).
  // outputFileTracingIncludes ships the engine files into serverless function bundles for deploy.
  outputFileTracingIncludes: {
    '/api/intelligence/**': ['./src/intelligence/**/*.js'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: `/site/portal${ext}` },
        { source: '/create', destination: `/site/create${ext}` },
        { source: '/creators', destination: `/site/creators${ext}` },
        { source: '/explore', destination: `/site/experience${ext}` },
      ],
    };
  },
};
module.exports = nextConfig;
