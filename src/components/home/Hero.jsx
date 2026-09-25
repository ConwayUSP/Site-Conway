import down from '@assets/home/down.png'
import HeroShader from './HeroShader'
import './Hero.css'

export default function Hero() {
  return (
    <section className="home-hero" aria-label="Apresentação da Conway">
      <div className="home-hero__shader">
        <HeroShader />
      </div>
      <a className="home-hero__next" href="#sobre-conway" aria-label="Conheça a Conway">
        <img src={down} alt="" width="47" height="36" />
      </a>
    </section>
  )
}
