import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { saveHistory } from '../services/history'
import './WatchPage.css'
import './WatchFilmePage.css'

const POBREFLIX = 'https://pobreflix-proxy.masterotaku487.workers.dev'

const slugify = (s, year) =>
  'assistir-' + s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
    + '-dublado-' + year

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
    try {
      const year = d.release_date?.slice(0, 4) || ''
      const slug = slugify(d.title, year)
      // Tenta buscar via Worker proxy
      const r = await fetch(`${POBREFLIX}?action=search&q=${encodeURIComponent(d.title)}&year=${year}`)
      const data = await r.json()
      if (data.url) {
        setEmbedUrl(data.url)
        setStatus('✅ Pobreflix')
      } else {
        // Fallback: monta URL direto
        setEmbedUrl(`https://www.pobreflixtv.forum/${slug}/?area=online`)
        setStatus('✅ Carregando player...')
      }
    } catch {
      // Fallback direto
      const year = d.release_date?.slice(0, 4) || ''
      const slug = slugify(d.title, year)
      setEmbedUrl(`https://www.pobreflixtv.forum/${slug}/?area=online`)
      setStatus('✅ Player externo')
    }
  }

  return (
    <div className="watch-page">
      <div className="watch-controls-top">
        <button className="watch-back" onClick={() => nav(-1)}>‹</button>
        <div className="watch-title">{filme?.title}</div>
      </div>

      {embedUrl ? (
        <iframe
          className="watch-iframe"
          src={embedUrl}
          allowFullScreen
          allow="autoplay; fullscreen"
          referrerPolicy="origin"
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
