'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { LANGUAGES } from '@/lib/config';
import type { MenuItem } from '@/lib/types';
import { toPath } from '@/lib/url';

type HeaderProps = {
  menu: MenuItem[];
  transparent?: boolean;
};

export function Header({ menu, transparent = false }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(url: string): boolean {
    const path = toPath(url);
    return path === pathname || (path !== '/' && pathname.startsWith(path));
  }

  const menuStyle: CSSProperties | undefined = open
    ? ({ ['--menu-scale' as string]: '1', transform: 'translateY(0)', zIndex: 20 } as CSSProperties)
    : undefined;

  return (
    <header className={`header${transparent ? ' transparent' : ''}`}>
      <div className="header-logo">
        <Link href="/">
          <strong>dsgn</strong> interior
        </Link>
      </div>

      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-toggle-open" style={{ opacity: open ? 0 : 1 }}>
          Menu
        </span>
        <span className="menu-toggle-close" style={{ opacity: open ? 1 : 0 }}>
          Close
        </span>
      </button>

      <nav className="menu" id="menu" style={menuStyle}>
        <ul className="menu-links">
          {menu.map((item) => (
            <li key={item.id}>
              <Link
                href={toPath(item.url)}
                className={isActive(item.url) ? 'active' : undefined}
                style={open ? { opacity: 1 } : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="languages">
          <a href={LANGUAGES.sv.path} aria-label="Svenska">
            {LANGUAGES.sv.label}
          </a>
          <a href={LANGUAGES.en.path} aria-label="English" aria-current="true">
            {LANGUAGES.en.label}
          </a>
        </div>
      </nav>
    </header>
  );
}
