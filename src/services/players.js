const TMDB_KEY = '1865f43a0549ca50d341dd9ab8b29f49'
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

// Players por TMDB ID (não precisam de IMDB)
export function getTmdbPlayers(tmdbId, type, season=1, episode=1) {
  const isTV = type==='serie'||type==='tv'
  if (isTV) return [
    {name:'VidLink',   url:`https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`},
    {name:'VidFast',   url:`https://vidfast.pro/tv/${tmdbId}/${season}/${episode}`},
    {name:'DBGO',      url:`https://dbgo.fun/tv/${tmdbId}/${season}/${episode}`},
    {name:'Donflix',   url:`https://donflix2.pages.dev/watch/tv?tmdb_id=${tmdbId}&season=${season}&episode=${episode}`},
  ]
  return [
    {name:'VidLink',   url:`https://vidlink.pro/movie/${tmdbId}`},
    {name:'VidFast',   url:`https://vidfast.pro/movie/${tmdbId}`},
    {name:'DBGO',      url:`https://dbgo.fun/movie/${tmdbId}`},
    {name:'Donflix',   url:`https://donflix2.pages.dev/watch/movie?tmdb_id=${tmdbId}`},
  ]
}

// Players por IMDB ID
export function getImdbPlayers(imdbId, type, season=1, episode=1) {
  const isTV = type==='serie'||type==='tv'
  if (isTV) return [
    {name:'VidSrc',    url:`https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`},
    {name:'VidSrc.me', url:`https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`},
    {name:'MultiEmbed',url:`https://multiembed.mov/?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`},
    {name:'Embed.su',  url:`https://embed.su/embed/tv/${imdbId}/${season}/${episode}`},
    {name:'AutoEmbed', url:`https://autoembed.cc/embed/tv/${imdbId}/${season}/${episode}`},
    {name:'2Embed',    url:`https://www.2embed.cc/embedtv/${imdbId}&s=${season}&e=${episode}`},
  ]
  return [
    {name:'VidSrc',    url:`https://vidsrc.to/embed/movie/${imdbId}`},
    {name:'VidSrc.me', url:`https://vidsrc.me/embed/movie?imdb=${imdbId}`},
    {name:'MultiEmbed',url:`https://multiembed.mov/?video_id=${imdbId}&tmdb=1`},
    {name:'SuperEmbed',url:`https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1`},
    {name:'Embed.su',  url:`https://embed.su/embed/movie/${imdbId}`},
    {name:'AutoEmbed', url:`https://autoembed.cc/embed/movie/${imdbId}`},
    {name:'2Embed',    url:`https://www.2embed.cc/embed/${imdbId}`},
  ]
}

// Combina TMDB + IMDB players
export async function getAllPlayers(tmdbId, type, season=1, episode=1) {
  const tmdb = getTmdbPlayers(tmdbId, type, season, episode)
  const imdb = await getImdbId(tmdbId, type)
  const imdbPlayers = imdb ? getImdbPlayers(imdb, type, season, episode) : []
  return [...tmdb, ...imdbPlayers]
    }
