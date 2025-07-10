'use client';
import { Briefcase, ListChecks, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '案件', icon: <Briefcase className="w-6 h-6" /> },
  { href: '/tasks', label: 'タスク', icon: <ListChecks className="w-6 h-6" /> },
  { href: '/settings', label: '設定', icon: <Settings className="w-6 h-6" /> },
];

export default function SideNavigation() {
  const pathname = usePathname();
  return (
    <nav className="h-full w-[68px] bg-white border-r flex flex-col items-center py-4 gap-6">
      {navItems.map((item) => {
        // ホーム画面（'/'）ではどの項目もアクティブにしない
        const isHome = pathname === '/';
        const isActive = !isHome && pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center w-full py-2 rounded transition-colors ${
              isActive ? 'bg-gray-100 text-black font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={{ minWidth: 0 }}
          >
            {item.icon}
            <span className="text-[10px] mt-1 leading-none text-center break-words">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 