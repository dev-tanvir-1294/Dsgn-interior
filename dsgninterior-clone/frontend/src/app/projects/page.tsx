import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { getProjects } from '@/lib/wp';

export const metadata: Metadata = {
  title: 'Projects',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <header className="sr">
        <h1>Projects</h1>
        <p>
          Selected projects and references in interior architecture for offices,
          hotels and public environments.
        </p>
      </header>
      <ul className="works-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </main>
  );
}
