import { Link, useParams } from 'react-router-dom';
import trilhasConfig from '../trilhasConfig.json';

export function TrilhaIndexView() {
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
    <div className={`trail-page ${trail.themeClass}`}>
    <div className='container-reading'>
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--cor-destaque)' }}>⬅ Voltar para o Início</Link>
      
      <h1 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>{trail.name}</h1>
      <p style={{ color: 'var(--cor-texto-mutado)', marginBottom: '2.5rem' }}>{trail.description}</p>

      <h2>Conteúdos da Trilha</h2>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {trail.chapters.map((chapter, index) => (
          <Link 
            key={chapter.id} 
            to={`/trilha/${trailId}/capitulo/${index}`}
            style={{ 
              padding: '1.2rem', 
              background: 'var(--bg-secundario)', 
              border: '1px solid var(--cor-borda)', 
              borderRadius: '6px', 
              color: 'var(--cor-texto)', 
              textDecoration: 'none',
              display: 'block' // Transforma o link em um bloco que ocupa 100% da largura
            }}
          >
            <strong style={{ display: 'block', fontSize: '1.1rem' }}>{chapter.title}</strong>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}
