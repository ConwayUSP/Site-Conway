import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import HomeButton from '@components/mapa/HomeButton'
import './AppLayout.css'

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Header() {
  return (
    <>
      <header className="app-header">
        <HomeButton id="home-button" />

        <nav className="nav-links">
          <NavLink to="/mapa" className="nav-link">Mapa</NavLink>
          <NavLink to="/nucleo" className="nav-link">Nucleo</NavLink>
        </nav>
      </header>
    </>
  )
}

export default AppLayout