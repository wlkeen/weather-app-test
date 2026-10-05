# Weather Forecast

Client-only single-page application that shows a **five-day weather forecast** for a selected city.
Cities are chosen through an autocomplete input; forecast data comes from the [OpenWeatherMap](https://openweathermap.org/) REST API.

## Features

- Five-day forecast table (min/max temperature + conditions)
- Custom city autocomplete (no third-party UI kit)
- Locale-aware date formatting via the browser culture (`Intl`)
- Temperature trend chart (Chart.js)
- Forecast for the user’s current location (Geolocation API)
- Cities JSON loaded online with local `/data/cities.json` fallback

## Prerequisites

- **Node.js** 20.x or 22.x (LTS recommended)
- **npm** 10+
- An **OpenWeatherMap API key** (free registration is enough)

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
