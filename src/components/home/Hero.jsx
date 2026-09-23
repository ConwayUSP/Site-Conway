import down from '@assets/home/down.png'
import './Hero.css'

export default function Hero() {
  return (
    <section className="home-hero" aria-label="Apresentação da Conway">
      {/* Área reservada para a futura implementação do shader. */}
      <div className="home-hero__shader" aria-hidden="true" />
      <a className="home-hero__next" href="#sobre-conway" aria-label="Conheça a Conway">
        <img src={down} alt="" width="47" height="36" />
      </a>
    </section>
  )
}
