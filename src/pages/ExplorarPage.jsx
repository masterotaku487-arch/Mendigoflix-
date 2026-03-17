import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getTopAnimes, searchAnimes } from '../services/jikan'
import { getPopularFilmes, getPopularSeries } from '../services/tmdb'
import './ExplorarPage.css'

const GENEROS_ANIME = [
  {id:'1',name:'Ação'},{id:'2',name:'Aventura'},{id:'4',name:'Comédia'},
  {id:'8',name:'Drama'},{id:'10',name:'Fantasia'},{id:'14',name:'Terror'},
  {id:'7',name:'Mistério'},{id:'22',name:'Romance'},{id:'24',name:'Sci-Fi'},
  {id:'62',name:'Isekai'},{id:'27',name:'Shounen'},{id:'25',name:'Shoujo'},
  {id:'42',name:'Seinen'},{id:'18',name:'Mecha'},{id:'37',name:'Sobrenatural'},
]

const GENEROS_FILME = [
  {id:'28',name:'Ação'},{id:'12',name:'Aventura'},{id:'35',name:'Comédia'},
  {id:'18',name:'Drama'},{id:'14',name:'Fantasia'},{id:'27',name:'Terror'},
  {id:'9648',name:'Mistério'},{id:'10749',name:'Romance'},{id:'878',name:'Sci-Fi'},
  {id:'53',name:'Suspense'},{id:'16',name:'Animação'},{id:'10751',name:'Família'},
]

const CATS = ['animes','filmes','series']

export default function ExplorarPage() {
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [cat, setCat] = useState(sp.get('cat') || 'filmes')
  const [genero, setGenero] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const TMDB_KEY = '1865f43a0549ca50d341dd9ab8b29f49'

  useEffect(() => {
    setLoading(true)
    setItems([])
    setPage(1)
    load(cat, genero, 1)
  }, [cat, genero])

  async function load(c, g, p) {
    setLoading(true)
    try {
      if (c === 'animes') {
        if (g) {
          const r = await fetch(`https://api.jikan.moe/v4/anime?genres=${g}&order_by=popularity&limit=24&page=${p}`)
          const d = await r.json()
          setItems(prev => p===1 ? (d.data||[]).map(formatAnime) : [...prev, ...(d.data||[]).map(formatAnime)])
        } else {
          const d = await getTopAnimes('bypopularity', 24)
          setItems(d)
        }
      } else if (c === 'filmes') {
        const url = g
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=pt-BR&with_genres=${g}&page=${p}&sort_by=popularity.desc`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=pt-BR&page=${p}`
        const r = await fetch(url)
        const d = await r.json()
        const f = (d.results||[]).map(m=>({id:m.id,title:m.title,image:`https://image.tmdb.org/t/p/w500${m.poster_path}`,rating:m.vote_average?.toFixed(1),type:'filme'}))
        setItems(prev => p===1 ? f : [...prev,...f])
      } else {
        const url = g
          ? `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&language=pt-BR&with_genres=${g}&page=${p}&sort_by=popularity.desc`
          : `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}&language=pt-BR&page=${p}`
        const r = await fetch(url)
        const d = await r.json()
        const s = (d.results||[]).map(m=>({id:m.id,title:m.name,image:`https://image.tmdb.org/t/p/w500${m.poster_path}`,rating:m.vote_average?.toFixed(1),type:'serie'}))
        setItems(prev => p===1 ? s : [...prev,...s])
      }
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function formatAnime(a) {
    return { id:a.mal_id, title:a.title_english||a.title, image:a.images?.webp?.large_image_url||a.images?.jpg?.large_image_url||'', rating:a.score?.toFixed(1), type:'anime' }
  }

  const loadMore = () => { const next=page+1; setPage(next); load(cat,genero,next) }
  const generosList = cat==='animes' ? GENEROS_ANIME : GENEROS_FILME

  return (
    <div className="explorar-page">
      {/* Tabs de categoria */}
      <div className="explorar-tabs">
        {CATS.map(c => (
          <div key={c} className={`explorar-tab ${cat===c?'active':''}`}
            onClick={() => { setCat(c); setGenero(null) }}>
            {c==='animes'?'🎌 Animes':c==='filmes'?'🎬 Filmes':'📺 Séries'}
          </div>
        ))}
      </div>

      {/* Filtro por gênero */}
      <div className="genero-tabs">
        <div className={`genero-tab ${!genero?'active':''}`} onClick={() => setGenero(null)}>Todos</div>
        {generosList.map(g => (
          <div key={g.id} className={`genero-tab ${genero===g.id?'active':''}`}
            onClick={() => setGenero(g.id)}>
            {g.name}
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading && items.length===0 ? (
        <div className="explorar-loading">
          {[...Array(9)].map((_,i) => <div key={i} className="skeleton" style={{width:'30%',aspectRatio:'2/3',borderRadius:10}} />)}
        </div>
      ) : (
        <>
          <div className="explorar-grid">
            {items.map((item,i) => (
              <div key={i} className="explorar-item"
                onClick={() => nav(`/${item.type}/${item.id}`)}>
                <img src={item.image} alt={item.title} className="explorar-img"
                  onError={e => e.target.src='https://via.placeholder.com/130x185/111/FFD600?text=?'} />
                <div className="explorar-title">{item.title}</div>
                {item.rating && <div className="explorar-score">⭐ {item.rating}</div>}
              </div>
            ))}
          </div>
          <button className="load-more-btn" onClick={loadMore} disabled={loading}>
            {loading ? '⏳ Carregando...' : 'Ver mais'}
          </button>
        </>
      )}
    </div>
  )
                                           }
                  
