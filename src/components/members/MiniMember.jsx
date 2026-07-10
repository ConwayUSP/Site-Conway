import { useNavigate } from 'react-router-dom'
import './MiniMember.css'

export function MiniMember({ member }) {
  const navigate = useNavigate()

  const photo = member?.properties?.["Fotinha"]?.files?.[0]?.file?.url || member?.properties?.["Foto"]?.files?.[0]?.external?.url
  const memberName = member?.properties?.["Nome"]?.title?.[0]?.text?.content || ''

  return (
    <button 
      className='project-member'
      onClick={() => navigate(`/members/${member.id}`)}
    >
      <div className='project-member-photo'>
        <img src={photo} alt={memberName} />
      </div>
      <span>{memberName.split(' ')[0]}</span>
    </button>
  )
}