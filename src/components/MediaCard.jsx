import { useNavigate } from 'react-router-dom'
import './MediaCard.css'

// type: 'anime' | 'filme' | 'serie' | 'manga'
export default function MediaCard({ item, type = 'anime', size = 'portrait' }) {
  const nav = useNavigate()

  const handleClick = () => {
    if (type === 'anime')  nav(`/anime/${item.id}`)
    if (type === 'filme')  nav(`/filme/${item.id}`)
    if (type === 'serie')  nav(`/serie/${item.id}`)
    if (type === 'manga')  nav(`/manga/${item.id}`)
  }

  if (size === 'landscape') {
    return (
      <div className="card card-l" onClick={handleClick}>
        <img className="card-img" src={item.image || ''} alt={item.title}
          onError={e => e.target.src = 'https://via.placeholder.com/400x225/111/FFD600?text=HD'} />
        <div className="card-overlay-l" />
        {item.badge && <span className="card-badge">{item.badge}</span>}
        <div className="card-info-l">
          <div className="card-title-l">{item.title}</div>
          <div className="card-meta-l">
            {item.rating && <span className="card-score">⭐ {item.rating}</span>}
            {item.year && <span>{item.year}</span>}
            {item.duration && <span>{item.duration}</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card card-p" onClick={handleClick}>
      <img className="card-img-p" src={item.image || ''} alt={item.title}
        onError={e => e.target.src = 'https://via.placeholder.com/130x185/111/FFD600?text=HD'} />
      <div className="card-overlay-p" />
      {item.badge && <span className="card-badge">{item.badge}</span>}
      {item.episodes && <span className="card-ep">{item.episodes}</span>}
      <div className="card-info-p">
        <div className="card-title-p">{item.title}</div>
        <div className="card-meta-p">
          {item.rating && <span className="card-score">⭐ {item.rating}</span>}
          {item.genre && <span> · {item.genre}</span>}
        </div>
      </div>
    </div>
  )
}
