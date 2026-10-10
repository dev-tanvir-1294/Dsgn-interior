// TypeScript shapes for the data WordPress exposes over the REST API.

export interface WPMediaSize {
  url: string;
  width: number;
  height: number;
}

export interface WPMedia {
  id: number;
  url: string;
  width: number;
  height: number;
  alt: string;
  sizes: Record<string, WPMediaSize>;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
}

export interface SiteInfo {
  name: string;
  description: string;
  contact_email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  instagram: string;
  linkedin: string;
}

export interface ProjectMeta {
  dsgn_location: string;
  dsgn_area: string;
  dsgn_year: string;
  dsgn_photo_credit: string;
  dsgn_featured: boolean;
  dsgn_gallery: number[];
}

export interface Project {
  id: number;
  slug: string;
  link: string;
  menu_order: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  meta: ProjectMeta;
  dsgn_media: {
    cover: WPMedia | null;
    gallery: WPMedia[];
  };
}

export interface WpPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}
