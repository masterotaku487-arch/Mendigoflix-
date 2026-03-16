import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './MangaReadPage.css'

const MANGADEX = 'https://api.mangadex.org'

export default function MangaReadPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${MANGADEX}/manga/${id}`).then(r => r.json()),
      fetch(`${MANGADEX}/manga/${id}/feed?translatedLanguage[]=pt-br&order[chapter]=asc&limit=50`).then(r => r.json()),
    ]).then(([m, c]) => {
      setManga(m.data)
      setChapters(c.data || [])
      setLoading(false)
    })
  }, [id])

  const title = manga?.attributes?.title?.['pt-br'] || manga?.attributes?.title?.en || ''

  return (
    <div className="manga-read-page">
      <div className="manga-read-header">
        <button className="detail-back" onClick={() => nav(-1)}>‹</button>
        <h1 className="manga-read-title">{title}</h1>
      </div>

      {loading ? (
        <div style={{padding:16,color:'var(--muted)'}}>Carregando capítulos...</div>
      ) : chapters.length === 0 ? (
        <div style={{padding:16,color:'var(--muted)'}}>Sem capítulos em PT-BR disponíveis.</div>
      ) : (
        <div className="chapters-list">
          {chapters.map(ch => (
            <a key={ch.id}
              href={`https://mangadex.org/chapter/${ch.id}`}
              target="_blank" rel="noopener noreferrer"
              className="chapter-item">
              <span className="chapter-num">Cap. {ch.attributes?.chapter || '?'}</span>
              <span className="chapter-title">{ch.attributes?.title || `Capítulo ${ch.attributes?.chapter}`}</span>
              <span className="chapter-arrow">›</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
