import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MangaPage.css'

const MANGADEX = 'https://api.mangadex.org'
const CDN = 'https://uploads.mangadex.org'

async function getPopularMangas() {
  try {
    const r = await fetch(`${MANGADEX}/manga?limit=20&order[rating]=desc&availableTranslatedLanguage[]=pt-br&includedTags[]=Anime&contentRating[]=safe`)
    const d = await r.json()
    return d.data || []
  } catch { return [] }
}

function getCover(manga) {
  const cover = manga.relationships?.find(r => r.type === 'cover_art')
  if (!cover?.attributes?.fileName) return ''
  return `${CDN}/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
}

export default function MangaPage() {
  const nav = useNavigate()
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPopularMangas().then(d => { setMangas(d); setLoading(false) })
  }, [])

  return (
    <div className="manga-page">
      <div className="manga-header">
        <h1 className="manga-title">📖 Mangás</h1>
        <p className="manga-sub">Em português brasileiro</p>
      </div>

      {loading ? (
        <div className="manga-loading">
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{width:115,height:160,borderRadius:10}} />)}
        </div>
      ) : (
        <div className="manga-grid">
          {mangas.map(m => {
            const title = m.attributes?.title?.['pt-br'] || m.attributes?.title?.en || 'Sem título'
            const cover = getCover(m)
            return (
              <div key={m.id} className="manga-item" onClick={() => nav(`/manga/${m.id}`)}>
                <img src={cover} alt={title} className="manga-img"
                  onError={e => e.target.src='https://via.placeholder.com/115x160/111/FFD600?text=M'} />
                <div className="manga-item-title">{title}</div>
                <div className="manga-item-meta">{m.attributes?.status}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
