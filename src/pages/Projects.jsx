import { useEffect } from 'react'
import './Projects.css'

// Hooks
import { useProjects } from '@hooks/projects/useProjects'

import { ProjectsCards } from '@components/projects/ProjectCard'

function Projects() {
  const { data: projects, isLoading: isLoadingProjects, isFetching: isFetchingProjects } = useProjects()
  
  return (
    <main className="projects">
      <h1>Projetos</h1>
      <ProjectsCards projects={projects || []} />
    </main>
  )
}

export default Projects