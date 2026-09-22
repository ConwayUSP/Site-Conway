import './Button.css'

export function Button({children, ...props}) {
  return (
    <>
      <button className='button-quiz-modal' {...props}>
        {children}
      </button>
    </>
  )
}