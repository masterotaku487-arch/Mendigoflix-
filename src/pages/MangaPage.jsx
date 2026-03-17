import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MangaPage.css'

const CDN = 'https://uploads.mangadex.org'
const API = 'https://api.mangadex.org'

async function getMangas() {
  try {
    const r = await fetch(
      `${API}/manga?limit=24&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`
    )
    const d = await r.json()
    return d.data || []
  } catch { return [] }
}

function getCover(manga) {
  const coverRel = manga.relationships?.find(r => r.type === 'cover_art')
  if (!coverRel?.attributes?.fileName) return null
  return `${CDN}/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`
}

function getTitle(manga) {
  const t = manga.attributes?.title
  if (!t) return 'Sem título'
  return t['pt-br'] || t['pt'] || t['en'] || t['ja-ro'] || Object.values(t)[0] || 'Sem título'
}

function getTags(manga) {
  return manga.attributes?.tags
    ?.filter(t => t.attributes?.group === 'genre')
    ?.slice(0, 2)
    ?.map(t => t.attributes?.name?.en || '')
    ?.filter(Boolean)
    ?.join(' • ') || ''
}

export default function MangaPage() {
  const nav = useNavigate()
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true)
    setError(false)
    getMangas().then(d => {
      if (d.length === 0) setError(true)
      setMangas(d)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="manga-page">
      <div className="manga-header">
        <h1 className="manga-title">📖 Mangás</h1>
        <p className="manga-sub">Mais populares no MangaDex</p>
      </div>

      {loading ? (
        <div className="manga-loading">
          {[...Array(9)].map((_,i) => (
            <div key={i} className="skeleton manga-skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="manga-empty">
          <div style={{fontSize:'3rem'}}>😔</div>
          <p>Não foi possível carregar os mangás.</p>
          <button className="manga-retry-btn" onClick={load}>Tentar novamente</button>
        </div>
      ) : (
        <div className="manga-grid">
          {mangas.map(m => {
            const cover = getCover(m)
            const title = getTitle(m)
            return (
              <div key={m.id} className="manga-item" onClick={() => nav(`/manga/${m.id}`)}>
                <div className="manga-img-wrap">
                  {cover
                    ? <img src={cover} alt={title} className="manga-img"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                    : null
                  }
                  <div className="manga-img-fallback" style={{display: cover ? 'none' : 'flex'}}>📖</div>
                </div>
                <div className="manga-item-info">
                  <div className="manga-item-title">{title}</div>
                  <div className="manga-item-tags">{getTags(m)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
      }
                
