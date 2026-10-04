import type { OwmForecastResponse } from '@/types/openWeather';
import type { Coordinates, DailyForecast } from '@/types/weather';
import { aggregateDailyForecast } from '@/utils/aggregateForecast';

const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function fetchFiveDayForecast(coords: Coordinates): Promise<DailyForecast[]> {
    // While MSW is enabled, a placeholder key is enough because requests never hit the network.
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'dev-mock-key';

    const url = new URL(OWM_FORECAST_URL);
    url.searchParams.set('lat', String(coords.lat));
    url.searchParams.set('lon', String(coords.lon));
    url.searchParams.set('units', 'metric');
    url.searchParams.set('appid', apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Weather API request failed (${response.status})`);
    }

    const data = (await response.json()) as OwmForecastResponse;
    return aggregateDailyForecast(data.list);
}
