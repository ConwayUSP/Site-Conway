import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@styles/index.css'
import 'react-loading-skeleton/dist/skeleton.css'

import App from './App.jsx'

import Mapa from './pages/Mapa.jsx'
import Home from './pages/Home.jsx'
import Nucleo from './pages/Nucleo.jsx'
import Projects from './pages/Projects.jsx'
import Project from './pages/Project.jsx'
import Members from './pages/Members.jsx'
import Member from './pages/Member.jsx'
import TrilhaIndexView from './pages/TrilhaIndexView.jsx'
import ChapterRouteWrapper from './pages/ChapterRouteWrapper.jsx'
import { SkeletonTheme } from 'react-loading-skeleton'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', children: [
        { index: true, element: <Projects /> },
        { path: ":id", element: <Project /> }
      ] },
      { path: 'members', children: [
        { index: true, element: <Members/> },
        { path: ":id", element: <Member/> }
      ]},
      { path: 'mapa', element: <Mapa /> },
      { path: 'nucleo', children: [
        { index: true, element: <Nucleo />} ,
        { path: "trilha/:trailId", element: <TrilhaIndexView /> },
        { path: "trilha/:trailId/capitulo/:chapterIndex", element: <ChapterRouteWrapper /> }
      ]},
    ]
  }
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <SkeletonTheme
    baseColor="var(--brand-purple)"
    highlightColor="var(--brand-violet)"
    duration={2}
  >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </SkeletonTheme>
)