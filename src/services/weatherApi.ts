import { getOwmLang } from '@/i18n';
import type { OwmForecastResponse } from '@/types/openWeather';
import type { Coordinates, DailyForecast } from '@/types/weather';
import { aggregateDailyForecast } from '@/utils/aggregateForecast';

const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function resolveApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

  if (useMock) {
    return apiKey || 'dev-mock-key';
  }

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('errors.missingApiKey');
  }

  return apiKey;
}

export async function fetchFiveDayForecast(coords: Coordinates): Promise<DailyForecast[]> {
  const apiKey = resolveApiKey();

  const url = new URL(OWM_FORECAST_URL);
  url.searchParams.set('lat', String(coords.lat));
  url.searchParams.set('lon', String(coords.lon));
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', getOwmLang());
  url.searchParams.set('appid', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('errors.invalidApiKey');
    }
    throw new Error('errors.weatherRequestFailed');
  }

  const data = (await response.json()) as OwmForecastResponse;
  return aggregateDailyForecast(data.list);
}
