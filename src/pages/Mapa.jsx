import { useEffect } from 'react'
import isSmallScreen from '@utils/isSmallScreen'
import './Mapa.css'
import CursoCard from '@components/mapa/CursoCard'
import HomeButton from '@components/mapa/HomeButton'
import TrilhaCard from '@components/mapa/TrilhaCard'
import Tracejado from '@components/Tracejado'

/*
Para adicionar uma nova trilha, crie uma nova seção. Dentro dela, adicione um TrilhaCard, CursoCards e Tracejados para conectar os cards.
Leia a especificação de como usar cada componente em seus respectivos arquivos.
*/

function Mapa() {
  
  useEffect(() => {
    window.scroll({
      top: document.documentElement.scrollHeight / 2 - window.innerHeight / 2,
      left: document.documentElement.scrollWidth / 2 - window.innerWidth / 2,
      behavior: 'smooth'
    })
  }, []);

  return (
    <main className="mapa">
      
      <HomeButton id="home-button" />

      <section className="trilha-membros">
        {/* Início da trilha */}
        <TrilhaCard id="membros-card" line1="Trilha de" line2="Membros" icon="connie" type=""/>

        <Tracejado id="trilha_conhecimentos" comeco="circulo" final="seta" d="M4 48 V0" />

        {/* Conhecimentos Gerais */}
        <div className="topico-wrapper">
          <CursoCard id="c" file={"c"} type="horizontal"/>
          <CursoCard id="git" file={"git"} type="horizontal"/>
          <CursoCard id="arte" file={"arte"} type="horizontal"/>
        </div>
        <header className="topico-title">Conhecimentos Gerais</header>

        {/* Rotas de tracejados */}
        <div className="rotas-container">
            <Tracejado id="trilha_materiais-1" final="" d="M147.849 112 V0" />
            <Tracejado id="trilha_materiais-2" final="seta" d="M147.849 64.2889 C147.849 57.8088 142.596 52.5556 136.116 52.5555 H113.582 C107.102 52.5555 101.849 47.3023 101.849 40.8222 V0" />
            <Tracejado id="trilha_tresd" final="seta" d="M147.849 131.461 C147.849 124.98 142.596 119.727 136.116 119.727 H15.5823 C9.1022 119.727 3.849 114.474 3.849 107.994 V82" />
            <Tracejado id="trilha_cpp" final="seta" d="M147.849 140.197 C147.849 133.717 153.102 128.463 159.582 128.463 H184.116 C190.596 128.463 195.849 123.21 195.849 116.73 V88" />
            <Tracejado id="trilha_lua" final="seta" d="M147.849 140.197 C147.849 133.717 153.102 128.463 159.582 128.463 H280.116 C286.596 128.463 291.849 123.21 291.849 116.73 V88" />
        
            <Tracejado id="tresd_godot" comeco="circulo" final="seta" d="M5.04456 48 V0" />
            <Tracejado id="cpp_opengl" comeco="circulo" final="seta" d="M5.04456 64 V0" />
            <Tracejado id="lua_doisd" comeco="circulo" final="seta" d="M5.04456 64 V0" />
        </div>
        
        {/* Cards dos cursos */}
        <div className="cursos-container">
            <CursoCard id="godot" file={"godot"} type=""/>
            <CursoCard id="material" file={"material"} type=""/>
            <CursoCard id="opengl" file={"opengl"} type=""/>
            <CursoCard id="doisd" file={"2d"} type=""/>
            <CursoCard id="tresd" file={"3d"} type=""/>
            <CursoCard id="cpp" file={"cpp"} type=""/>
            <CursoCard id="lua" file={"lua"} type=""/>
        </div>
      </section>
    </main>
  )
}

export default Mapa