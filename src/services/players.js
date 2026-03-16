// Players embed - sem API key, usam IMDB ID
// TMDB → busca IMDB ID → monta URL do player

const TMDB_KEY = '1865f43a0549ca50d341dd9ab8b29f49'

// Cache de IMDB IDs
const imdbCache = new Map()

export async function getImdbId(tmdbId, type = 'movie') {
  const key = `${type}:${tmdbId}`
  if (imdbCache.has(key)) return imdbCache.get(key)
  try {
    const endpoint = type === 'serie' || type === 'tv' ? 'tv' : 'movie'
    const r = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}/external_ids?api_key=${TMDB_KEY}`)
    const d = await r.json()
    const imdb = d.imdb_id || null
    if (imdb) imdbCache.set(key, imdb)
    return imdb
  } catch { return null }
}

// Lista de players com fallback
export function getPlayerUrls(imdbId, type, season = 1, episode = 1) {
  const isTV = type === 'serie' || type === 'tv'
  if (isTV) {
    return [
      `https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`,
      `https://multiembed.mov/?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`,
      `https://embed.su/embed/tv/${imdbId}/${season}/${episode}`,
      `https://autoembed.cc/embed/tv/${imdbId}/${season}/${episode}`,
      `https://www.2embed.cc/embedtv/${imdbId}&s=${season}&e=${episode}`,
    ]
  }
  return [
    `https://vidsrc.to/embed/movie/${imdbId}`,
    `https://multiembed.mov/?video_id=${imdbId}&tmdb=1`,
    `https://embed.su/embed/movie/${imdbId}`,
    `https://autoembed.cc/embed/movie/${imdbId}`,
    `https://www.2embed.cc/embed/${imdbId}`,
  ]
}
