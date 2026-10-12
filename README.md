# Weather Forecast

React SPA that shows a **five-day weather forecast** for a selected city.
Cities are chosen through an autocomplete input; forecast data comes from a local
**.NET 10 WeatherApi** that proxies [OpenWeatherMap](https://openweathermap.org/)
(API key stays on the server).

Implemented with React, TypeScript, Redux Toolkit, redux-saga, Sass, tests, Docker,
and an ASP.NET Core backend under `backend/WeatherApi`.

## Features

- Five-day forecast table (min/max temperature + conditions)
- Custom city autocomplete (no third-party UI kit)
- EN / CZ UI via `react-i18next` (default from browser languages; `cs*` → CZ)
- Locale-aware date formatting via the browser culture (`Intl`)
- Temperature trend chart (Chart.js)
- Forecast for the user’s current location (Geolocation API)
- Cities JSON loaded online with local `/data/cities.json` fallback
- Optional MSW mock weather API (`VITE_USE_MOCK_API=true`)
- Local .NET BFF with OpenWeatherMap key on the server

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 18 + TypeScript |
| Bundler | Vite (dev proxy `/api` → `localhost:5080`) |
| State | Redux Toolkit + redux-saga |
| Styles | Sass (SCSS), HTML5 / CSS3 |
| Charts | Chart.js + react-chartjs-2 |
| Tests | Vitest + Testing Library + happy-dom |
| API mocking | MSW |
| i18n | react-i18next + i18next-browser-languagedetector (`en` / `cz`) |
| Backend | ASP.NET Core / .NET 10 (`backend/WeatherApi`) |
| Deploy | Docker multi-stage build → nginx (FE static; live weather needs the BE) |

## Prerequisites

- **Node.js** 20.x or 22.x (LTS recommended)
- **npm** 10+
- **.NET 10 SDK** (for the Weather API)
- An **OpenWeatherMap API key** (configured on the backend, not in the FE bundle)
- Optional: **Docker** for containerized FE deployment
- A modern browser: latest **Google Chrome**, **Mozilla Firefox**, or **Microsoft Edge**

## Getting started

### 1. Start the .NET Weather API

```bash
cd backend/WeatherApi
dotnet user-secrets set "OpenWeather:ApiKey" "your_real_key_here"
dotnet run
```

API listens on **http://localhost:5080**. See [backend/README.md](backend/README.md).

### 2. Start the frontend

```bash
# From the project root
npm install
cp .env.example .env   # optional; defaults work with the Vite proxy

npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).
Forecast requests go to `/api/weather/forecast` and are proxied to the .NET API.

### Mock API mode (no BE / no real key required)

```bash
# In .env
VITE_USE_MOCK_API=true
```

MSW intercepts `/api/weather/forecast` in the browser and returns aggregated mock days.

## Build and deploy

### Local production build (FE only)

```bash
npm run build
npm run preview
```

Static files are emitted to `dist/`. For live weather you must also run the .NET API
(and point the FE at it, e.g. `VITE_API_BASE_URL` or a reverse proxy for `/api`).

### Docker (FE static image)

```bash
docker build -t weather-app .
docker run --rm -p 8080:80 weather-app
```

Then open `http://localhost:8080`. Live forecast still requires a reachable Weather API;
use `VITE_USE_MOCK_API=true` as a build arg for a fully static demo without BE.

Optional build args:

- `VITE_USE_MOCK_API` — defaults to `false`
- `VITE_API_BASE_URL` — absolute Weather API base URL
- `VITE_CITIES_REMOTE_URL` — override the online cities JSON URL
