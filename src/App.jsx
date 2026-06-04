import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TrilhaIndexView } from './pages/TrilhaIndexView';
import { ChapterRouteWrapper } from './pages/ChapterRouteWrapper';

// estilo geral do site, define principalmente a "forma"
import './styles/global.css';

// paletas de cor de cada trilha
import './styles/theme-opengl.css';
import './styles/theme-github.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trilha/:trailId" element={<TrilhaIndexView />} />
        <Route path="/trilha/:trailId/capitulo/:chapterIndex" element={<ChapterRouteWrapper />} />
      </Routes>
    </HashRouter>
  );
}
