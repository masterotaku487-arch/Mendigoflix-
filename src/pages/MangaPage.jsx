import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MangaPage.css'

const MANGADEX = 'https://api.mangadex.org'
const CDN = 'https://uploads.mangadex.org'

async function getMangas(lang = 'pt-br', limit = 20) {
  try {
    // Tenta PT-BR primeiro, fallback para en
    const r = await fetch(`${MANGADEX}/manga?limit=${limit}&order[rating]=desc&availableTranslatedLanguage[]=${lang}&contentRating[]=safe&includes[]=cover_art`)
    const d = await r.json()
    if (d.data?.length) return d.data
    // Fallback: qualquer manga popular
    const r2 = await fetch(`${MANGADEX}/manga?limit=${limit}&order[followedCount]=desc&contentRating[]=safe&includes[]=cover_art`)
    const d2 = await r2.json()
    return d2.data || []
  } catch { return [] }
}

function getCover(manga) {
  const cover = manga.relationships?.find(r => r.type === 'cover_art')
  if (!cover?.attributes?.fileName) return 'https://via.placeholder.com/115x160/111/FFD600?text=M'
  return `${CDN}/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
}

function getTitle(manga) {
  const a = manga.attributes
  return a?.title?.['pt-br'] || a?.title?.['pt'] || a?.title?.en || Object.values(a?.title || {})[0] || 'Sem título'
}

export default function MangaPage() {
  const nav = useNavigate()
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMangas('pt-br', 24).then(d => {
      setMangas(d)
      setLoading(false)
    })
  }, [])

  return (
    <div className="manga-page">
      <div className="manga-header">
        <h1 className="manga-title">📖 Mangás</h1>
        <p className="manga-sub">Populares no MangaDex</p>
      </div>
      {loading ? (
        <div className="manga-loading">
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{width:115,height:160,borderRadius:10}} />)}
        </div>
      ) : mangas.length === 0 ? (
        <div style={{padding:'40px 16px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:'2rem',marginBottom:12}}>📖</div>
          <p>Sem mangás disponíveis no momento.</p>
        </div>
      ) : (
        <div className="manga-grid">
          {mangas.map(m => (
            <div key={m.id} className="manga-item" onClick={() => nav(`/manga/${m.id}`)}>
              <img src={getCover(m)} alt={getTitle(m)} className="manga-img"
                onError={e => e.target.src='https://via.placeholder.com/115x160/111/FFD600?text=M'} />
              <div className="manga-item-title">{getTitle(m)}</div>
              <div className="manga-item-meta">{m.attributes?.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
    }
