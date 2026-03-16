const JIKAN = 'https://api.jikan.moe/v4'
const cache = new Map()

async function get(path) {
  if (cache.has(path)) return cache.get(path)
  const r = await fetch(`${JIKAN}${path}`)
  const d = await r.json()
  cache.set(path, d)
  return d
}

export const imgHD = (a) => a?.images?.webp?.large_image_url || a?.images?.jpg?.large_image_url || ''
export const imgSM = (a) => a?.images?.webp?.small_image_url || a?.images?.jpg?.image_url || ''

export function formatAnime(a) {
  return {
    id: a.mal_id,
    title: a.title_english || a.title,
    image: imgHD(a),
    rating: a.score?.toFixed(1),
    episodes: a.episodes ? `${a.episodes} EPS` : 'ATIVO',
    genre: a.genres?.[0]?.name,
    year: a.aired?.from?.slice(0, 4),
    type: a.type,
    synopsis: a.synopsis,
    status: a.status,
    badge: a.status === 'Currently Airing' ? 'NOVO' : null,
  }
}

export async function getTopAnimes(filter = 'bypopularity', limit = 20) {
  const d = await get(`/top/anime?limit=${limit}&filter=${filter}`)
  return (d.data || []).map(formatAnime)
}

export async function getSeasonNow(limit = 20) {
  const d = await get(`/seasons/now?limit=${limit}`)
  return (d.data || []).map(formatAnime)
}

export async function getAnimeById(id) {
  const d = await get(`/anime/${id}`)
  return d.data ? formatAnime(d.data) : null
}

export async function getAnimeEpisodes(id, page = 1) {
  const d = await get(`/anime/${id}/episodes?page=${page}`)
  return d
}

export async function searchAnimes(query, limit = 20) {
  const d = await get(`/anime?q=${encodeURIComponent(query)}&limit=${limit}&sfw=true`)
  return (d.data || []).map(formatAnime)
}
