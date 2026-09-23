import founders from '@assets/home/fundadores.jpg'
import DecoratedTitle from './DecoratedTitle'
import AboutSection from './AboutSection'
import './About.css'

export default function About() {
  return (
    <section className="home-about" id="sobre-conway" aria-labelledby="conway-title">
      <div className="home-about__intro">
        <DecoratedTitle as="h1" id="conway-title">CONWAY</DecoratedTitle>
        <p>A melhor e maior entidade de Desenvolvimento de Jogos<br className="home-about__break" /> e Computação Gráfica da USP.</p>
      </div>
      <AboutSection id="historia" title="História">
        <p>A Conway surgiu em 2025, na EACH (USP Leste), reunindo pessoas com uma vontade em comum: criar, experimentar e aprender com o desenvolvimento de jogos e a computação gráfica.</p>
        <img src={founders} alt="Integrantes fundadores da Conway reunidos na EACH" width="1280" height="960" loading="lazy" />
      </AboutSection>
      <AboutSection id="filosofia" title="Filosofia" reverse>
        <p>Somos uma entidade orientada a projetos. Aqui, todo membro tem liberdade e incentivo para criar seu próprio projeto e participar dos projetos dos demais. Aprendemos juntos, compartilhando ideias e transformando curiosidade em criação.</p>
      </AboutSection>
      <AboutSection id="setores" title="Setores">
        <p>Três setores ajudam a Conway a acontecer: Design e Comunicação, Gestão de Gente e Organização de Projetos. Cada um contribui para que nossas ideias encontrem espaço, apoio e pessoas para ganhar vida.</p>
      </AboutSection>
    </section>
  )
}
