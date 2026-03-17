// Jikan API para animes
const JIKAN = 'https://api.jikan.moe/v4'
const cache = new Map()

async function get(path) {
  if (cache.has(path)) return cache.get(path)
  try {
    const r = await fetch(`${JIKAN}${path}`)
    if (!r.ok) throw new Error(`${r.status}`)
    const d = await r.json()
    cache.set(path, d)
    return d
  } catch(e) {
    console.warn('[Jikan]', path, e.message)
    return { data: [] }
  }
}

export const imgHD = (a) => a?.images?.webp?.large_image_url || a?.images?.jpg?.large_image_url || ''

export function formatAnime(a) {
  return {
    id: a.mal_id, type: 'anime',
    title: a.title_english || a.title,
    image: imgHD(a),
    rating: a.score?.toFixed(1),
    episodes: a.episodes ? `${a.episodes} EPS` : 'ATIVO',
    genre: a.genres?.[0]?.name,
    year: a.aired?.from?.slice(0, 4),
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
  return get(`/anime/${id}/episodes?page=${page}`)
}

export async function searchAnimes(query, limit = 20) {
  const d = await get(`/anime?q=${encodeURIComponent(query)}&limit=${limit}&sfw=true`)
  return (d.data || []).map(formatAnime)
}
