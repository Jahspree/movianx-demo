/** @type {import('next').NextConfig} */
// vercel.json sets cleanUrls:true, which 308-redirects "/site/x.html" -> "/site/x". So on Vercel
// the rewrite must target the extensionless clean URL; in `next dev` (no cleanUrls) it must keep
// the .html. Pick per environment.
const onVercel = !!process.env.VERCEL;
const ext = onVercel ? '' : '.html';

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: `/site/portal${ext}` },
        { source: '/creators', destination: `/site/creators${ext}` },
        { source: '/explore', destination: `/site/experience${ext}` },
      ],
    };
  },
};
module.exports = nextConfig;
