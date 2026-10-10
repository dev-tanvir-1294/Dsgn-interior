import Link from 'next/link';
import type { SiteInfo } from '@/lib/types';
import { DsgnLogo } from './DsgnLogo';

type FooterProps = {
  site: SiteInfo;
  variant?: 'home' | 'page';
};

export function Footer({ site, variant = 'page' }: FooterProps) {
  const year = new Date().getFullYear();
  const tel = `tel:${site.phone.replace(/[^\d+]/g, '')}`;

  if (variant === 'home') {
    return (
      <footer className="footer">
        <ul className="footer-grid">
          <li className="contacts">
            <a href={`mailto:${site.contact_email}`}>{site.contact_email}</a>
            <a href={tel}>{site.phone}</a>
          </li>
          <li className="address">
            <a
              href="https://www.google.com/maps/search/dsgn+interior+Tessins+v%C3%A4g+14+21758+Malm%C3%B6"
              target="_blank"
              rel="noopener"
            >
              <span>{site.address_line_1}</span>
              <span>{site.address_line_2}</span>
            </a>
          </li>
          <li className="scroll">
            <span>Scroll to explore</span>
          </li>
        </ul>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <ul className="footer-grid">
        <li className="contacts">
          <a href={`mailto:${site.contact_email}`}>{site.contact_email}</a>
          <a href={tel}>{site.phone}</a>
        </li>
        <li className="address">
          <a
            href="https://www.google.com/maps/search/dsgn+interior+Tessins+v%C3%A4g+14+21758+Malm%C3%B6"
            target="_blank"
            rel="noopener"
          >
            <span>{site.address_line_1}</span>
            <span>{site.address_line_2}</span>
          </a>
        </li>
        <li className="logo">
          <DsgnLogo />
        </li>
        <li className="rs">
          <a href={site.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </li>
        <li className="legal">
          <Link href="/legal-notice/">Legal Notice</Link>
          <Link href="/privacy-policy/">Privacy Policy</Link>
        </li>
        <li className="credits">
          <p>
            © {year},<span>dsgn interior</span>
          </p>
          <p>
            Website by{' '}
            <a href="https://www.studiofables.com" target="_blank" rel="noopener">
              Studio Fables
            </a>
          </p>
        </li>
      </ul>
    </footer>
  );
}
