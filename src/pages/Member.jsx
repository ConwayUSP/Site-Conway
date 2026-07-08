import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './Member.css'

// Hooks
import { useMember } from '@hooks/members/useMember'
import { useProjectsByIds } from '@hooks/projects/useProjectsByIds';
import { useBadgesByIds } from '@hooks/badges/useBadgesByIds';

// Components
import { ProjectsLabels } from '@components/projects/ProjectLabel';
import Skeleton from 'react-loading-skeleton';

// Department bg imagery
import DPSimg from '@assets/setores/imagery/DPS.png'
import DLCimg from '@assets/setores/imagery/DLC.png'
import GGimg from '@assets/setores/imagery/GG.png'
import OPimg from '@assets/setores/imagery/OP.png'
const imagery = { DPSimg, DLCimg, GGimg, OPimg }

// Department icons
import DPSicon from '@assets/setores/icons/DPS.png'
import DLCicon from '@assets/setores/icons/DLC.png'
import GGicon from '@assets/setores/icons/GG.png'
import OPicon from '@assets/setores/icons/OP.png'
const icons = { DPSicon, DLCicon, GGicon, OPicon }


function Member() {
  // Color to department ID dictionary
  const colorToDepID = {
    'gray' : 'DPS',
    'red' : 'DLC',
    'yellow' : 'GG',
    'blue' : 'OP'
  }

  const { id } = useParams()
  const { data: member, isLoading: isLoadingMember, isFetching: isFetchingMember } = useMember(id)
  const { data: memberProjects } = useProjectsByIds(member?.properties?.["Projetos"]?.relation)
  const { data: memberBadges } = useBadgesByIds(member?.properties?.["Selos"]?.relation)

  const photo = member?.properties?.["Fotinha"]?.files?.[0]?.file?.url || member?.properties?.["Foto"]?.files?.[0]?.external?.url
  const memberName = member?.properties?.["Nome"]?.title?.[0]?.text?.content
  const icon = member?.icon
  const description = member ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae totam minima, vitae consequuntur ad nemo voluptatem? Delectus in facere voluptatibus quas debitis, alias odio sit accusamus eum atque optio veritatis." : ""
  const depColor = member?.properties?.["Setor"]?.multi_select?.[0]?.color
  const depID = colorToDepID[depColor]

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
        <div className='member-content-about'>
          <img className='bg-img' src={imagery[`${depID}img`]}/>
          <h2>{memberName || <Skeleton/>}</h2>
          <p>{description || <Skeleton count={5}/>}</p>
          <img className='icon' src={icons[`${depID}icon`]} alt={depID} />
        </div>
        <div className='member-content-involviment'>
          {memberBadges?.length > 0 && (
            <MemberBadges badges={memberBadges || []} />
          )}
          {memberProjects?.length > 0 && (
            <div className='member-projects-display'>
              <h3>Projetos</h3>
              <ProjectsLabels projects={memberProjects || []} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function MemberBadges({ badges }) {
  return (
    <div className='member-badges-display'>
      {badges.map(badge => (
        <div className='member-badge' key={badge.id} data-tooltip={badge.name}>
          <img src={badge.icon} />
        </div>
      ))}
    </div>
  )
}

export default Member