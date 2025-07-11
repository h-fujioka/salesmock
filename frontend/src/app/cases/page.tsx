import CaseList from '@/components/features/CaseManagement/CaseList';
import Header from '@/components/layout/Header';
import SideNavigation from '@/components/layout/SideNavigation';

export default function CasesPage() {
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
          <CaseList />
        </main>
      </div>
    </>
  );
}
