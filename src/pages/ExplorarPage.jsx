import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getTopAnimes } from '../services/jikan'
import './ExplorarPage.css'

const TMDB_KEY = '1865f43a0549ca50d341dd9ab8b29f49'
const LANG = 'pt-BR'

const GENEROS_ANIME = [
  {id:'1',n:'Ação'},{id:'2',n:'Aventura'},{id:'4',n:'Comédia'},{id:'8',n:'Drama'},
  {id:'10',n:'Fantasia'},{id:'14',n:'Terror'},{id:'7',n:'Mistério'},{id:'22',n:'Romance'},
  {id:'24',n:'Sci-Fi'},{id:'62',n:'Isekai'},{id:'27',n:'Shounen'},{id:'25',n:'Shoujo'},
  {id:'42',n:'Seinen'},{id:'18',n:'Mecha'},{id:'37',n:'Sobrenatural'},
]
const GENEROS_FILME = [
  {id:'28',n:'Ação'},{id:'12',n:'Aventura'},{id:'35',n:'Comédia'},{id:'18',n:'Drama'},
  {id:'14',n:'Fantasia'},{id:'27',n:'Terror'},{id:'9648',n:'Mistério'},{id:'10749',n:'Romance'},
  {id:'878',n:'Sci-Fi'},{id:'53',n:'Suspense'},{id:'16',n:'Animação'},{id:'10751',n:'Família'},
  {id:'80',n:'Crime'},{id:'36',n:'História'},{id:'10752',n:'Guerra'},
]
const GENEROS_SERIE = [
  {id:'10759',n:'Ação'},{id:'16',n:'Animação'},{id:'35',n:'Comédia'},{id:'80',n:'Crime'},
  {id:'99',n:'Documentário'},{id:'18',n:'Drama'},{id:'10751',n:'Família'},{id:'10762',n:'Infantil'},
  {id:'9648',n:'Mistério'},{id:'10749',n:'Romance'},{id:'878',n:'Sci-Fi'},
  {id:'10765',n:'Fantasia'},{id:'27',n:'Terror'},{id:'53',n:'Suspense'},
]

const CATS = [
  {id:'filmes', label:'🎬 Filmes'},
  {id:'series', label:'📺 Séries'},
  {id:'animes', label:'🎌 Animes'},
]

export default function ExplorarPage() {
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [cat, setCat] = useState(sp.get('cat') || 'filmes')
  const [genero, setGenero] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => { setGenero(null); setPage(1); setItems([]) }, [cat])
  useEffect(() => { setPage(1); setItems([]) }, [genero])
  useEffect(() => { load(cat, genero, 1) }, [cat, genero])

  async function load(c, g, p) {
    setLoading(true)
    try {
      let newItems = []
      if (c === 'animes') {
        if (g) {
          const r = await fetch(`https://api.jikan.moe/v4/anime?genres=${g}&order_by=popularity&limit=24&page=${p}`)
          const d = await r.json()
          newItems = (d.data||[]).map(a => ({
            id: a.mal_id, type:'anime',
            title: a.title_english||a.title,
            image: a.images?.webp?.large_image_url||a.images?.jpg?.large_image_url||'',
            rating: a.score?.toFixed(1)
          }))
          setHasMore(d.pagination?.has_next_page || false)
        } else {
          newItems = await getTopAnimes('bypopularity', 24)
          setHasMore(true)
        }
      } else {
        const endpoint = c === 'filmes' ? 'movie' : 'tv'
        const url = g
          ? `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${TMDB_KEY}&language=${LANG}&with_genres=${g}&page=${p}&sort_by=popularity.desc`
          : `https://api.themoviedb.org/3/${endpoint}/popular?api_key=${TMDB_KEY}&language=${LANG}&page=${p}`
        const r = await fetch(url)
        const d = await r.json()
        newItems = (d.results||[]).map(m => ({
          id: m.id, type: c==='filmes'?'filme':'serie',
          title: m.title||m.name,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          rating: m.vote_average?.toFixed(1)
        }))
        setHasMore(p < (d.total_pages||1))
      }
      setItems(prev => p===1 ? newItems : [...prev, ...newItems])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(cat, genero, next)
  }

  const generosList = cat==='animes' ? GENEROS_ANIME : cat==='filmes' ? GENEROS_FILME : GENEROS_SERIE

  return (
    <div className="explorar-page">
      <div className="explorar-tabs">
        {CATS.map(c => (
          <div key={c.id} className={`explorar-tab ${cat===c.id?'active':''}`}
            onClick={() => setCat(c.id)}>
            {c.label}
          </div>
        ))}
      </div>

      <div className="genero-tabs">
        <div className={`genero-tab ${!genero?'active':''}`} onClick={() => setGenero(null)}>Todos</div>
        {generosList.map(g => (
          <div key={g.id} className={`genero-tab ${genero===g.id?'active':''}`}
            onClick={() => setGenero(g.id)}>
            {g.n}
          </div>
        ))}
      </div>

      {loading && items.length===0 ? (
        <div className="explorar-loading">
          {[...Array(9)].map((_,i) => <div key={i} className="skeleton explorar-sk" />)}
        </div>
      ) : (
        <>
          <div className="explorar-grid">
            {items.map((item,i) => (
              <div key={`${item.id}-${i}`} className="explorar-item"
                onClick={() => nav(`/${item.type}/${item.id}`)}>
                <img src={item.image} alt={item.title} className="explorar-img"
                  onError={e => e.target.src='https://via.placeholder.com/130x185/111/FFD600?text=?'} />
                <div className="explorar-title">{item.title}</div>
                {item.rating && item.rating !== '0.0' && <div className="explorar-score">⭐ {item.rating}</div>}
              </div>
            ))}
          </div>
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore} disabled={loading}>
              {loading ? '⏳ Carregando...' : '+ Ver mais'}
            </button>
          )}
        </>
      )}
    </div>
  )
                                     }
                                                     
