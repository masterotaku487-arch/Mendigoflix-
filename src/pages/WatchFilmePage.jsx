import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const PROXY = 'https://stream-proxy.masterotaku487.workers.dev'

export default function WatchFilmePage() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const dubbed = sp.get('dub') === '1'
  const [filme, setFilme] = useState(null)
  const [embedUrl, setEmbedUrl] = useState(null)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getFilmeById(id).then(d => {
      setFilme(d)
      saveHistory({ id: Number(id), title: d.title, image: `https://image.tmdb.org/t/p/w500${d.poster_path}`, type: 'filme' })
    })
  }, [id])

  useEffect(() => { if (filme) loadEmbed() }, [filme, dubbed])

  async function loadEmbed() {
    setStatus('🔄 Buscando filme...')
    setEmbedUrl(null)
    // Donflix com clean=1 (sem anúncios)
    const url = `${PROXY}?action=donflix&tmdb_id=${id}&type=movie&clean=1`
    setEmbedUrl(url)
    setStatus(`✅ ${filme.title}${dubbed?' · Dublado':' · Legendado'}`)
  }

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{filme?.title}</div>
        <button className="watch-dub-toggle" onClick={() => setSp({ dub: dubbed ? '0' : '1' })}>
          {dubbed ? '🎙️ Dub' : '🇧🇷 Leg'}
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

      <div className="watch-status">{status}</div>
    </div>
  )
}
