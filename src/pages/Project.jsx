import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import './Project.css'

// Hooks
import { useProject } from '@hooks/projects/useProject';
import { useMembersByIds } from '@hooks/members/useMembersByIds';

function Project() {
  const { id } = useParams()
  const { data: project, isLoading: isLoadingProject, isFetching: isFetchingProject } = useProject(id)

  const cover = project?.cover?.external?.url || project?.cover?.file?.url
  const projectName = project?.properties?.["Nome do Projeto"]?.title?.[0]?.text?.content
  const icon = project?.icon
  const repo = project?.properties?.["Repositório"]?.url
  const description = project?.properties?.["Descrição"]?.rich_text?.[0]?.text?.content || "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis."
  const lider = useMembersByIds(project?.properties?.["Líder do Projeto"]?.relation)
  const acompanhantes = useMembersByIds(project?.properties?.["Acompanhantes"]?.relation)
  const projectMembers = useMembersByIds(project?.properties?.["Envolvidos"]?.relation)
  const projectTypes = project?.properties?.["Tipo"]?.multi_select

  console.log('Project:', project)
  console.log('Líder:', lider)
  console.log('Acompanhantes:', acompanhantes)
  console.log('Membros do Projeto:', projectMembers)

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