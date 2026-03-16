# MendigoFlix 🎬

Plataforma de streaming gratuita com Filmes, Séries, Animes e Mangás.

## Stack
- React + Vite
- Capacitor (APK Android)
- TMDB API (filmes/séries)
- Jikan API (animes)
- MangaDex API (mangás)
- Cloudflare Workers (proxies)

## Setup
```bash
npm install
npm run dev
```

## Build APK
```bash
npm run build
npx cap sync android
npx cap open android
```
