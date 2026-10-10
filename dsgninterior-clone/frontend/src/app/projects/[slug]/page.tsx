import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCard } from '@/components/ProjectCard';
import { cssVars, ResponsiveImage } from '@/components/ResponsiveImage';
import { WorkText } from '@/components/WorkText';
import type { WPMedia } from '@/lib/types';
import { getProjectBySlug, getProjects } from '@/lib/wp';

type Params = { slug: string };

type GalleryBlock = {
  media: WPMedia;
  landscape: boolean;
  span: number;
  columns: number;
};

/** Pack gallery images into 6-column rows, mirroring the original layout. */
function buildGalleryRows(gallery: WPMedia[]): GalleryBlock[][] {
  const blocks: GalleryBlock[] = gallery.map((media) => {
    const landscape = media.width >= media.height;
    return {
      media,
      landscape,
      span: landscape ? 4 : 2,
      columns: landscape ? 4 : 2,
    };
  });

  const rows: GalleryBlock[][] = [];
  let current: GalleryBlock[] = [];
  let sum = 0;

  for (const block of blocks) {
    if (sum + block.span > 6 && current.length) {
      rows.push(current);
      current = [];
      sum = 0;
    }
    current.push(block);
    sum += block.span;
  }
  if (current.length) rows.push(current);

  return rows;
}

function mediaStyle(media: WPMedia) {
  return cssVars({ '--ratio': `${media.width} / ${media.height}`, '--focus': 'center' });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  return { title: project ? project.title.rendered : 'Project' };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const [project, all] = await Promise.all([
    getProjectBySlug(params.slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const cover = project.dsgn_media?.cover ?? null;
  const gallery = project.dsgn_media?.gallery ?? [];
  const meta = project.meta ?? {};
  const intro = project.excerpt?.rendered ?? '';
  const body = project.content?.rendered ?? '';
  const related = all.filter((p) => p.id !== project.id).slice(0, 4);
  const rows = buildGalleryRows(gallery);

  return (
    <main>
      <article className="work">
        <header className="banner">
          <div className="media work-banner" data-scroll-parallax="40%">
            <ResponsiveImage
              media={cover}
              alt={project.title.rendered}
              pictureClassName="img loaded loaded"
              style={cover ? mediaStyle(cover) : undefined}
              sizes="100vw"
              eager
            />
          </div>
          <h1 className="banner-title" data-scroll-parallax="60%">
            <span data-scroll-parallax="10%">{project.title.rendered}</span>
          </h1>
          <p className="sr" dangerouslySetInnerHTML={{ __html: intro }} />
        </header>

        <div className="work-texts">
          <dl className="specs work-specs">
            {meta.dsgn_location ? (
              <>
                <dt>Location</dt>
                <dd>{meta.dsgn_location}</dd>
              </>
            ) : null}
            {meta.dsgn_area ? (
              <>
                <dt>Area</dt>
                <dd>{meta.dsgn_area}</dd>
              </>
            ) : null}
            {meta.dsgn_year ? (
              <>
                <dt>Year</dt>
                <dd>{meta.dsgn_year}</dd>
              </>
            ) : null}
          </dl>
          <WorkText intro={intro} body={body} />
        </div>

        {rows.length > 0 && (
          <div className="work-gallery">
            {rows.map((row, ri) => (
              <div className="gallery-row" key={ri}>
                {row.map((block, bi) => (
                  <div
                    key={bi}
                    className={`block block-image ${
                      block.landscape ? 'block-image-landscape' : 'block-image-portrait'
                    }`}
                    data-columns={String(block.columns)}
                    style={cssVars({ '--span': String(block.span) })}
                  >
                    <div className="media" data-scroll-parallax="5%">
                      <ResponsiveImage
                        media={block.media}
                        alt={block.media.alt}
                        pictureClassName="img loaded loaded"
                        style={mediaStyle(block.media)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {meta.dsgn_photo_credit ? (
          <footer className="work-credits">{meta.dsgn_photo_credit}</footer>
        ) : null}
      </article>

      {related.length > 0 && (
        <nav className="work-related">
          <h2>Discover more works</h2>
          <ul className="works-grid">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} heading="h3" />
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
