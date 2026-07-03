import { VirtuosoGrid } from 'react-virtuoso'
import './MemberCard.css'

export function MemberCards({ members }) {
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
  const navigate = useNavigate()
  const memberName = properties?.["Nome"]?.title?.[0]?.text?.content
  const photo = properties?.["Fotinha"]?.files?.[0]?.file?.url || properties?.["Foto"]?.files?.[0]?.external?.url

  return (
    <div 
      className="member-card"
      onClick={() => navigate(`./${id}`)}
    >
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