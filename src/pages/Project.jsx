import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './Project.css'

// Hooks
import { useProject } from '@hooks/projects/useProject';

function Project() {
  const { id } = useParams()
  const { data: project, isLoading: isLoadingProject, isFetching: isFetchingProject } = useProject(id)

  const cover = project?.cover?.external?.url || project?.cover?.file?.url
  const projectName = project?.properties?.["Nome do Projeto"]?.title?.[0]?.text?.content
  const icon = project?.icon
  const repo = project?.properties?.["Repositório"]?.url

  console.log('Project:', project)
  
  return (
    <main className="project">
      <section className='project-photo'>
        <img src={cover}/>
      </section>
      <section 
        className='project-content'
        {...(icon && { style: { "--icon": `"${icon}"` } })}
      >
        <h2>{projectName}</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis.</p>
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