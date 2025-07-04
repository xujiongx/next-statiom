'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TABS } from './const';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const gridColsMap: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };
  const gridColsClass = gridColsMap[TABS.length] || 'grid-cols-4';

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 pb-20'>{children}</main>
      <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'>
        <div className={`h-14 grid ${gridColsClass}`}>
          {TABS.map(({ key, title, icon: Icon }) => (
            <button
              key={key}
              onClick={() => router.push(key)}
              className={`flex flex-col items-center justify-center gap-1
                ${pathname === key ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}
              `}
            >
              <Icon size={20} />
              <span className='text-xs'>{title}</span>
            </button>
          ))}
        </div>
        <div className='pb-[env(safe-area-inset-bottom)] bg-white dark:bg-gray-900'></div>
      </nav>
    </div>
  );
}
