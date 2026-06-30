import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Mapa from './pages/Mapa.jsx'
import Home from './pages/Home.jsx'
import Nucleo from './pages/Nucleo.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'mapa', element: <Mapa /> },
      { path: 'nucleo', element: <Nucleo /> },
    ]
  }
])  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)