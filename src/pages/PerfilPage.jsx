import { useState } from 'react'
import { getHistory } from '../services/history'
import './PerfilPage.css'

const PREFS_KEY = 'mendigoflix_prefs'
const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREFS_KEY)||'{}') } catch { return {} } }
const savePrefs = (p) => localStorage.setItem(PREFS_KEY, JSON.stringify(p))

export default function PerfilPage() {
  const [prefs, setPrefs] = useState(loadPrefs)
  const hist = getHistory()

  const set = (key, val) => {
    const p = { ...prefs, [key]: val }
    setPrefs(p); savePrefs(p)
  }

  return (
    <div className="perfil-page">
      <h1 className="perfil-title">👤 Perfil</h1>

      <div className="perfil-stats">
        <div className="stat-item">
          <div className="stat-val">{hist.length}</div>
          <div className="stat-label">Assistidos</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">0</div>
          <div className="stat-label">Favoritos</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">0</div>
          <div className="stat-label">Mangás</div>
        </div>
      </div>

      <div className="perfil-section">
        <div className="perfil-section-title">🎬 Player</div>
        <div className="perfil-options">
          {['internal','mx'].map(m => (
            <div key={m} className={`perfil-option ${prefs.playerMode === m || (!prefs.playerMode && m === 'internal') ? 'active' : ''}`}
              onClick={() => set('playerMode', m)}>
              {m === 'internal' ? '📱 Interno' : '🎬 MX Player'}
            </div>
          ))}
        </div>
      </div>

      <div className="perfil-section">
        <div className="perfil-section-title">🎌 Áudio padrão</div>
        <div className="perfil-options">
          {['sub','dub'].map(a => (
            <div key={a} className={`perfil-option ${prefs.audioMode === a || (!prefs.audioMode && a === 'sub') ? 'active' : ''}`}
              onClick={() => set('audioMode', a)}>
              {a === 'sub' ? '🇧🇷 Legendado' : '🎙️ Dublado'}
            </div>
          ))}
        </div>
      </div>

      <div className="perfil-section">
        <div className="perfil-section-title">⚙️ Preferências</div>
        <div className="perfil-toggle-row">
          <span>Próximo episódio automático</span>
          <div className={`toggle ${prefs.autoNext ? 'on' : ''}`} onClick={() => set('autoNext', !prefs.autoNext)}>
            <div className="toggle-thumb" />
          </div>
        </div>
        <div className="perfil-toggle-row">
          <span>Pular abertura</span>
          <div className={`toggle ${prefs.skipIntro ? 'on' : ''}`} onClick={() => set('skipIntro', !prefs.skipIntro)}>
            <div className="toggle-thumb" />
          </div>
        </div>
      </div>

      <div className="perfil-section">
        <div className="perfil-section-title">📋 Histórico recente</div>
        {hist.slice(0,5).map((h,i) => (
          <div key={i} className="hist-item">
            <img src={h.image} alt={h.title} className="hist-img"
              onError={e => e.target.style.display='none'} />
            <div className="hist-info">
              <div className="hist-title">{h.title}</div>
              <div className="hist-type">{h.type}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="perfil-version">MendigoFlix v1.0.0</div>
    </div>
  )
}
