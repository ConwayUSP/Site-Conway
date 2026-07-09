import './ProjectLabel.css'

export function BadgesIcons({ badges }) {
  return (
    <div className="badges-icons">
      {badges.map(badge => (
        <div 
          key={badge.id}
          className="badge-icon"
          title={badge.name}
        >
          <img src={badge.icon} />
        </div>
      ))}
    </div>
  )
}