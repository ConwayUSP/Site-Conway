import { Link } from 'react-router-dom';
import trilhasConfig from '../trilhasConfig.json';

export function Home() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Portal de Trilhas</h1>
        <p style={{ color: '#aaa' }}>Selecione uma trilha para começar a estudar</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {Object.entries(trilhasConfig).map(([id, trail]) => (
          <Link 
            key={id} 
            to={`/trilha/${id}`}
            style={{ 
              border: '1px solid #333', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              background: '#1a1a1a',
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none', // Remove o sublinhado do link
              color: 'inherit',       // Herda a cor do texto padrão
              cursor: 'pointer'
            }}
          >
            <img 
              src={trail.thumbnail} 
              alt={trail.name} 
              style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{trail.name}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
                {trail.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
