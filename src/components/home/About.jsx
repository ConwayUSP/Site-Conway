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
        <p>
          A Conway surgiu como ideia em 2024 na EACH (USP Leste), reunindo pessoas com uma vontade em comum: criar, experimentar e aprender com o desenvolvimento de jogos e a computação gráfica.
        </p>
        <p>
          No início, muito tempo foi gasto planejando a estrutura e os objetivos da entidade, visto que muitos de nossos membros fundadores participavam de outras ligas acadêmicas, e portanto tinham uma boa visão do que funcionava ou não.
          Em dado momento, foi decidido que a entidade teria uma ênfase forte em duas vertentes: realização de projetos práticos e criação de materiais educacionais. Desde então, nosso foco não mudou; muito pelo contrário, na verdade! Cada reestruturação da entidade desde então surge para nos aproximar destes objetivos.
        </p>
        <p>
          Nos meses seguintes, a primeira geração de diretores correu atrás de todas as burocracias para oficializar o grupo dentro da universidade. Por fim, em abril de 2025, a Conway se tornou finalmente uma liga acadêmica não-clandestina, com a célebre ajuda de nossos professores tutores: Helton Biscaro e Violeta Sun (e mais tarde, João Bernardes).
        </p>
        <img src={founders} alt="Integrantes fundadores da Conway reunidos na EACH" width="1280" height="960" loading="lazy" />
      </AboutSection>
      <AboutSection id="filosofia" title="Filosofia" reverse>
        <p>
          Somos uma entidade orientada a projetos. Aqui, todo membro tem total liberdade e incentivo para criar seu próprio projeto e participar dos projetos dos demais.
        </p>
        <p>
          Temos sempre em mente a ideia de que os nossos membros estão aqui por que sentem gosto pelo que fazem, e portanto tentamos oferecer o máximo de suporte e espaço para que possam transformar suas ideias em verdadeiras obras de arte.
        </p>
        <p>
          Além disso, tentamos adotar uma dinâmica horizontal em nossos setores. Os diretores são sim quem criam e distribuem tarefas, mas estão sempre de ouvidos e braços abertos para ideias e críticas levantadas por membros comuns.
        </p>
      </AboutSection>
      <AboutSection id="setores" title="Setores">
        <p>Três setores ajudam a Conway a acontecer: Design e Comunicação, Gestão de Gente e Organização de Projetos. Cada um contribui para que nossas ideias encontrem espaço, apoio e pessoas para ganhar vida.</p>
      </AboutSection>
    </section>
  )
}
