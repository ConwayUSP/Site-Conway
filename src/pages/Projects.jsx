import { useEffect } from 'react'
import './Projects.css'

// Hooks
import { useProjects } from '../hooks/useProjects'

import { ProjectsCards } from '../components/projects/ProjectCard'

function Projects() {
  const { data: projects, isLoading: isLoadingProjects, isFetching: isFetchingProjects } = useProjects()

  console.log('Projects:', projects)
  
  return (
    <main className="projects">
      <h1>Projetos</h1>
      <ProjectsCards projects={projects || []} />
    </main>
  )
}

export default Projects