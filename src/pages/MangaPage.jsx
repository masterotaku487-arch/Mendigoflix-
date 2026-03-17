import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MangaPage.css'

const CDN = 'https://uploads.mangadex.org'

async function getMangas() {
  // Usa proxy CORS do MangaDex
  try {
    const r = await fetch('https://api.mangadex.org/manga?limit=24&order[followedCount]=desc&contentRating[]=safe&includes[]=cover_art&availableTranslatedLanguage[]=pt-br')
    const d = await r.json()
    if (d.data?.length) return d.data
  } catch {}
  try {
    // Fallback sem filtro de idioma
    const r = await fetch('https://api.mangadex.org/manga?limit=24&order[followedCount]=desc&contentRating[]=safe&includes[]=cover_art')
    const d = await r.json()
    return d.data || []
  } catch { return [] }
}

function getCover(m) {
  const c = m.relationships?.find(r=>r.type==='cover_art')
  if (!c?.attributes?.fileName) return ''
  return `${CDN}/covers/${m.id}/${c.attributes.fileName}.256.jpg`
}

function getTitle(m) {
  const t = m.attributes?.title
  return t?.['pt-br'] || t?.['pt'] || t?.en || Object.values(t||{})[0] || '?'
}

export default function MangaPage() {
  const nav = useNavigate()
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getMangas().then(d=>{ setMangas(d); setLoading(false) }) }, [])

  return (
    <div className="manga-page">
      <div className="manga-header">
        <h1 className="manga-title">📖 Mangás</h1>
        <p className="manga-sub">Mais seguidos no MangaDex</p>
      </div>
      {loading ? (
        <div className="manga-loading">
          {[...Array(9)].map((_,i)=><div key={i} className="skeleton" style={{width:'30%',aspectRatio:'2/3',borderRadius:10}}/>)}
        </div>
      ) : mangas.length===0 ? (
        <div className="manga-empty">
          <p>😔 Não foi possível carregar os mangás.</p>
          <p style={{fontSize:'.8rem',marginTop:8,color:'var(--muted)'}}>Verifique sua conexão e tente novamente.</p>
          <button className="manga-retry" onClick={()=>{ setLoading(true); getMangas().then(d=>{setMangas(d);setLoading(false)}) }}>Tentar novamente</button>
        </div>
      ) : (
        <div className="manga-grid">
          {mangas.map(m=>(
            <div key={m.id} className="manga-item" onClick={()=>nav(`/manga/${m.id}`)}>
              {getCover(m) ? (
                <img src={getCover(m)} alt={getTitle(m)} className="manga-img"
                  onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
              ) : null}
              <div className="manga-img-placeholder" style={{display: getCover(m)?'none':'flex'}}>📖</div>
              <div className="manga-item-title">{getTitle(m)}</div>
              <div className="manga-item-meta">{m.attributes?.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
