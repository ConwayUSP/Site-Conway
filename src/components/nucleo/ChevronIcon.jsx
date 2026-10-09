import './ChevronIcon.css'

function ChevronIcon({ direction = 'down' }) {
  return (
    <span
      className={`chevron-icon chevron-icon--${direction}`}
      aria-hidden="true"
    />
  )
}

export default ChevronIcon
