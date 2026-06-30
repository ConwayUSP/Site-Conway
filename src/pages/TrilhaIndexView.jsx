import { Link, useParams } from 'react-router-dom';
import trilhasConfig from '@data/trilhasConfig.json';
import './TrilhaIndexView.css';

// paletas de cor de cada trilha
import '@styles/theme-opengl.css';
import '@styles/theme-github.css';

function TrilhaIndexView() {
  const { trailId } = useParams();
  const trail = trilhasConfig[trailId];

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
        
        <h1 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>{trail.name}</h1>
        <p style={{ color: 'var(--cor-texto-mutado)', marginBottom: '2.5rem' }}>{trail.description}</p>

        <h2>Conteúdos da Trilha</h2>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trail.chapters.map((chapter, index) => (
            <Link 
              key={chapter.id} 
              to={`/nucleo/trilha/${trailId}/capitulo/${index}`}
              style={{
                padding: '1.2rem', 
                background: 'var(--bg-secundario)', 
                borderLeft: '3px solid var(--cor-borda)', 
                borderRadius: '0px 0.3px 0.3rem 0px', 
                color: 'var(--cor-texto)', 
                textDecoration: 'none',
                display: 'block'
              }}
            >
              <strong style={{ display: 'block', fontSize: '1.1rem' }}>{chapter.title}</strong>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default TrilhaIndexView
