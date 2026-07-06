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

  return (
    <VirtuosoGrid
      style={{ height: '100dvh' }}
      data={members}
      useWindowScroll
      listClassName='members-cards'
      itemContent={(index, member) => (
        <MemberCard 
          key={member.id} 
          properties={member.properties} 
          id={member.id}
          icon={member.icon}
        />
      )}
    />
  )
}

export function MemberCard({ properties, icon, id }) {

  // Color to department ID dictionary
  const colorToDepID = {
    'white' : 'DPS',
    'red' : 'DLC',
    'yellow' : 'GG',
    'blue' : 'OP'
  }

  const navigate = useNavigate()
  const memberName = properties?.["Nome"]?.title?.[0]?.text?.content
  const photo = properties?.["Fotinha"]?.files?.[0]?.file?.url || properties?.["Foto"]?.files?.[0]?.external?.url
  const depColor = properties?.["Setor"]?.multi_select?.[0]?.color || "violet"
  const depID = colorToDepID[depColor] || "estrelinhas"

  return (
    <div 
      className="member-card" 
      // Gradient (50% alpha depColor) to #261B58
      style={{"background" : `linear-gradient(
        to right,
        color-mix(in srgb, var(--brand-${depColor}) 50%, transparent), 
        #261B58
      )`}}
      onClick={() => navigate(`./${id}`)}
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
        {...(icon && { style: { "--icon": `"${icon}"` } })}
      >
        <h2>{memberName}</h2>
      </div>
    </div>
  )
}

function MemberCardSkeleton() {
  return (
    <Skeleton 
      style={{ borderRadius: '8px', aspectRatio: '4 / 3' }}
    />
  )
}