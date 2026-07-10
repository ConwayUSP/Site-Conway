import { useEffect } from 'react'
import './Projects.css'

// Hooks
import { useProjects } from '@hooks/projects/useProjects'

import { ProjectsCards } from '@components/projects/ProjectCard'

function Projects() {
  const { data: projects, isLoading: isLoadingProjects, isFetching: isFetchingProjects } = useProjects()
  
  return (
    <main className="projects">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--cor-texto)' }}>Painel de projetos</h1>
        <p style={{ color: 'var(--cor-texto-mutado)' }}>Confira os projetos da Conway</p>
      </header>
      <ProjectsCards projects={projects || []} />
    </main>
  )
}

export default Projects