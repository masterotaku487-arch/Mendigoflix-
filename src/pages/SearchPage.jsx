import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchAnimes } from '../services/jikan'
import { searchTMDB } from '../services/tmdb'
import MediaCard from '../components/MediaCard'
import './SearchPage.css'

export default function SearchPage() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('tudo')

  const search = async (q) => {
    if (!q.trim()) return
    setLoading(true)
    const [animes, tmdb] = await Promise.all([
      searchAnimes(q),
      searchTMDB(q),
    ])
    const filmes = tmdb.filter(t => t.type === 'filme').map(t => ({ ...t, type: 'filme' }))
    const series = tmdb.filter(t => t.type !== 'filme').map(t => ({ ...t, type: 'serie' }))
    setResults([
      ...animes.map(a => ({ ...a, _cat: 'anime' })),
      ...filmes.map(f => ({ ...f, _cat: 'filme' })),
      ...series.map(s => ({ ...s, _cat: 'serie' })),
    ])
    setLoading(false)
  }

  const filtered = tab === 'tudo' ? results : results.filter(r => r._cat === tab)

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar filmes, séries, animes..."
          value={query}
          onChange={e => { setQuery(e.target.value); if (e.target.value.length >= 2) search(e.target.value) }}
          autoFocus
        />
        {query && <button className="search-clear" onClick={() => { setQuery(''); setResults([]) }}>✕</button>}
      </div>

      {results.length > 0 && (
        <div className="search-tabs">
          {['tudo','anime','filme','serie'].map(t => (
            <div key={t} className={`search-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'tudo' ? 'Tudo' : t === 'anime' ? '🎌 Anime' : t === 'filme' ? '🎬 Filme' : '📺 Série'}
            </div>
          ))}
        </div>
      )}

      {loading && <div className="search-loading">🔍 Buscando...</div>}

      <div className="search-results">
        {filtered.map((item, i) => (
          <div key={i} className="search-item" onClick={() => nav(`/${item._cat}/${item.id}`)}>
            <img src={item.image} alt={item.title} className="search-thumb"
              onError={e => e.target.src='https://via.placeholder.com/60x85/111/FFD600?text=?'} />
            <div className="search-info">
              <div className="search-title">{item.title}</div>
              <div className="search-meta">
                <span className="search-badge">{item._cat}</span>
                {item.rating && <span>⭐ {item.rating}</span>}
                {item.year && <span>{item.year}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && query && results.length === 0 && (
        <div className="search-empty">Nenhum resultado para "{query}"</div>
      )}
    </div>
  )
}
