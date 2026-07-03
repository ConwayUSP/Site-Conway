import './MemberCard.css'

export function MemberCards({ members }) {
  return (
    <div className="members-cards">
      {members && members.map((member) => (
        <MemberCard 
          key={member.id} 
          properties={member.properties} 
          icon={member.icon}
        />
      ))}
    </div>
  )
}

export function MemberCard({ properties, icon }) {
  const memberName = properties?.["Nome"]?.title?.[0]?.text?.content
  const photo = properties?.["Fotinha"]?.files?.[0]?.file?.url || properties?.["Foto"]?.files?.[0]?.external?.url

  return (
    <div className="member-card">
      <img src={photo} alt={memberName || 'Member Photo'} />
      <div 
        className="member-card-content"
        {...(icon && { style: { "--icon": `"${icon}"` } })}
      >
        <h2>{memberName}</h2>
      </div>
    </div>
  )
}