import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import './Project.css'

import { MiniMember } from '@components/members/MiniMember';

// Icons
import arrowBack from '@assets/icons/arrow_back.svg'
import arrowNext from '@assets/icons/arrow_next.svg'

// Hooks
import { useProject } from '@hooks/projects/useProject';
import { useMembersByIds } from '@hooks/members/useMembersByIds';

function Project() {
  const { id } = useParams()
  const { data: project, isLoading: isLoadingProject, isFetching: isFetchingProject } = useProject(id)

  const cover = project?.cover?.external?.url || project?.cover?.file?.url
  const icon = project?.icon

  const projectName = project?.properties?.["Nome do Projeto"]?.title?.[0]?.text?.content
  const description = project?.properties?.["Descrição"]?.rich_text?.[0]?.text?.content || "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis."
  const projectTypes = project?.properties?.["Tipo"]?.multi_select

  const lider = useMembersByIds(project?.properties?.["Líder do Projeto"]?.relation)
  const acompanhantes = useMembersByIds(project?.properties?.["Acompanhantes"]?.relation)
  const projectMembers = useMembersByIds(project?.properties?.["Envolvidos"]?.relation)

  const projectScreenshots = project?.properties?.["Imagens"]?.files
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  console.log(project?.properties)

  const handlePrev = () => {
    setCurrentScreenshot(prev =>
      prev === 0 ? projectScreenshots.length - 1 : prev - 1
    )
  }
  const handleNext = () => {
    setCurrentScreenshot(prev =>
      prev === projectScreenshots.length - 1 ? 0 : prev + 1
    )
  }

  const repo = project?.properties?.["Repositório"]?.url
  const link = project?.properties?.["Link interativo"]?.url

  return (
    <>
      <main className="project">
        <section className='project-left'>
          <div className='project-photo'>
            {isLoadingProject ? 
              <Skeleton 
                height="100%"
              />
            : (
              <img src={cover} alt={projectName} />
            )}

          </div>

          <div
            className='project-content'
            {...(icon && { style: { "--icon": `"${icon}"` } })}
          >
            <h2>{projectName || <Skeleton />}</h2>
            <p>{description || <Skeleton count={5} />}</p>
          </div>

          {projectTypes && (
            <div className='project-types-container'>
              <h2>Tipo do Projeto</h2>
              <ProjectTypeLabels types={projectTypes} />
            </div>
          )}
        </section>
        <section className='project-right'>
          <div className='project-members'>
            {lider?.data?.length > 0 && (
              <div className='project-lider'>
                <h3>Líder</h3>
                {lider?.data && (
                  <MiniMember member={lider.data[0]} />
                )}
              </div>
            )}
            {acompanhantes?.data?.length > 0 && (
              <div className='project-acompanhantes'>
                <h3>Acompanhante{acompanhantes.data.length > 1 ? 's' : ''}</h3>
                {acompanhantes?.data && (
                  <div className='project-acompanhantes-list'>
                    {acompanhantes.data.map(member => (
                      <MiniMember key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {projectMembers?.data?.length > 0 && (
            <div className='project-integrants'>
              <div className='project-integrants-header'>
                <h3>Integrantes</h3>
              </div>
                <div className='project-integrants-list'>
                  {projectMembers.data.map(member => (
                    <MiniMember key={member.id} member={member} />
                  ))}
                </div>
            </div>
          )}
          <div className="project-buttons">
            {repo && (
              <a className="project-repo-btn" href={repo} target="_blank" rel="noopener noreferrer">
                Ver o Repositório
              </a>
            )}
            {link && (
              <a className="project-link-btn" href={link} target="_blank" rel="noopener noreferrer">
                Acessar o Projeto
              </a>
            )}
          </div>
        </section>
      </main>

        {projectScreenshots?.length > 0 && (
          <section className="screenshots">
            <div className="screenshots-viewport">
              <div 
              className="screenshots-content"
              style={{
                transform: `translateX(calc(-${currentScreenshot} * 22rem))`,
                transition: "transform 0.4s ease",
              }}
              >
                {projectScreenshots?.map(screenshot => (
                  <img key={screenshot.name} src={screenshot.file?.url} alt={screenshot.name}/>
                ))}
              </div>
            </div>
            <div className="screenshots-navigation">
              <div className="screenshots-navigation-btn" onClick={handlePrev}> <img src={arrowBack}/> </div>
              <div className="screenshots-navigation-btn" onClick={handleNext}> <img src={arrowNext}/> </div>
            </div>
          </section>
        )}
    </>
  )
}

function ProjectTypeLabels({ types }) {
  return (
    <div className='project-types-display'>
      {types?.map(type => (
        <div className='project-type' key={type.id}>
          <span>{type.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Project