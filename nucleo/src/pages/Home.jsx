import { Link } from 'react-router-dom';
import trilhasConfig from '../trilhasConfig.json';

export function Home() {
  return (
    <div className="home-container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--cor-texto)' }}>Portal de Trilhas</h1>
        <p style={{ color: 'var(--cor-texto-mutado)' }}>Selecione uma trilha para começar a estudar</p>
      </header>

      <div className="trails-grid">
        {Object.entries(trilhasConfig).map(([id, trail]) => (
          <Link 
            key={id} 
            to={`/trilha/${id}`}
            // Injetamos a classe do card E a classe do tema da trilha!
            className={`card-trilha ${trail.themeClass}`} 
          >
            <img 
              src={trail.thumbnail} 
              alt={trail.name} 
            />
            <div className="card-trilha-content">
              <h3>{trail.name}</h3>
              <p>{trail.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
