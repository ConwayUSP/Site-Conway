import { VirtuosoGrid } from 'react-virtuoso'
import { useNavigate } from 'react-router-dom'
import './MemberCard.css'
import Skeleton from 'react-loading-skeleton'

// Department textures
import estrelinhas from '@assets/setores/textures/estrelinhas.png'
import DPS from '@assets/setores/textures/DPS.png'
import DLC from '@assets/setores/textures/DLC.png'
import GG from '@assets/setores/textures/GG.png'
import OP from '@assets/setores/textures/OP.png'
import TitleIconic from '../TitleIconic'
import { use, useMemo } from 'react'

const textures = {
  estrelinhas,
  DPS,
  DLC,
  GG,
  OP
}

export function MemberCards({ members }) {
  if (!members || members.length === 0) {
    const skeletons = Array.from({ length: 12 }, (_, index) => (
      <MemberCardSkeleton key={index} />
    ))
    return (
      <div className="members-cards">
        {skeletons}
      </div>
    )
  }

  const membersAtivos = useMemo(() => members?.filter(member => member.properties.Status.status.name === 'Ativo') || [], [members]);
  const membersAFK = useMemo(() => members?.filter(member => member.properties.Status.status.name === 'AFK') || [], [members]);

  return (
    <div className="members-cards-wrapper">
      <div className='members-cards-section'>
        <span className='member-card-label'>Ativos</span>
        <VirtuosoGrid
          // style={{ height: '100dvh' }}
          data={membersAtivos}
          useWindowScroll
          listClassName='members-cards'
          itemClassName='member-card-wrapper'
          itemContent={(index, member) => (
            <MemberCard
              key={member.id}
              properties={member.properties}
              id={member.id}
              icon={member.icon}
            />
          )}
        />
      </div>
      <div className='members-cards-section'>
        <span className='member-card-label'>AFK</span>
        <VirtuosoGrid
          // style={{ height: '100dvh' }}
          data={membersAFK}
          useWindowScroll
          listClassName='members-cards'
          itemClassName='member-card-wrapper'
          itemContent={(index, member) => (
            <MemberCard 
              key={member.id} 
              properties={member.properties} 
              id={member.id}
              icon={member.icon}
            />
          )}
          />
      </div>
    </div>
  )
}

export function MemberCard({ properties, icon, id }) {

  // Color to department ID dictionary
  const colorToDepID = {
    'gray' : 'DPS',
    'red' : 'DLC',
    'yellow' : 'GG',
    'blue' : 'OP'
  }

  const navigate = useNavigate()
  const memberName = properties?.["Nome"]?.title?.[0]?.text?.content
  const photo = properties?.["Fotinha"]?.files?.[0]?.file?.url || properties?.["Foto"]?.files?.[0]?.external?.url
  const depColor = properties?.["Setor"]?.multi_select?.find(option => option.color === 'gray')?.color || properties?.["Setor"]?.multi_select?.[0]?.color || "violet"
  const depID = colorToDepID[depColor] || "estrelinhas"

  return (
    <button 
      className="member-card" 
      // Gradient (50% alpha depColor) to #261B58
      style={{"background" : `linear-gradient(
        to right,
        color-mix(in srgb, var(--brand-${depColor}) 50%, transparent), 
        #261B58
      )`}}
      onClick={() => navigate(`./${id}`)}
      aria-label={`Membro ${memberName || 'Sem Nome'}`}
    >
      <div className="member-card-texture">
        <img
          src={textures[depID]}
        />
      </div>
      <img 
        src={photo} 
        alt={memberName || 'Member Photo'} 
        loading="lazy"
      />
      <div 
        className="member-card-content"
      >
        <TitleIconic title={memberName} icon={icon}/>
      </div>
    </button>
  )
}

function MemberCardSkeleton() {
  return (
    <Skeleton 
      style={{ borderRadius: '8px', aspectRatio: '4 / 3' }}
    />
  )
}