import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionRow from '../components/SectionRow'
import { getTopAnimes, getSeasonNow } from '../services/jikan'
import { getPopularFilmes, getPopularSeries } from '../services/tmdb'
import './ExplorarPage.css'

const CATS = ['animes', 'filmes', 'series']

export default function ExplorarPage() {
  const [sp] = useSearchParams()
  const [cat, setCat] = useState(sp.get('cat') || 'animes')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const load = async () => {
      if (cat === 'animes') setItems(await getTopAnimes('bypopularity', 25))
      if (cat === 'filmes') setItems(await getPopularFilmes())
      if (cat === 'series') setItems(await getPopularSeries())
      setLoading(false)
    }
    load()
  }, [cat])

  return (
    <div className="explorar-page">
      <div className="explorar-tabs">
        {CATS.map(c => (
          <div key={c} className={`explorar-tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'animes' ? '🎌 Animes' : c === 'filmes' ? '🎬 Filmes' : '📺 Séries'}
          </div>
        ))}
      </div>
      {loading ? (
        <div className="explorar-loading">
          {[...Array(8)].map((_,i) => <div key={i} className="skeleton" style={{width:130,height:185,borderRadius:12}} />)}
        </div>
      ) : (
        <div className="explorar-grid">
          {items.map((item, i) => (
            <div key={i} className="explorar-item" onClick={() => {}}>
              <img src={item.image} alt={item.title}
                onError={e => e.target.src='https://via.placeholder.com/130x185/111/FFD600?text=HD'}
                className="explorar-img" />
              <div className="explorar-title">{item.title}</div>
              {item.rating && <div className="explorar-score">⭐ {item.rating}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
