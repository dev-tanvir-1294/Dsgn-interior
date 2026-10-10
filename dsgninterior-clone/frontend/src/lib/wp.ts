import { MENU, SITE } from './config';
import type { MenuItem, Project, SiteInfo, WpPage } from './types';

const WP_URL = (process.env.WORDPRESS_URL || '').replace(/\/+$/, '');
const REVALIDATE = Number(process.env.WP_REVALIDATE ?? 60);

/**
 * Fetch a WordPress REST resource, revalidating every `REVALIDATE` seconds.
 */
async function wpFetch<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${WP_URL}${path}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    throw new Error(`WordPress request failed (${res.status}): ${url}`);
  }
  return (await res.json()) as T;
}

export async function getMenu(): Promise<MenuItem[]> {
  if (!WP_URL) return MENU;
  try {
    return await wpFetch<MenuItem[]>('/wp-json/dsgn/v1/menu');
  } catch {
    return MENU;
  }
}

export async function getSite(): Promise<SiteInfo> {
  if (!WP_URL) return SITE;
  try {
    const site = await wpFetch<SiteInfo>('/wp-json/dsgn/v1/site');
    return { ...SITE, ...site };
  } catch {
    return SITE;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!WP_URL) return [];
  try {
    return await wpFetch<Project[]>(
      '/wp-json/wp/v2/projects?per_page=100&orderby=menu_order&order=asc',
    );
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!WP_URL) return null;
  try {
    const items = await wpFetch<Project[]>(
      `/wp-json/wp/v2/projects?slug=${encodeURIComponent(slug)}&per_page=1`,
    );
    return items[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  if (!WP_URL) return null;
  try {
    const items = await wpFetch<WpPage[]>(
      `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&per_page=1`,
    );
    return items[0] ?? null;
  } catch {
    return null;
  }
}
