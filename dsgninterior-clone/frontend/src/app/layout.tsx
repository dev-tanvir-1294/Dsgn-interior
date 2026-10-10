import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import '@/styles/dsgn-styles.css';
import '@/styles/dsgn-standalone.css';
import '@/styles/overrides.css';
import { SiteShell } from '@/components/SiteShell';
import { SmoothScroll } from '@/components/SmoothScroll';
import { getMenu, getSite } from '@/lib/wp';

export const metadata: Metadata = {
  title: {
    default: 'dsgn interior',
    template: '%s — dsgn interior',
  },
  description: 'Interior architecture for offices, hotels and public environments.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [menu, site] = await Promise.all([getMenu(), getSite()]);

  return (
    <html lang="en">
      <body>
        <SiteShell menu={menu} site={site}>
          {children}
        </SiteShell>
        <SmoothScroll />
      </body>
    </html>
  );
}
