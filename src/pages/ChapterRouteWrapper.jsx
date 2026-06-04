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
    <div className={`trail-page ${trail.themeClass}`} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link to={`/trilha/${trailId}`} style={{ textDecoration: 'none', color: '#646cff' }}>⬅ Voltar para a Trilha</Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {hasPrev && <Link to={`/trilha/${trailId}/capitulo/${currentIndex - 1}`} style={{ textDecoration: 'none', color: '#646cff' }}>Anterior</Link>}
          {hasNext && <Link to={`/trilha/${trailId}/capitulo/${currentIndex + 1}`} style={{ textDecoration: 'none', color: '#646cff' }}>Próximo</Link>}
        </div>
      </nav>

      <h1>{chapter.title}</h1>
      <ChapterView repoRootUrl={trail.repoRootUrl} filepath={chapter.filepath} />

      <nav style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
        {hasPrev ? (
          <Link to={`/trilha/${trailId}/capitulo/${currentIndex - 1}`} style={{ textDecoration: 'none', color: '#646cff' }}>⬅ {trail.chapters[currentIndex - 1].title}</Link>
        ) : <span />}
        {hasNext ? (
          <Link to={`/trilha/${trailId}/capitulo/${currentIndex + 1}`} style={{ textDecoration: 'none', color: '#646cff' }}>{trail.chapters[currentIndex + 1].title} ➡</Link>
        ) : <span />}
      </nav>
    </div>
  );
}
