import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../services/favorites'
import './FavoritosPage.css'

export default function FavoritosPage() {
  const nav = useNavigate()
  const [favs, setFavs] = useState([])

  useEffect(() => { setFavs(getFavorites()) }, [])

  const remove = (id, type) => {
    removeFavorite(id, type)
    setFavs(getFavorites())
  }

  return (
    <div className="favs-page">
      <h1 className="favs-title">❤️ Favoritos</h1>
      {favs.length === 0 ? (
        <div className="favs-empty">
          <div className="favs-empty-icon">🎬</div>
          <p>Nenhum favorito ainda.</p>
          <p>Adicione filmes, séries e animes!</p>
          <button className="favs-btn" onClick={() => nav('/explorar')}>Explorar</button>
        </div>
      ) : (
        <div className="favs-grid">
          {favs.map((f, i) => (
            <div key={i} className="fav-item">
              <img src={f.image} alt={f.title} className="fav-img"
                onClick={() => nav(`/${f.type}/${f.id}`)}
                onError={e => e.target.src='https://via.placeholder.com/130x185/111/FFD600?text=?'} />
              <button className="fav-remove" onClick={() => remove(f.id, f.type)}>✕</button>
              <div className="fav-title" onClick={() => nav(`/${f.type}/${f.id}`)}>{f.title}</div>
              <div className="fav-type">{f.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
