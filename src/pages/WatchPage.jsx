import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getAnimeById } from '../services/jikan'
import { saveHistory, saveProgress, getProgress } from '../services/history'
import './WatchPage.css'

const AF = 'https://animefire-proxy.masterotaku487.workers.dev'

const slugify = (s) =>
  s.toLowerCase()
   .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/['":`]/g, '').replace(/[^a-z0-9\s-]/g, ' ')
   .trim().replace(/\s+/g, '-').replace(/-+/g, '-')

export default function WatchPage() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const ep = parseInt(sp.get('ep') || '1')
  const [anime, setAnime] = useState(null)
  const [src, setSrc] = useState(null)
  const [status, setStatus] = useState('Carregando...')
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    getAnimeById(id).then(a => {
      setAnime(a)
      saveHistory({ id: Number(id), title: a.title, image: a.image, type: 'anime' })
      loadVideo(a, ep)
    })
  }, [id, ep])

  useEffect(() => {
    if (anime) {
      const saved = getProgress(id, 'anime')
      if (saved && videoRef.current) videoRef.current.currentTime = saved.progress
    }
  }, [src])

  async function loadVideo(a, epNum) {
    setStatus('🔄 Buscando fonte...')
    setSrc(null)
    const slug = slugify(a.title)
    try {
      const r = await fetch(`${AF}?action=video&slug=${slug}-todos-os-episodios&ep=${epNum}`)
      const d = await r.json()
      if (d.sources?.length) {
        setSrc(`/api/proxy?url=${encodeURIComponent(d.sources[0].url)}`)
        setStatus('✅ AnimeFire')
      } else throw new Error('sem fonte')
    } catch {
      setStatus('❌ Sem fonte disponível')
    }
  }

  const resetTimer = () => {
    setShowControls(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShowControls(false), 3000)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      saveProgress(id, 'anime', videoRef.current.currentTime)
    }
  }

  return (
    <div className="watch-page" onClick={resetTimer}>
      <div className="watch-container">
        {src ? (
          <video ref={videoRef} className="watch-video" src={src} controls autoPlay
            onTimeUpdate={handleTimeUpdate} />
        ) : (
          <div className="watch-placeholder">
            <div className="watch-spinner">⏳</div>
            <p>{status}</p>
          </div>
        )}
      </div>

      {showControls && (
        <div className="watch-controls-top">
          <button className="watch-back" onClick={() => nav(-1)}>‹</button>
          <div className="watch-title">
            {anime?.title} — EP {ep}
          </div>
        </div>
      )}

      {/* Navegação de episódios */}
      <div className="watch-nav">
        {ep > 1 && (
          <button className="watch-ep-btn" onClick={() => nav(`/watch/anime/${id}?ep=${ep - 1}`)}>
            ‹ EP {ep - 1}
          </button>
        )}
        <span className="watch-ep-cur">Episódio {ep}</span>
        <button className="watch-ep-btn" onClick={() => nav(`/watch/anime/${id}?ep=${ep + 1}`)}>
          EP {ep + 1} ›
        </button>
      </div>

      <div className="watch-status">{status}</div>
    </div>
  )
}
