import Header from '@/components/layout/Header';
import SelaPanel from '@/components/layout/SelaPanel';
import SideNavigation from '@/components/layout/SideNavigation';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '営業支援システム',
  description: 'アンビエントエージェントによる営業支援システム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <div className="flex min-h-screen">
          {/* サイドナビ */}
          <div className="w-[68px] flex-shrink-0">
            <SideNavigation />
          </div>
          {/* 中央コンテンツ */}
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
        </div>
        <SelaPanel />
      </body>
    </html>
  );
} 