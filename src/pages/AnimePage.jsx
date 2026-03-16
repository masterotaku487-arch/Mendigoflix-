import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimeById, getAnimeEpisodes } from '../services/jikan'
import { addFavorite, removeFavorite, isFavorite } from '../services/favorites'
import './DetailPage.css'

export default function AnimePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [anime, setAnime] = useState(null)
  const [eps, setEps] = useState([])
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimeById(id).then(a => {
      setAnime(a)
      setFav(isFavorite(Number(id), 'anime'))
      setLoading(false)
    })
    getAnimeEpisodes(id).then(d => setEps(d.data || []))
  }, [id])

  const toggleFav = () => {
    if (fav) { removeFavorite(Number(id), 'anime'); setFav(false) }
    else { addFavorite({ ...anime, type: 'anime' }); setFav(true) }
  }

  if (loading) return <div className="detail-loading"><div className="skeleton" style={{width:'100%',height:300}} /></div>
  if (!anime) return <div className="detail-error">Anime não encontrado</div>

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <img src={anime.image} alt={anime.title} className="detail-backdrop"
          onError={e => e.target.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'} />
        <div className="detail-hero-grad" />
        <button className="detail-back" onClick={() => nav(-1)}>‹</button>
        <button className="detail-fav" onClick={toggleFav}>{fav ? '❤️' : '🤍'}</button>
      </div>

      <div className="detail-content">
        <h1 className="detail-title">{anime.title}</h1>
        <div className="detail-meta">
          {anime.rating && <span className="detail-score">⭐ {anime.rating}</span>}
          {anime.year && <span>{anime.year}</span>}
          {anime.episodes && <span>{anime.episodes}</span>}
          {anime.genre && <span>{anime.genre}</span>}
        </div>
        <div className="detail-btns">
          <button className="btn-play-full" onClick={() => nav(`/watch/anime/${id}?ep=1`)}>
            ▶ ASSISTIR EP 1
          </button>
        </div>
        {anime.synopsis && (
          <div className="detail-section">
            <div className="detail-section-title">Sinopse</div>
            <p className="detail-synopsis">{anime.synopsis}</p>
          </div>
        )}
        {eps.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Episódios ({eps.length})</div>
            <div className="eps-grid">
              {eps.map(ep => (
                <div key={ep.mal_id} className="ep-item"
                  onClick={() => nav(`/watch/anime/${id}?ep=${ep.mal_id}`)}>
                  <span className="ep-num">{ep.mal_id}</span>
                  <span className="ep-title">{ep.title || `Episódio ${ep.mal_id}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
