import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getSerieById } from '../services/tmdb'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const PROXY = 'https://stream-proxy.masterotaku487.workers.dev'

export default function WatchSeriePage() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const season  = parseInt(sp.get('t') || '1')
  const episode = parseInt(sp.get('e') || '1')
  const dubbed  = sp.get('dub') === '1'
  const [serie, setSerie] = useState(null)
  const [embedUrl, setEmbedUrl] = useState(null)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getSerieById(id).then(d => {
      setSerie(d)
      saveHistory({ id: Number(id), title: d.name, image: `https://image.tmdb.org/t/p/w500${d.poster_path}`, type: 'serie' })
    })
  }, [id])

  useEffect(() => {
    if (serie) loadEmbed()
  }, [serie, season, episode, dubbed])

  async function loadEmbed() {
    setStatus('🔄 Buscando episódio...')
    setEmbedUrl(null)

    // 1. Donflix via TMDB ID + parâmetro &clean=1 (sem anúncios)
    const donUrl = `${PROXY}?action=donflix&tmdb_id=${id}&type=serie&s=${season}&e=${episode}&clean=1`
    setEmbedUrl(donUrl)
    setStatus(`✅ T${season} EP${episode}${dubbed?' · Dublado':' · Legendado'}`)
  }

  const goEp = (s, e) => setSp({ t: s, e, ...(dubbed ? { dub: '1' } : {}) })
  const totalEps = serie?.seasons?.find(s => s.season_number === season)?.episode_count || 0

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{serie?.name} — T{season} EP{episode}</div>
        <button className="watch-dub-toggle" onClick={() => setSp({ t: season, e: episode, dub: dubbed ? '0' : '1' })}>
          {dubbed ? '🎙️' : '🇧🇷'}
        </button>
      </div>

      {embedUrl ? (
        <iframe className="watch-iframe" src={embedUrl}
          allowFullScreen allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      ) : (
        <div className="watch-container">
          <div className="watch-placeholder">
            <div className="watch-spinner">⏳</div>
            <p>{status}</p>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="watch-nav">
        <button className="watch-ep-btn" disabled={episode <= 1}
          onClick={() => episode > 1 ? goEp(season, episode-1) : null}>
          ‹ EP {episode-1}
        </button>
        <span className="watch-ep-cur">EP {episode}/{totalEps||'?'}</span>
        <button className="watch-ep-btn" onClick={() => goEp(season, episode+1)}>
          EP {episode+1} ›
        </button>
      </div>

      <div className="watch-status">{status}</div>
    </div>
  )
}
