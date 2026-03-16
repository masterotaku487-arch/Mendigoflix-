import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const FILMES_PROXY = 'https://filmes-proxy.masterotaku487.workers.dev'

export default function WatchFilmePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [filme, setFilme] = useState(null)
  const [embedUrl, setEmbedUrl] = useState(null)
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    getFilmeById(id).then(async d => {
      setFilme(d)
      saveHistory({ id: Number(id), title: d.title, image: `https://image.tmdb.org/t/p/w500${d.poster_path}`, type: 'filme' })
      await loadEmbed(d)
    })
  }, [id])

  async function loadEmbed(d) {
    setStatus('🔄 Buscando filme...')
    // 1. Donflix via TMDB ID — direto, sem scraping
    try {
      const r = await fetch(`${FILMES_PROXY}?action=donflix&tmdb_id=${id}&type=movie`)
      const data = await r.json()
      if (data.embed) { setEmbedUrl(data.embed); setStatus('✅ ' + (data.source||'Donflix')); return }
    } catch {}
    // 2. Busca por título nas outras fontes
    try {
      const r2 = await fetch(`${FILMES_PROXY}?action=auto&q=${encodeURIComponent(d.title)}`)
      const data2 = await r2.json()
      if (data2.embed) { setEmbedUrl(data2.embed); setStatus('✅ ' + (data2.source||'Stream')); return }
    } catch {}
    // 3. Fallback final
    setEmbedUrl(`https://donflix2.pages.dev/watch/movie?tmdb_id=${id}`)
    setStatus('✅ Donflix')
  }

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{filme?.title}</div>
      </div>
      {embedUrl ? (
        <iframe className="watch-iframe" src={embedUrl}
          allowFullScreen allow="autoplay; fullscreen" referrerPolicy="origin" />
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
