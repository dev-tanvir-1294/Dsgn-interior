import type { MenuItem, SiteInfo } from './types';

// Editable fallbacks used while WordPress is unreachable (e.g. first `npm run dev`
// before the CMS is configured). Change these freely — they are only a default.
export const SITE: SiteInfo = {
  name: 'dsgn interior',
  description: 'Interior architecture for offices, hotels and public environments.',
  contact_email: 'info@dsgninterior.se',
  phone: '+46 040 26 26 40',
  address_line_1: 'Tessins väg 14',
  address_line_2: '217 58 Malmö',
  instagram: 'https://www.instagram.com/dsgn_interior_tm/',
  linkedin: 'https://www.linkedin.com/company/dsgninterior/',
};

export const MENU: MenuItem[] = [
  { id: 1, title: 'Projects', url: '/projects/', target: '' },
  { id: 2, title: 'dsgn Archive', url: '/dsgn-archive/', target: '' },
  { id: 3, title: 'Office', url: '/office/', target: '' },
];

// The fixed "welcome" slide that leads the home hero (slides 2..n are the
// featured projects pulled from WordPress). Edit the copy here without touching
// the component code.
export const HERO = {
  title: 'designing interiors\nconnecting people',
  text: 'dsgn Interior creates interior architecture for offices, hotels and public environments with a focus on function, aesthetics and sustainability.',
  // Optional full-bleed background image for the welcome slide. Leave empty for
  // the default paper background.
  image: '',
};

export const LANGUAGES = {
  sv: { label: 'SV', path: '/sv/' },
  en: { label: 'EN', path: '/en/' },
};
