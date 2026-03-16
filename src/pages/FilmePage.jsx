import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFilmeById } from '../services/tmdb'
import { addFavorite, removeFavorite, isFavorite } from '../services/favorites'
import './DetailPage.css'

const IMG = 'https://image.tmdb.org/t/p/w500'
const BG  = 'https://image.tmdb.org/t/p/original'

export default function FilmePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [filme, setFilme] = useState(null)
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFilmeById(id).then(d => {
      setFilme(d)
      setFav(isFavorite(Number(id), 'filme'))
      setLoading(false)
    })
  }, [id])

  const toggleFav = () => {
    const item = { id: Number(id), title: filme.title, image: IMG + filme.poster_path, type: 'filme' }
    if (fav) { removeFavorite(Number(id), 'filme'); setFav(false) }
    else { addFavorite(item); setFav(true) }
  }

  if (loading) return <div className="detail-loading"><div className="skeleton" style={{width:'100%',height:300}} /></div>
  if (!filme) return <div className="detail-error">Filme não encontrado</div>

  const genres = filme.genres?.map(g => g.name).join(', ')

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <img src={filme.backdrop_path ? BG + filme.backdrop_path : IMG + filme.poster_path}
          alt={filme.title} className="detail-backdrop" />
        <div className="detail-hero-grad" />
        <button className="detail-back" onClick={() => nav(-1)}>‹</button>
        <button className="detail-fav" onClick={toggleFav}>{fav ? '❤️' : '🤍'}</button>
      </div>

      <div className="detail-content">
        <h1 className="detail-title">{filme.title}</h1>
        <div className="detail-meta">
          {filme.vote_average > 0 && <span className="detail-score">⭐ {filme.vote_average.toFixed(1)}</span>}
          {filme.release_date && <span>{filme.release_date.slice(0,4)}</span>}
          {filme.runtime > 0 && <span>{filme.runtime}min</span>}
          {genres && <span>{genres}</span>}
        </div>
        <div className="detail-btns">
          <button className="btn-play-full" onClick={() => nav(`/watch/filme/${id}`)}>
            ▶ ASSISTIR AGORA
          </button>
        </div>
        {filme.overview && (
          <div className="detail-section">
            <div className="detail-section-title">Sinopse</div>
            <p className="detail-synopsis">{filme.overview}</p>
          </div>
        )}
        {filme.credits?.cast?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Elenco</div>
            <div className="cast-row">
              {filme.credits.cast.slice(0,8).map(c => (
                <div key={c.id} className="cast-item">
                  <img src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ''}
                    alt={c.name} className="cast-img"
                    onError={e => e.target.style.display='none'} />
                  <span className="cast-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
