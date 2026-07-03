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
          <NavLink to="/projects" className="nav-link">Projetos</NavLink>
          <NavLink to="/members" className="nav-link">Membros</NavLink>
          <NavLink to="/mapa" className="nav-link">Mapa</NavLink>
          <NavLink to="/nucleo" className="nav-link">Núcleo</NavLink>
        </nav>
      </header>
    </>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
      {children}
    </NavLink>
  )
}

export default AppLayout