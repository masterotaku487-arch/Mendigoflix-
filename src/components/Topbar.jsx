import { useNavigate } from 'react-router-dom'
import './Topbar.css'

export default function Topbar() {
  const nav = useNavigate()
  return (
    <header className="topbar">
      <div className="topbar-logo" onClick={() => nav('/')}>
        MENDIGO<span>FLIX</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={() => nav('/buscar')}>🔍</button>
        <button className="icon-btn" onClick={() => nav('/perfil')}>👤</button>
      </div>
    </header>
  )
}
