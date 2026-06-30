import { Link, useParams } from 'react-router-dom';
import { ChapterView } from '../components/ChapterView';
import trilhasConfig from '../trilhasConfig.json';

export function ChapterRouteWrapper() {
  const { trailId, chapterIndex } = useParams();
  const currentIndex = parseInt(chapterIndex, 10);
  const trail = trilhasConfig[trailId];

  if (!trail) return <h2 style={{ padding: '2rem' }}>Trilha não encontrada</h2>;
  const chapter = trail.chapters[currentIndex];
  if (!chapter) return <h2 style={{ padding: '2rem' }}>Capítulo não encontrado</h2>;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < trail.chapters.length - 1;

  return (
    <div className={`trail-page ${trail.themeClass}`}>
    <div className='container-reading'>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link to={`/trilha/${trailId}`} style={{textDecoration: 'none', color: 'var(--cor-url)'}}>Voltar para a Trilha</Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {hasPrev && <Link to={`/trilha/${trailId}/capitulo/${currentIndex - 1}`} style={{ textDecoration: 'none',color: 'var(--cor-url)' }}>Anterior</Link>}
          {hasPrev && hasNext && <span style={{color: 'var(--cor-url)'}}> | </span>}
          {hasNext && <Link to={`/trilha/${trailId}/capitulo/${currentIndex + 1}`} style={{ textDecoration: 'none', color: 'var(--cor-url)' }}>Próximo</Link>}
        </div>
      </nav>

      <ChapterView repoRootUrl={trail.repoRootUrl} filepath={chapter.filepath} />

      <nav className='nav-bar nav-bar-footer'>
        {hasPrev ? (
          <Link to={`/trilha/${trailId}/capitulo/${currentIndex - 1}`} style={{ textDecoration: 'none', color: 'var(--cor-url)' }}>{'< ' + trail.chapters[currentIndex - 1].title}</Link>
        ) : <span />}
        {hasNext ? (
          <Link to={`/trilha/${trailId}/capitulo/${currentIndex + 1}`} style={{ textDecoration: 'none', color: 'var(--cor-url)' }}>{trail.chapters[currentIndex + 1].title + ' >'}</Link>
        ) : <span />}
      </nav>
    </div>
    </div>
  );
}
