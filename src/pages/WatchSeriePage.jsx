import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getSerieById } from '../services/tmdb'
import { getAllPlayers } from '../services/players'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

export default function WatchSeriePage() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const season  = parseInt(sp.get('t') || '1')
  const episode = parseInt(sp.get('e') || '1')
  const [serie, setSerie] = useState(null)
  const [players, setPlayers] = useState([])
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getSerieById(id).then(async d => {
      setSerie(d)
      saveHistory({ id:Number(id), title:d.name, image:`https://image.tmdb.org/t/p/w500${d.poster_path}`, type:'serie' })
    })
  }, [id])

  useEffect(() => {
    if (!serie) return
    setIdx(0)
    setStatus('🔄 Buscando players...')
    getAllPlayers(id, 'tv', season, episode).then(all => {
      setPlayers(all)
      setStatus(`✅ T${season} EP${episode} · ${all[0]?.name||''}`)
    })
  }, [serie, season, episode])

  const current = players[idx]
  const totalEps = serie?.seasons?.find(s=>s.season_number===season)?.episode_count || 0
  const goEp = (s,e) => { setSp({t:s,e}); setIdx(0) }

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
        <div className="watch-title">{serie?.name} — T{season} EP{episode}</div>
        <button className="watch-cast-btn" onClick={openCastTV}>📡</button>
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
              onClick={() => setIdx(i)}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="watch-nav">
        <button className="watch-ep-btn" disabled={episode<=1} onClick={() => episode>1&&goEp(season,episode-1)}>‹ EP {episode-1}</button>
        <span className="watch-ep-cur">EP {episode}{totalEps?`/${totalEps}`:''}</span>
        <button className="watch-ep-btn" onClick={() => goEp(season,episode+1)}>EP {episode+1} ›</button>
      </div>

      <div className="watch-status">{status}</div>
    </div>
  )
}
