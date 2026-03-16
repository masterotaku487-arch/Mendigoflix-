import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

const ITEMS = [
  { icon: '🏠', label: 'INÍCIO',    path: '/' },
  { icon: '🔍', label: 'BUSCAR',    path: '/buscar' },
  { icon: '🎬', label: 'EXPLORAR',  path: '/explorar' },
  { icon: '❤️', label: 'FAVORITOS', path: '/favoritos' },
  { icon: '👤', label: 'PERFIL',    path: '/perfil' },
]

export default function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav">
      {ITEMS.map(item => (
        <div
          key={item.path}
          className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          onClick={() => nav(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </nav>
  )
}
