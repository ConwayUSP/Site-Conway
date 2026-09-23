import './AboutSection.css'

export default function AboutSection({ id, title, reverse = false, children }) {
  return (
    <section className={`home-story${reverse ? ' home-story--reverse' : ''}`} aria-labelledby={id}>
      <h2 id={id} className="home-story__title"><span>{title}</span></h2>
      <div className="home-story__content">{children}</div>
    </section>
  )
}
