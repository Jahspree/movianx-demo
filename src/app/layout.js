import './globals.css';

export const metadata = {
  title: 'Movianx — Stories That Choose You Back',
  description: 'AI-powered interactive storytelling. Read, listen, choose, and live inside stories that respond to you.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#000000',
  openGraph: {
    title: 'Movianx — Stories That Choose You Back',
    description: 'AI-powered interactive storytelling platform. Upload your book, AI transforms it into an immersive experience.',
    url: 'https://demo.movianx.com',
    siteName: 'Movianx',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movianx — Stories That Choose You Back',
    description: 'AI-powered interactive storytelling. Your choices shape the story.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  );
}
