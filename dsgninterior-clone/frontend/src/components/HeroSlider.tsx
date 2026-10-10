'use client';

import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Autoplay, Pagination, Parallax } from 'swiper/modules';
import { HERO } from '@/lib/config';
import type { Project } from '@/lib/types';
import { ResponsiveImage } from './ResponsiveImage';

type HeroSliderProps = {
  projects: Project[];
};

export function HeroSlider({ projects }: HeroSliderProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const swiper = new Swiper(root, {
      modules: [Autoplay, Pagination, Parallax],
      parallax: true,
      loop: true,
      speed: 900,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
    });

    return () => swiper.destroy(true, true);
  }, [projects]);

  const titleLines = HERO.title.split('\n');

  return (
    <main ref={rootRef} className="home-banners swiper">
      <div className="swiper-wrapper">
        <header id="banner-0" className="banner swiper-slide">
          <div className="media work-banner" data-swiper-parallax="60%" data-scroll-parallax="60%">
            {HERO.image ? (
              <picture className="img loaded loaded">
                <img src={HERO.image} alt="" />
              </picture>
            ) : null}
          </div>
          <h1 className="banner-title" data-swiper-parallax="100%" data-scroll-parallax="100%">
            <span className="split" data-swiper-parallax="-60" data-scroll-parallax="-60">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </span>
          </h1>
          <p className="sr">{HERO.text}</p>
        </header>

        {projects.map((project, i) => (
          <a
            key={project.id}
            href={`/projects/${project.slug}`}
            id={`banner-${i + 1}`}
            className="banner swiper-slide"
          >
            <div className="media work-banner" data-swiper-parallax="60%" data-scroll-parallax="60%">
              <ResponsiveImage
                media={project.dsgn_media?.cover}
                alt={project.title.rendered}
                pictureClassName="img loaded loaded"
                sizes="100vw"
                eager
              />
            </div>
            <h2 className="banner-title" data-swiper-parallax="100%" data-scroll-parallax="100%">
              <span data-swiper-parallax="-60" data-scroll-parallax="-60">
                {project.title.rendered}
              </span>
            </h2>
            <p className="sr" dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }} />
          </a>
        ))}
      </div>
      <div className="banners-pagination">
        <div className="swiper-pagination" />
      </div>
    </main>
  );
}
