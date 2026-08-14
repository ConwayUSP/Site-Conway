import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import './TrilhaIndexView.css';

import { ProgressBar } from '@components/nucleo/progressBar.jsx';
import { MarkAsReadButton } from '@components/nucleo/markAsReadButton.jsx';

import { useLocalStorage } from '@hooks/useLocalStorage';
import { useNucleo } from '@hooks/useNucleo';

import trilhasConfig from '@data/trilhasConfig.json';

// paletas de cor de cada trilha
import '@styles/theme-opengl.css';
import '@styles/theme-github.css';

function TrilhaIndexView() {
  const { trailId } = useParams();

  const { isChapterRead } = useNucleo()

  const trail = trilhasConfig[trailId] || [];

  if (!trail) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Trilha não encontrada</h2>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  return (
    <main className={`trail-page ${trail.themeClass}`}>
      <div className='container-reading'>
        <Link to=".." style={{ textDecoration: 'none', color: 'var(--cor-url)' }}>Voltar para o Núcleo</Link>
        
        <div style={{marginBottom: '1rem'}}>
          <h1 className="trail-name">{trail.name}</h1>
          <MarkAsReadButton id={trailId} />
        </div>
        <p style={{ color: 'var(--cor-texto-mutado)', marginBottom: '2.5rem' }}>{trail.description}</p>

        <p style={{ marginBottom: '0.5rem' }}>Progresso na leitura:</p>
        <ProgressBar id={trailId} />
        
        <h2>Conteúdos da Trilha</h2>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trail.chapters.map((chapter, index) => (
            <Link 
              className="chapter-link"
              key={chapter.id} 
              to={`/nucleo/trilha/${trailId}/capitulo/${index}`}
            >
              <strong style={{ 
                display: 'inline-block', 
                fontSize: '1.1rem',
                position: 'relative',
              }}>
                {chapter.title}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "currentColor",
                    originX: 0
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isChapterRead(trailId, index) ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </strong>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default TrilhaIndexView
