import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getSerieById } from '../services/tmdb'
import { getImdbId, getPlayerUrls } from '../services/players'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const PLAYERS = ['VidSrc','MultiEmbed','Embed.su','AutoEmbed','2Embed']

export default function WatchSeriePage() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const season  = parseInt(sp.get('t') || '1')
  const episode = parseInt(sp.get('e') || '1')
  const [serie, setSerie] = useState(null)
  const [playerIdx, setPlayerIdx] = useState(0)
  const [imdbId, setImdbId] = useState(null)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getSerieById(id).then(async d => {
      setSerie(d)
      saveHistory({ id: Number(id), title: d.name, image:`https://image.tmdb.org/t/p/w500${d.poster_path}`, type:'serie' })
      const imdb = await getImdbId(id, 'tv')
      setImdbId(imdb)
      setStatus(`✅ T${season} EP${episode}`)
    })
  }, [id])

  useEffect(() => { if (imdbId) setStatus(`✅ T${season} EP${episode} · ${PLAYERS[playerIdx]}`) }, [season, episode, playerIdx, imdbId])

  const urls = imdbId ? getPlayerUrls(imdbId, 'tv', season, episode) : []
  const currentUrl = urls[playerIdx] || null
  const totalEps = serie?.seasons?.find(s => s.season_number === season)?.episode_count || 0

  const goEp = (s, e) => { setSp({ t: s, e }); setPlayerIdx(0) }

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{serie?.name} — T{season} EP{episode}</div>
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
          />
          <div className="player-switcher">
            {PLAYERS.slice(0, urls.length).map((p, i) => (
              <button key={i}
                className={`player-btn ${playerIdx === i ? 'active' : ''}`}
                onClick={() => setPlayerIdx(i)}>
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

      {/* Navegação de episódios */}
      <div className="watch-nav">
        <button className="watch-ep-btn" disabled={episode <= 1}
          onClick={() => episode > 1 && goEp(season, episode-1)}>
          ‹ EP {episode-1}
        </button>
        <span className="watch-ep-cur">EP {episode}{totalEps ? `/${totalEps}` : ''}</span>
        <button className="watch-ep-btn" onClick={() => goEp(season, episode+1)}>
          EP {episode+1} ›
        </button>
      </div>

      <div className="watch-status">{status}</div>
    </div>
  )
}
