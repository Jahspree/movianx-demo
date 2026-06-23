import './globals.css';

export const metadata = {
  title: 'Movianx — Immersive Media Powered by AI',
  description: 'Experience immersive AI-enhanced entertainment across films, interactive stories, and cinematic media worlds.',
  openGraph: {
    title: 'Movianx — Immersive Media Powered by AI',
    description: 'Experience immersive AI-enhanced entertainment across films, interactive stories, and cinematic media worlds.',
    url: 'https://demo.movianx.com',
    siteName: 'Movianx',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movianx — Immersive Media Powered by AI',
    description: 'Immersive AI-enhanced entertainment for films, stories, and cinematic experiences.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Brand type: Inter Tight (display/wordmark/labels) + Inter (body/nav/inputs) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
