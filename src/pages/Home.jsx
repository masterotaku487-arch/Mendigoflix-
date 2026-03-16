import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionRow from '../components/SectionRow'
import { getTopAnimes, getSeasonNow } from '../services/jikan'
import { getPopularFilmes, getPopularSeries, getTrendingAll } from '../services/tmdb'
import './Home.css'

export default function Home() {
  const nav = useNavigate()
  const [hero, setHero] = useState(null)
  const [animes, setAnimes] = useState([])
  const [season, setSeason] = useState([])
  const [filmes, setFilmes] = useState([])
  const [series, setSeries] = useState([])
  const [tab, setTab] = useState('inicio')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getTopAnimes('bypopularity', 10),
      getSeasonNow(10),
      getPopularFilmes(),
      getPopularSeries(),
    ]).then(([a, s, f, se]) => {
      setAnimes(a)
      setSeason(s)
      setFilmes(f)
      setSeries(se)
      setHero(f[0])
      setLoading(false)
    })
  }, [])

  const TABS = [
    { id: 'inicio',  label: '🏠 Início' },
    { id: 'animes',  label: '🎌 Animes' },
    { id: 'filmes',  label: '🎬 Filmes' },
    { id: 'series',  label: '📺 Séries' },
    { id: 'manga',   label: '📖 Mangá' },
  ]

  return (
    <div className="home">
      {/* Hero Banner */}
      {hero && (
        <section className="hero">
          <img className="hero-img" src={hero.backdrop || hero.image} alt={hero.title}
            onError={e => e.target.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'} />
          <div className="hero-bg" />
          <div className="hero-content fade-up">
            <div className="hero-badge">⚡ EM DESTAQUE</div>
            <h1 className="hero-title">{hero.title}</h1>
            <div className="hero-meta">
              {hero.rating && <span className="hero-rating">⭐ {hero.rating}</span>}
              {hero.rating && <span className="dot">•</span>}
              {hero.year && <span>{hero.year}</span>}
              <span className="dot">•</span>
              <span>Dublado</span>
            </div>
            <div className="hero-btns">
              <button className="btn-play" onClick={() => nav(`/watch/filme/${hero.id}`)}>
                ▶ ASSISTIR
              </button>
              <button className="btn-info" onClick={() => nav(`/filme/${hero.id}`)}>
                ℹ Detalhes
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="cat-tabs">
        {TABS.map(t => (
          <div key={t.id} className={`cat-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => t.id === 'manga' ? nav('/manga') : setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Conteúdo por tab */}
      {(tab === 'inicio' || tab === 'animes') && (
        <>
          <SectionRow title="🔥 Temporada Atual" items={season} type="anime" seeAllPath="/explorar?cat=animes" />
          <SectionRow title="⭐ Animes Populares" items={animes} type="anime" seeAllPath="/explorar?cat=animes" />
        </>
      )}

      {(tab === 'inicio' || tab === 'filmes') && (
        <SectionRow title="🎬 Filmes em Alta" items={filmes} type="filme" size="landscape" seeAllPath="/explorar?cat=filmes" />
      )}

      {(tab === 'inicio' || tab === 'series') && (
        <SectionRow title="📺 Séries Populares" items={series} type="serie" seeAllPath="/explorar?cat=series" />
      )}

      {loading && (
        <div className="home-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{width:130,height:185,borderRadius:12}} />
          ))}
        </div>
      )}
    </div>
  )
}
