'use client';
import HomePage from '@/components/features/Home/HomePage';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return <HomePage onShowAllTasks={() => router.push('/tasks')} />;
} 