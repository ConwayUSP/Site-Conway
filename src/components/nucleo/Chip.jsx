import './Chip.css'

export function Chip({ children, ...props}) {
  return (
    <div className='chip-container' {...props}>
      {children}
    </div>
  )
}