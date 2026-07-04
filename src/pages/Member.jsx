import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './Member.css'

// Hooks
import { useMember } from '@hooks/members/useMember'
import { useProjectsByIds } from '@hooks/projects/useProjectsByIds';

// Components
import { ProjectsLabels } from '@components/projects/ProjectLabel';
import Skeleton from 'react-loading-skeleton';

function Member() {
  const { id } = useParams()
  const { data: member, isLoading: isLoadingMember, isFetching: isFetchingMember } = useMember(id)
  const { data: memberProjects } = useProjectsByIds(member?.properties?.["Projetos"]?.relation)

  const photo = member?.properties?.["Fotinha"]?.files?.[0]?.file?.url || member?.properties?.["Foto"]?.files?.[0]?.external?.url
  const memberName = member?.properties?.["Nome"]?.title?.[0]?.text?.content
  const icon = member?.icon
  const description = member ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis." : ""
  
  return (
    <main className="member">
      <section className='member-photo'>
        <div className='member-photo-container'>
          {isLoadingMember ? 
            <Skeleton 
              height="100%"
            /> :
            <img src={photo}/>
          }
        </div>
      </section>
      <section 
        className='member-content'
        {...(icon && { style: { "--icon": `"${icon}"` } })}
      >
        <h2>{memberName || <Skeleton/>}</h2>
        <p>{description || <Skeleton count={5}/>}</p>
        {memberProjects?.length > 0 && (
          <>
            <h3>Projetos</h3>
            <ProjectsLabels projects={memberProjects || []} />
          </>
        )}
      </section>
    </main>
  )
}

export default Member