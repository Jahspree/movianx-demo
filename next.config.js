/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // Serve the approved self-contained "Bundled Page" exports as the three public routes.
      // beforeFiles so they take precedence and render the exact design (no React re-port).
      beforeFiles: [
        { source: '/', destination: '/site/portal.html' },
        { source: '/creators', destination: '/site/creators.html' },
        { source: '/explore', destination: '/site/experience.html' },
      ],
    };
  },
};
module.exports = nextConfig;
