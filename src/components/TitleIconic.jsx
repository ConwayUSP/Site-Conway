import Skeleton from "react-loading-skeleton";

import './TitleIconic.css'

export default function TitleIconic({title, icon, className}) {
  return (
    <h2 className="title-iconic">
      <Icon icon={icon}/>
      {title || <Skeleton/>}
    </h2>
  )
}

function Icon({icon}) {
  if (!icon) return null;

  if (icon.type === 'emoji') {
    return <span className='icon-emoji'>{icon.emoji}</span>;
  }

  if (icon.type === 'file') {
    return <img  className="icon-file" src={icon.file.url} />
  }
}