// Scraper do Pobreflix via Cloudflare Worker
// Worker: pobreflix-proxy.masterotaku487.workers.dev (criar depois)
const WORKER = 'https://pobreflix-proxy.masterotaku487.workers.dev'
const BASE   = 'https://www.pobreflixtv.forum'

// Busca filmes/séries no Pobreflix
export async function searchPobreflix(query) {
  try {
    const r = await fetch(`${WORKER}?action=search&q=${encodeURIComponent(query)}`)
    const d = await r.json()
    return d.results || []
  } catch { return [] }
}

// Busca o embed/iframe de um conteúdo
export async function getPobreflixEmbed(slug) {
  try {
    const r = await fetch(`${WORKER}?action=embed&slug=${encodeURIComponent(slug)}`)
    const d = await r.json()
    return d.embed || null
  } catch { return null }
}

// URL de busca direta (fallback)
export function searchUrl(query) {
  return `${BASE}/pesquisar/?p=${encodeURIComponent(query)}`
}

// URL de assistir direta (fallback)
export function watchUrl(slug) {
  return `${BASE}/${slug}/?area=online`
}
