import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import Topbar from './components/Topbar'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import ExplorarPage from './pages/ExplorarPage'
import AnimePage from './pages/AnimePage'
import FilmePage from './pages/FilmePage'
import SeriePage from './pages/SeriePage'
import WatchPage from './pages/WatchPage'
import WatchFilmePage from './pages/WatchFilmePage'
import WatchSeriePage from './pages/WatchSeriePage'
import MangaPage from './pages/MangaPage'
import MangaReadPage from './pages/MangaReadPage'
import FavoritosPage from './pages/FavoritosPage'
import PerfilPage from './pages/PerfilPage'
import TermosPage from './pages/TermosPage'
import PrivacidadePage from './pages/PrivacidadePage'
import './App.css'

export default function App() {
  const { pathname } = useLocation()
  const isWatch = pathname.startsWith('/watch')

  return (
    <div className="app">
      {!isWatch && <Topbar />}
      <main className={isWatch ? 'main-watch' : 'main'}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/buscar"          element={<SearchPage />} />
          <Route path="/explorar"        element={<ExplorarPage />} />
          <Route path="/anime/:id"       element={<AnimePage />} />
          <Route path="/filme/:id"       element={<FilmePage />} />
          <Route path="/serie/:id"       element={<SeriePage />} />
          <Route path="/watch/anime/:id" element={<WatchPage />} />
          <Route path="/watch/filme/:id" element={<WatchFilmePage />} />
          <Route path="/watch/serie/:id" element={<WatchSeriePage />} />
          <Route path="/manga"           element={<MangaPage />} />
          <Route path="/manga/:id"       element={<MangaReadPage />} />
          <Route path="/favoritos"       element={<FavoritosPage />} />
          <Route path="/perfil"          element={<PerfilPage />} />
          <Route path="/termos"          element={<TermosPage />} />
          <Route path="/privacidade"     element={<PrivacidadePage />} />
        </Routes>
      </main>
      {!isWatch && <BottomNav />}
    </div>
  )
}
