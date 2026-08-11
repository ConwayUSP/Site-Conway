import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtuosoGrid } from 'react-virtuoso'
import Skeleton from 'react-loading-skeleton'

import './ProjectCard.css'
import enfeitinho from '@assets/icons/enfeitinho.svg'

export function ProjectsCards({ projects }) {
  if (!projects || projects.length === 0) {
    const skeletons = Array.from({ length: 12 }, (_, index) => (
      <ProjectCardSkeleton key={index} />
    ))
    return (
      <div className="projects-cards">
        {skeletons}
      </div>
    )
  }

  console.log(projects)

  const projectsAtivos = useMemo(() => projects?.filter(member => member.properties.Status.status.name === 'Na Ativa') || [], [projects]);
  const projectsFinalizados = useMemo(() => projects?.filter(member => member.properties.Status.status.name === 'Finalizado') || [], [projects]);

  return (
    <div className="projects-cards-wrapper">
      <div className='projects-cards-section'>
        <span className='project-card-label'>Em andamento</span>
        <VirtuosoGrid
          data={projectsAtivos}
          useWindowScroll
          listClassName='projects-cards'
          itemContent={(index, project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              cover={project.cover} 
              properties={project.properties} 
              icon={project.icon}
            />
          )}
        />
      </div>
      <div className='projects-cards-section'>
        <span className='project-card-label'>Finalizados</span>
        <VirtuosoGrid
          data={projectsFinalizados}
          useWindowScroll
          listClassName='projects-cards'
          itemContent={(index, project) => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              cover={project.cover} 
              properties={project.properties} 
              icon={project.icon}
            />
          )}
        />
      </div>
    </div>
  )
}

export function ProjectCard({ cover, properties, icon, id }) {
  const navigate = useNavigate()
  const projectName = properties?.["Nome do Projeto"]?.title?.[0]?.text?.content

  return (
    <div 
      className="project-card"
      onClick={() => navigate(`./${id}`)}
    >
      <img src={cover} alt={properties?.Nome?.title[0]?.text?.content || 'Project Cover'} />
      <div 
        className="project-card-content" 
        style={{
          "--icon": `"${icon}"`,
           "backgroundColor" : "color-mix(in srgb, var(--bg-primary) 65%, transparent)",
           "backdropFilter" : "blur(4px)"
        }}
      >
        <img src={enfeitinho} />
        <h2>{projectName}</h2>
      </div>
    </div>
  )
}

function ProjectCardSkeleton() {
  return (
    <Skeleton 
      style={{ borderRadius: '8px', aspectRatio: '4 / 3' }}
    />
  )
}