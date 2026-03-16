const KEY = 'mendigoflix_favorites'

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addFavorite(item) {
  const favs = getFavorites()
  if (!favs.find(f => f.id === item.id && f.type === item.type)) {
    favs.unshift(item)
    localStorage.setItem(KEY, JSON.stringify(favs))
  }
}

export function removeFavorite(id, type) {
  const favs = getFavorites().filter(f => !(f.id === id && f.type === type))
  localStorage.setItem(KEY, JSON.stringify(favs))
}

export function isFavorite(id, type) {
  return getFavorites().some(f => f.id === id && f.type === type)
}
