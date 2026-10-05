# Weather Forecast

Client-only single-page application that shows a **five-day weather forecast** for a selected city.
Cities are chosen through an autocomplete input; forecast data comes from the [OpenWeatherMap](https://openweathermap.org/) REST API.

Implemented with React, TypeScript, Redux Toolkit, redux-saga, Sass, tests, and Docker.

## Features

- Five-day forecast table (min/max temperature + conditions)
- Custom city autocomplete (no third-party UI kit)
- EN / CZ UI via `react-i18next` (default from browser languages; `cs*` → CZ)
- Locale-aware date formatting via the browser culture (`Intl`)
- Temperature trend chart (Chart.js)
- Forecast for the user’s current location (Geolocation API)
- Cities JSON loaded online with local `/data/cities.json` fallback
- Optional MSW mock weather API (`VITE_USE_MOCK_API=true`)
- Docker + nginx production image with build-time API key injection

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 18 + TypeScript |
| Bundler | Vite |
| State | Redux Toolkit + redux-saga |
| Styles | Sass (SCSS), HTML5 / CSS3 |
| Charts | Chart.js + react-chartjs-2 |
| Tests | Vitest + Testing Library + happy-dom |
| API mocking | MSW |
| i18n | react-i18next + i18next-browser-languagedetector (`en` / `cz`) |
| Deploy | Docker multi-stage build → nginx |

## Prerequisites

- **Node.js** 20.x or 22.x (LTS recommended)
- **npm** 10+
- An **OpenWeatherMap API key** (free registration is enough)
- Optional: **Docker** for containerized deployment
- A modern browser: latest **Google Chrome**, **Mozilla Firefox**, or **Microsoft Edge**

## Getting started

```bash
# Install dependencies
npm install

# Copy env template and set your API key (placeholder is fine until the API commit)
cp .env.example .env
# Edit .env and set: VITE_OPENWEATHER_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Mock API mode (no real key required)

```bash
# In .env
VITE_USE_MOCK_API=true
VITE_OPENWEATHER_API_KEY=dev-mock-key
```

## Build and deploy

### Local production build

```bash
npm run build
npm run preview
```

Static files are emitted to `dist/`. Host that folder on any static file server.

The OpenWeatherMap API key is read at **build time** via `VITE_OPENWEATHER_API_KEY` (Vite embeds `VITE_*` variables into the client bundle). Do not commit a real `.env` file.

### Docker

```bash
docker build \
  --build-arg VITE_OPENWEATHER_API_KEY=your_api_key_here \
  -t weather-app .

docker run --rm -p 8080:80 weather-app
```

Then open `http://localhost:8080`.

Optional build args:

- `VITE_USE_MOCK_API` — defaults to `false`
- `VITE_CITIES_REMOTE_URL` — override the online cities JSON URL