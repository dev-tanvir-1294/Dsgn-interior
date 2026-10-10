import type { CSSProperties } from 'react';
import type { WPMedia } from '@/lib/types';

function buildSrcset(media: WPMedia | null | undefined): string | undefined {
  if (!media) return undefined;
  const entries = Object.values(media.sizes ?? {})
    .filter((s) => s && s.url && s.width)
    .sort((a, b) => a.width - b.width);
  if (!entries.length) return undefined;
  return entries.map((s) => `${s.url} ${s.width}w`).join(', ');
}

type ResponsiveImageProps = {
  media: WPMedia | null | undefined;
  alt?: string;
  /** Applied to the wrapping <picture> element (e.g. "img loaded img-gray"). */
  pictureClassName?: string;
  /** Applied to the inner <img>. */
  imgClassName?: string;
  /** Inline style for the <picture> (e.g. --ratio / --focus crop vars). */
  style?: CSSProperties;
  sizes?: string;
  eager?: boolean;
};

export function ResponsiveImage({
  media,
  alt,
  pictureClassName,
  imgClassName,
  style,
  sizes = '100vw',
  eager = false,
}: ResponsiveImageProps) {
  if (!media) return null;
  return (
    <picture className={pictureClassName} style={style}>
      <img
        src={media.url}
        srcSet={buildSrcset(media)}
        sizes={sizes}
        alt={alt ?? media.alt ?? ''}
        className={imgClassName}
        loading={eager ? 'eager' : 'lazy'}
      />
    </picture>
  );
}

/** Shared inline style helper for the design's custom CSS variables. */
export function cssVars(vars: Record<string, string>): CSSProperties {
  return vars as CSSProperties;
}
