import { useNavigate } from 'react-router-dom'
import './MiniMember.css'
import MemberPhoto from './MemberPhoto'

export function MiniMember({ member }) {
  const navigate = useNavigate()

  const optimizedPhoto = member?.properties?.["Fotinha otimizada"]?.files?.[0]
  const photo = optimizedPhoto?.file?.url
    || optimizedPhoto?.external?.url
    || member?.properties?.["Fotinha"]?.files?.[0]?.file?.url
    || member?.properties?.["Foto"]?.files?.[0]?.external?.url
  const memberName = member?.properties?.["Nome"]?.title?.[0]?.text?.content || ''
  const depColor = member?.properties?.["Setor"]?.multi_select?.find(option => option.color === 'gray')?.color
    || member?.properties?.["Setor"]?.multi_select?.[0]?.color
    || 'violet'

  return (
    <button 
      className='project-member'
      onClick={() => navigate(`/members/${member.id}`)}
    >
      <MemberPhoto
        className='project-member-photo'
        src={photo}
        alt={memberName}
        accent={depColor}
      />
      <span>{memberName.split(' ')[0]}</span>
    </button>
  )
}
