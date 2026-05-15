import './globals.css';

export const metadata = {
  title: 'Movianx — Immersive Media Powered by AI',
  description: 'Creator-first AI media platform for films, video, immersive audio, intelligent media analysis, and cinematic enhancement.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#000000',
  openGraph: {
    title: 'Movianx — Immersive Media Powered by AI',
    description: 'Creator-first AI media platform for films, video, immersive audio, intelligent media analysis, and cinematic enhancement.',
    url: 'https://demo.movianx.com',
    siteName: 'Movianx',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movianx — Immersive Media Powered by AI',
    description: 'Creator-first AI media platform for cinematic AI-directed experiences.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  );
}
