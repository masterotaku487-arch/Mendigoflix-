const KEY  = '1865f43a0549ca50d341dd9ab8b29f49'
const BASE = 'https://api.themoviedb.org/3'
const IMG  = 'https://image.tmdb.org/t/p/w500'
const BG   = 'https://image.tmdb.org/t/p/original'
const LANG = 'pt-BR' // Sempre em português

const cache = new Map()
async function get(path) {
  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE}${path}${sep}api_key=${KEY}&language=${LANG}`
  if (cache.has(url)) return cache.get(url)
  const r = await fetch(url)
  const d = await r.json()
  cache.set(url, d)
  return d
}

export function formatFilme(m) {
  return {
    id: m.id,
    title: m.title || m.name,
    image: m.poster_path ? IMG + m.poster_path : '',
    backdrop: m.backdrop_path ? BG + m.backdrop_path : '',
    rating: m.vote_average?.toFixed(1),
    year: (m.release_date || m.first_air_date || '').slice(0, 4),
    overview: m.overview,
    type: m.title ? 'filme' : 'serie',
    genre: m.genre_ids?.[0],
    duration: m.runtime ? `${m.runtime}min` : null,
    badge: null,
  }
}

export async function getPopularFilmes(page=1) {
  const d = await get(`/movie/popular?page=${page}`)
  return (d.results||[]).map(formatFilme)
}
export async function getPopularSeries(page=1) {
  const d = await get(`/tv/popular?page=${page}`)
  return (d.results||[]).map(m=>({...formatFilme(m),type:'serie'}))
}
export async function getTrendingAll() {
  const d = await get('/trending/all/week?')
  return (d.results||[]).map(formatFilme)
}
export async function getFilmeById(id) {
  return get(`/movie/${id}?append_to_response=credits,videos`)
}
export async function getSerieById(id) {
  return get(`/tv/${id}?append_to_response=credits,videos`)
}
export async function searchTMDB(query) {
  const d = await get(`/search/multi?query=${encodeURIComponent(query)}`)
  return (d.results||[]).map(formatFilme)
}
