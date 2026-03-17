import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getAnimeById, getAnimeEpisodes } from '../services/jikan'
import { saveHistory, saveProgress, getProgress } from '../services/history'
import './WatchPage.css'

// Players para anime usando MAL ID
function getAnimePlayers(malId, ep) {
  return [
    {name:'VidSrc',   url:`https://vidsrc.to/embed/anime/${malId}/1/${ep}`},
    {name:'VidLink',  url:`https://vidlink.pro/anime/${malId}/${ep}`},
    {name:'Gogo',     url:`https://vidsrc.to/embed/anime/gogoanime/${malId}-episode-${ep}`},
  ]
}

export default function WatchPage() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const ep = parseInt(sp.get('ep') || '1')
  const [anime, setAnime] = useState(null)
  const [players, setPlayers] = useState([])
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getAnimeById(id).then(a => {
      if (!a) return
      setAnime(a)
      saveHistory({ id:Number(id), title:a.title, image:a.image, type:'anime' })
      const p = getAnimePlayers(id, ep)
      setPlayers(p)
      setStatus('✅ ' + p[0].name)
    })
  }, [id])

  useEffect(() => {
    if (!anime) return
    setIdx(0)
    const p = getAnimePlayers(id, ep)
    setPlayers(p)
    setStatus(`✅ EP ${ep} · ${p[0].name}`)
  }, [ep])

  const current = players[idx]

  const openCastTV = () => {
    if (!current) return
    window.location.href = `intent:${current.url}#Intent;package=com.instantbits.cast.webvideo;end`
    setTimeout(() => {
      if (!document.hidden) window.open('https://play.google.com/store/apps/details?id=com.instantbits.cast.webvideo','_blank')
    }, 2000)
  }

  const goEp = (n) => setSp({ ep: n })

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{anime?.title} — EP {ep}</div>
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
              onClick={() => { setIdx(i); setStatus('✅ EP '+ep+' · '+p.name) }}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="watch-nav">
        <button className="watch-ep-btn" disabled={ep<=1} onClick={() => ep>1&&goEp(ep-1)}>‹ EP {ep-1}</button>
        <span className="watch-ep-cur">EP {ep}</span>
        <button className="watch-ep-btn" onClick={() => goEp(ep+1)}>EP {ep+1} ›</button>
      </div>

      <div className="watch-status">{status}</div>
    </div>
  )
}
