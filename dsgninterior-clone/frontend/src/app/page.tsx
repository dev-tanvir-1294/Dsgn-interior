import { HeroSlider } from '@/components/HeroSlider';
import { getProjects } from '@/lib/wp';

export default async function HomePage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.meta?.dsgn_featured);

  return <HeroSlider projects={featured} />;
}
