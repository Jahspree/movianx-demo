import './globals.css';
import PostHogRouteController from './PostHogRouteController';

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
      <body style={{ margin: 0, padding: 0 }}>
        <PostHogRouteController />
        {children}
      </body>
    </html>
  );
}
