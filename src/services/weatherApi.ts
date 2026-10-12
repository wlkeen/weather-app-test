import { getOwmLang } from '@/i18n';
import type { Coordinates, DailyForecast } from '@/types/weather';

// ---------------------------------------------------------------------------
// Legacy: direct OpenWeatherMap call from the browser (API key on the client).
// Kept commented for interview / comparison; live path uses the local .NET BE.
// ---------------------------------------------------------------------------
// import type { OwmForecastResponse } from '@/types/openWeather';
// import { aggregateDailyForecast } from '@/utils/aggregateForecast';
//
// const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
//
// function resolveApiKey(): string {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
//
//   if (useMock) {
//     return apiKey || 'dev-mock-key';
//   }
//
//   if (!apiKey || apiKey === 'your_api_key_here') {
//     throw new Error('errors.missingApiKey');
//   }
//
//   return apiKey;
// }
//
// export async function fetchFiveDayForecast(coords: Coordinates): Promise<DailyForecast[]> {
//   const apiKey = resolveApiKey();
//
//   const url = new URL(OWM_FORECAST_URL);
//   url.searchParams.set('lat', String(coords.lat));
//   url.searchParams.set('lon', String(coords.lon));
//   url.searchParams.set('units', 'metric');
//   url.searchParams.set('lang', getOwmLang());
//   url.searchParams.set('appid', apiKey);
//
//   const response = await fetch(url.toString());
//
//   if (!response.ok) {
//     if (response.status === 401) {
//       throw new Error('errors.invalidApiKey');
//     }
//     throw new Error('errors.weatherRequestFailed');
//   }
//
//   const data = (await response.json()) as OwmForecastResponse;
//   return aggregateDailyForecast(data.list);
// }

/**
 * Fetches an aggregated five-day forecast from the local .NET WeatherApi.
 * In dev, Vite proxies `/api` → http://localhost:5080.
 */
export async function fetchFiveDayForecast(coords: Coordinates): Promise<DailyForecast[]> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const url = new URL(`${baseUrl}/api/weather/forecast`, window.location.origin);
  url.searchParams.set('lat', String(coords.lat));
  url.searchParams.set('lon', String(coords.lon));
  url.searchParams.set('lang', getOwmLang());

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('errors.invalidApiKey');
    }
    throw new Error('errors.weatherRequestFailed');
  }

  return (await response.json()) as DailyForecast[];
}
