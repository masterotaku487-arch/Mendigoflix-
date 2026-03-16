import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSerieById } from '../services/tmdb'
import { addFavorite, removeFavorite, isFavorite } from '../services/favorites'
import './DetailPage.css'

const IMG = 'https://image.tmdb.org/t/p/w500'
const BG  = 'https://image.tmdb.org/t/p/original'

export default function SeriePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [serie, setSerie] = useState(null)
  const [season, setSeason] = useState(1)
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSerieById(id).then(d => {
      setSerie(d)
      setFav(isFavorite(Number(id), 'serie'))
      setLoading(false)
    })
  }, [id])

  const toggleFav = () => {
    const item = { id: Number(id), title: serie.name, image: IMG + serie.poster_path, type: 'serie' }
    if (fav) { removeFavorite(Number(id), 'serie'); setFav(false) }
    else { addFavorite(item); setFav(true) }
  }

  if (loading) return <div className="detail-loading"><div className="skeleton" style={{width:'100%',height:300}} /></div>
  if (!serie) return <div className="detail-error">Série não encontrada</div>

  const currentSeason = serie.seasons?.find(s => s.season_number === season)
  const epCount = currentSeason?.episode_count || 0

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <img src={serie.backdrop_path ? BG + serie.backdrop_path : IMG + serie.poster_path}
          alt={serie.name} className="detail-backdrop" />
        <div className="detail-hero-grad" />
        <button className="detail-back" onClick={() => nav(-1)}>‹</button>
        <button className="detail-fav" onClick={toggleFav}>{fav ? '❤️' : '🤍'}</button>
      </div>

      <div className="detail-content">
        <h1 className="detail-title">{serie.name}</h1>
        <div className="detail-meta">
          {serie.vote_average > 0 && <span className="detail-score">⭐ {serie.vote_average.toFixed(1)}</span>}
          {serie.first_air_date && <span>{serie.first_air_date.slice(0,4)}</span>}
          {serie.number_of_seasons > 0 && <span>{serie.number_of_seasons} temp.</span>}
        </div>
        <div className="detail-btns">
          <button className="btn-play-full" onClick={() => nav(`/watch/serie/${id}?t=${season}&ep=1`)}>
            ▶ ASSISTIR T{season} EP1
          </button>
        </div>

        {/* Seletor de temporada */}
        {serie.seasons?.length > 1 && (
          <div className="detail-section">
            <div className="detail-section-title">Temporadas</div>
            <div className="season-tabs">
              {serie.seasons.filter(s => s.season_number > 0).map(s => (
                <div key={s.season_number}
                  className={`season-tab ${season === s.season_number ? 'active' : ''}`}
                  onClick={() => setSeason(s.season_number)}>
                  T{s.season_number}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Episódios da temporada */}
        <div className="detail-section">
          <div className="detail-section-title">Episódios — T{season} ({epCount})</div>
          <div className="eps-grid">
            {[...Array(epCount)].map((_, i) => (
              <div key={i+1} className="ep-item"
                onClick={() => nav(`/watch/serie/${id}?t=${season}&ep=${i+1}`)}>
                <span className="ep-num">{i+1}</span>
                <span className="ep-title">Episódio {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {serie.overview && (
          <div className="detail-section">
            <div className="detail-section-title">Sinopse</div>
            <p className="detail-synopsis">{serie.overview}</p>
          </div>
        )}
      </div>
    </div>
  )
}
