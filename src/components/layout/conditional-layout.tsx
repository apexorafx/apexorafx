'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Footer } from './footer';
import { Header } from './header';

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      {!isDashboardRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}
