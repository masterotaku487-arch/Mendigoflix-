import { useNavigate } from 'react-router-dom'
import MediaCard from './MediaCard'
import './SectionRow.css'

export default function SectionRow({ title, items = [], type = 'anime', size = 'portrait', seeAllPath }) {
  const nav = useNavigate()
  if (!items.length) return null
  return (
    <section className="section-row">
      <div className="section-header">
        <div className="section-title">{title}</div>
        {seeAllPath && (
          <div className="section-more" onClick={() => nav(seeAllPath)}>Ver tudo ›</div>
        )}
      </div>
      <div className="cards-row">
        {items.map((item, i) => (
          <MediaCard key={item.id || i} item={item} type={type} size={size} />
        ))}
      </div>
    </section>
  )
}
