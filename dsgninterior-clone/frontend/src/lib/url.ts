/**
 * Convert an absolute WordPress URL (e.g. from a nav menu item) into the
 * matching frontend route path. Assumes WordPress permalinks mirror the
 * frontend routes (`/projects/`, `/office/`, …).
 */
export function toPath(url: string): string {
  try {
    const parsed = new URL(url, 'http://localhost');
    return parsed.pathname || '/';
  } catch {
    return url;
  }
}
