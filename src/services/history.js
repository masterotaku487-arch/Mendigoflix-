const KEY = 'mendigoflix_history'
const MAX = 30

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveHistory(item) {
  const hist = getHistory().filter(h => !(h.id === item.id && h.type === item.type))
  hist.unshift({ ...item, watchedAt: Date.now() })
  localStorage.setItem(KEY, JSON.stringify(hist.slice(0, MAX)))
}

export function saveProgress(id, type, progress) {
  localStorage.setItem(`mendigoflix_progress_${type}_${id}`, JSON.stringify({ progress, ts: Date.now() }))
}

export function getProgress(id, type) {
  try {
    const d = localStorage.getItem(`mendigoflix_progress_${type}_${id}`)
    return d ? JSON.parse(d) : null
  } catch { return null }
}
