import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full h-12 bg-white flex items-center justify-between px-6 shadow-sm">
      <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">SalesOn</Link>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Calendar className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
} 