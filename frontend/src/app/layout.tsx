import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar, Footer } from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'World of Books | Discover Millions of Books',
  description: 'Explore and discover millions of books from around the world. Browse categories, find great deals, and get books at affordable prices.',
  keywords: 'books, ebooks, reading, literature, fiction, non-fiction, world of books',
  openGraph: {
    title: 'World of Books | Discover Millions of Books',
    description: 'Explore and discover millions of books from around the world.',
    type: 'website',
    locale: 'en_GB',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
