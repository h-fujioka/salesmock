'use client';
import HomePage from '@/components/features/Home/HomePage';
import Header from '@/components/layout/Header';
import SelaPanel from '@/components/layout/SelaPanel';
import SideNavigation from '@/components/layout/SideNavigation';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* サイドナビ */}
        <div className="w-[68px] flex-shrink-0">
          <SideNavigation />
        </div>
        {/* 中央コンテンツ */}
        <main className="flex-1 bg-gray-50">
          <HomePage onShowAllTasks={() => router.push('/tasks')} />
        </main>
        {/* Selaパネル */}
        <div className="w-[360px] flex-shrink-0 hidden lg:block">
          <SelaPanel />
        </div>
      </div>
    </>
  );
}
