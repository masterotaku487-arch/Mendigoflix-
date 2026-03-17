import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { getAllPlayers } from '../services/players'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

export default function WatchFilmePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [filme, setFilme] = useState(null)
  const [players, setPlayers] = useState([])
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getFilmeById(id).then(async d => {
      setFilme(d)
      saveHistory({ id:Number(id), title:d.title, image:`https://image.tmdb.org/t/p/w500${d.poster_path}`, type:'filme' })
      setStatus('🔄 Buscando players...')
      const all = await getAllPlayers(id, 'movie')
      setPlayers(all)
      setStatus('✅ ' + (all[0]?.name || 'Player'))
    })
  }, [id])

  const current = players[idx]

  const openCastTV = () => {
    if (!current) return
    window.location.href = `intent:${current.url}#Intent;package=com.instantbits.cast.webvideo;end`
    setTimeout(() => {
      if (!document.hidden) window.open('https://play.google.com/store/apps/details?id=com.instantbits.cast.webvideo','_blank')
    }, 2000)
  }

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{filme?.title}</div>
        <button className="watch-cast-btn" onClick={openCastTV} title="Abrir no Cast TV">📡</button>
      </div>

      {current ? (
        <iframe key={current.url} className="watch-iframe" src={current.url}
          allowFullScreen allow="autoplay; fullscreen; encrypted-media"
          referrerPolicy="origin" />
      ) : (
        <div className="watch-container">
          <div className="watch-placeholder"><div className="watch-spinner">⏳</div><p>{status}</p></div>
        </div>
      )}

      {players.length > 1 && (
        <div className="player-switcher">
          {players.map((p,i) => (
            <button key={i} className={`player-btn ${idx===i?'active':''}`}
              onClick={() => { setIdx(i); setStatus('✅ '+p.name) }}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="watch-status">{status}</div>
    </div>
  )
}
