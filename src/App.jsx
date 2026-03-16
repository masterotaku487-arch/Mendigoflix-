import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { getImdbId, getPlayerUrls } from '../services/players'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const PLAYERS = ['VidSrc','MultiEmbed','Embed.su','AutoEmbed','2Embed']

export default function WatchFilmePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [filme, setFilme] = useState(null)
  const [playerIdx, setPlayerIdx] = useState(0)
  const [urls, setUrls] = useState([])
  const [status, setStatus] = useState('Carregando...')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getFilmeById(id).then(async d => {
      setFilme(d)
      saveHistory({ id: Number(id), title: d.title, image:`https://image.tmdb.org/t/p/w500${d.poster_path}`, type:'filme' })
      setStatus('🔄 Buscando player...')
      const imdb = await getImdbId(id, 'movie')
      if (imdb) {
        const playerUrls = getPlayerUrls(imdb, 'movie')
        setUrls(playerUrls)
        setStatus('✅ ' + PLAYERS[0])
      } else {
        // Fallback: TMDB ID direto no vidsrc
        setUrls([`https://vidsrc.to/embed/movie/tt${id}`])
        setStatus('✅ VidSrc (TMDB)')
      }
    })
  }, [id])

  const currentUrl = urls[playerIdx] || null

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{filme?.title}</div>
      </div>

      {currentUrl ? (
        <>
          <iframe
            key={currentUrl}
            className="watch-iframe"
            src={currentUrl}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            referrerPolicy="origin"
            onLoad={() => setLoaded(true)}
          />
          {/* Troca de player */}
          <div className="player-switcher">
            {PLAYERS.slice(0, urls.length).map((p, i) => (
              <button key={i}
                className={`player-btn ${playerIdx === i ? 'active' : ''}`}
                onClick={() => { setPlayerIdx(i); setLoaded(false); setStatus('✅ ' + p) }}>
                {p}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="watch-container">
          <div className="watch-placeholder">
            <div className="watch-spinner">⏳</div>
            <p>{status}</p>
          </div>
        </div>
      )}

      <div className="watch-status">{status}</div>
    </div>
  )
}
