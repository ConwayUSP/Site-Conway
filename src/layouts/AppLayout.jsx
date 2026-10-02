import { useLayoutEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import HomeButton from '@components/mapa/HomeButton'
import trilhasConfig from '@data/trilhasConfig.json'
import './AppLayout.css'

function AppLayout() {
  const { pathname } = useLocation()
  const trailId = pathname.match(/^\/nucleo\/trilha\/([^/]+)/)?.[1]
  const trailThemeClass = trailId
    ? trilhasConfig[decodeURIComponent(trailId)]?.themeClass
    : ''

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header themeClass={trailThemeClass} />
      <Outlet />
    </>
  )
}

function Header({ themeClass = '' }) {
  return (
    <>
      <header className={`app-header ${themeClass ? `${themeClass} app-header--trail` : ''}`}>
        <HomeButton id="home-button" />

        <nav className="nav-links">
          <NavLink to="/projects" className="nav-link">Projetos</NavLink>
          <NavLink to="/members" className="nav-link">Membros</NavLink>
          <NavLink to="/mapa" className="nav-link">Mapa</NavLink>
          <NavLink to="/nucleo" className="nav-link">Núcleo</NavLink>
          <NavLink to="/playground" className="nav-link">Lab</NavLink>
        </nav>
      </header>
    </>
  )
}

export default AppLayout
