'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from './Footer';
import { Header } from './Header';
import type { MenuItem, SiteInfo } from '@/lib/types';

function pageClass(pathname: string): string {
  if (pathname === '/') return 'homepage welcome page-home';
  if (/^\/projects\/[^/]+/.test(pathname)) return 'page page-work';
  if (/^\/projects\/?$/.test(pathname)) return 'page page-works';
  if (/^\/dsgn-archive/.test(pathname)) return 'page page-archives';
  if (/^\/office/.test(pathname)) return 'page page-office';
  return 'page page-default';
}

type SiteShellProps = {
  menu: MenuItem[];
  site: SiteInfo;
  children: ReactNode;
};

export function SiteShell({ menu, site, children }: SiteShellProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isProjectDetail = /^\/projects\/[^/]+/.test(pathname);

  return (
    <div className={pageClass(pathname)}>
      <Header menu={menu} transparent={isHome || isProjectDetail} />
      {children}
      <Footer site={site} variant={isHome ? 'home' : 'page'} />
    </div>
  );
}
