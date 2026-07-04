import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './Project.css'

// Hooks
import { useProject } from '@hooks/projects/useProject';
import Skeleton from 'react-loading-skeleton';

function Project() {
  const { id } = useParams()
  const { data: project, isLoading: isLoadingProject, isFetching: isFetchingProject } = useProject(id)

  const cover = project?.cover?.external?.url || project?.cover?.file?.url
  const projectName = project?.properties?.["Nome do Projeto"]?.title?.[0]?.text?.content
  const icon = project?.icon
  const repo = project?.properties?.["Repositório"]?.url
  const description = project ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis." : ""

  console.log('Project:', project)
  
  return (
    <main className="project">
      <section className='project-photo'>
        <div className='project-photo-container'>
          {isLoadingProject ? 
            <Skeleton 
              height="100%"
            />
          : (
            <img src={cover} alt={projectName} />
          )}

        </div>
      </section>
      <section 
        className='project-content'
        {...(icon && { style: { "--icon": `"${icon}"` } })}
      >
        <h2>{projectName || <Skeleton />}</h2>
        <p>{description || <Skeleton count={5} />}</p>
        <div className="project-buttons">
          {repo && (
            <a className="project-btn" href={repo} target="_blank" rel="noopener noreferrer">
              Repositório GitHub
            </a>
          )}
        </div>
      </section>
    </main>
  )
}

export default Project