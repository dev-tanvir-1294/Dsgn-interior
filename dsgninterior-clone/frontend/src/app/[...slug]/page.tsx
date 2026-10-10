import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/wp';

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = params.slug[params.slug.length - 1];
  const page = await getPageBySlug(slug);
  return { title: page ? page.title.rendered : 'Page' };
}

/**
 * Catch-all for WordPress-driven pages (Office, dsgn Archive, Privacy Policy,
 * Legal Notice, Shop, …). Content is edited in wp-admin and rendered here via
 * the REST API `content.rendered`.
 */
export default async function CatchAllPage({ params }: { params: Params }) {
  const slug = params.slug[params.slug.length - 1];
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <main>
      <article>
        <header className="default-header">
          <h1>{page.title.rendered}</h1>
        </header>
        <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </article>
    </main>
  );
}
