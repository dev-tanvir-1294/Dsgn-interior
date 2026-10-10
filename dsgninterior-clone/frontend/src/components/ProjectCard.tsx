import Link from 'next/link';
import type { Project } from '@/lib/types';
import { cssVars, ResponsiveImage } from './ResponsiveImage';

type ProjectCardProps = {
  project: Project;
  heading?: 'h2' | 'h3';
};

export function ProjectCard({ project, heading = 'h2' }: ProjectCardProps) {
  const cover = project.dsgn_media?.cover ?? null;
  const Title = heading;

  return (
    <li>
      <Link href={`/projects/${project.slug}`} className="work-link">
        <div
          className="media cover work-cover parallax duotone"
          style={cssVars({ '--ratio': '3 / 4', '--focus': 'center' })}
        >
          <ResponsiveImage
            media={cover}
            alt=""
            pictureClassName="img loaded img-gray"
            sizes="(min-width: 657px) 50vw, 100vw"
          />
          <ResponsiveImage
            media={cover}
            alt={project.title.rendered}
            pictureClassName="img loaded img-color"
            sizes="(min-width: 657px) 50vw, 100vw"
          />
        </div>
        <Title className="work-title">
          <span>{project.title.rendered}</span>
        </Title>
        <p className="sr" dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }} />
      </Link>
    </li>
  );
}
