import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChapterView } from '@components/ChapterView';
import ChevronIcon from '@components/nucleo/ChevronIcon';
import trilhasConfig from '@data/trilhasConfig.json';

import './ChapterRouteWrapper.css';

function ChapterRouteWrapper() {
  const { trailId, chapterIndex } = useParams();
  const navigate = useNavigate();
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
      <nav className="chapter-header-navigation">
        <button type="button" className="trail-navigation-link" onClick={() => navigate(-1)}>
          <ChevronIcon direction="left" />
          Voltar para a Trilha
        </button>
        <div className="chapter-navigation">
          {hasPrev && (
            <Link to={`../trilha/${trailId}/capitulo/${currentIndex - 1}`} className="trail-navigation-link">
              <ChevronIcon direction="left" />
              Anterior
            </Link>
          )}
          {hasNext && (
            <Link to={`../trilha/${trailId}/capitulo/${currentIndex + 1}`} className="trail-navigation-link trail-navigation-link--next">
              Próximo
              <ChevronIcon direction="right" />
            </Link>
          )}
        </div>
      </nav>

      <ChapterView repoRootUrl={trail.repoRootUrl} filepath={chapter.filepath} />

      <nav className='nav-bar nav-bar-footer'>
        {hasPrev ? (
          <Link to={`../trilha/${trailId}/capitulo/${currentIndex - 1}`} className="trail-navigation-link">
            <ChevronIcon direction="left" />
            {trail.chapters[currentIndex - 1].title}
          </Link>
        ) : <span />}
        {hasNext ? (
          <Link to={`../trilha/${trailId}/capitulo/${currentIndex + 1}`} className="trail-navigation-link trail-navigation-link--next">
            {trail.chapters[currentIndex + 1].title}
            <ChevronIcon direction="right" />
          </Link>
        ) : <span />}
      </nav>
    </div>
    </div>
  );
}

export default ChapterRouteWrapper
