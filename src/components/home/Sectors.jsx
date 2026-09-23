import dlcTexture from '@assets/home/dlc_bg.png'
import ggTexture from '@assets/home/gg_bg.png'
import opTexture from '@assets/home/op_bg.png'
import dlcImagery from '@assets/setores/imagery/DLC.png'
import ggImagery from '@assets/setores/imagery/GG.png'
import opImagery from '@assets/setores/imagery/OP.png'
import DecoratedTitle from './DecoratedTitle'
import './Sectors.css'

const sectors = [
  { id: 'dlc', title: 'DLC', name: 'Design e Comunicação', texture: dlcTexture, imagery: dlcImagery, description: 'DLC (Design e Comunicação) é o setor responsável por criar e produzir conteúdo para as redes sociais da Conway, como o Instagram e o YouTube. É onde nossas ideias ganham identidade e chegam a mais pessoas.' },
  { id: 'gg', title: 'GG', name: 'Gestão de Gente', texture: ggTexture, imagery: ggImagery, description: 'GG (Gestão de Gente) tem a missão de trazer conforto e segurança aos membros, tornando a entidade acolhedora às necessidades de cada um. Também é responsável por organizar nossos processos seletivos semestrais.' },
  { id: 'op', title: 'OP', name: 'Organização de Projetos', texture: opTexture, imagery: opImagery, description: 'OP (Organização de Projetos) cuida do ciclo de vida de cada projeto da Conway. No dia a dia, ajuda os membros a formalizar e organizar suas ideias, acompanhando o caminho entre os primeiros conceitos e sua realização.' },
]

export default function Sectors() {
  return (
    <div className="home-sectors">
      {sectors.map(sector => (
        <section key={sector.id} className={`home-sector home-sector--${sector.id}`} aria-label={sector.name}>
          <img className="home-sector__texture" src={sector.texture} alt="" loading="lazy" aria-hidden="true" />
          <div className="home-sector__content">
            <DecoratedTitle dark>{sector.title}</DecoratedTitle>
            <p>{sector.description}</p>
          </div>
          <img className="home-sector__imagery" src={sector.imagery} alt="" loading="lazy" aria-hidden="true" />
        </section>
      ))}
    </div>
  )
}
