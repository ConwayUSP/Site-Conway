import whiteDecoration from '@assets/home/decoration_white.png'
import blackDecoration from '@assets/home/decoration_black.png'
import './DecoratedTitle.css'

export default function DecoratedTitle({ children, as: Tag = 'h2', dark = false, id }) {
  const decoration = dark ? blackDecoration : whiteDecoration
  return (
    <Tag id={id} className={`home-title${dark ? ' home-title--dark' : ''}`}>
      <img className="home-title__left" src={decoration} alt="" aria-hidden="true" />
      <span>{children}</span>
      <img src={decoration} alt="" aria-hidden="true" />
    </Tag>
  )
}
