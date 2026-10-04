import { http, HttpResponse } from 'msw';
import type { OwmForecastItem } from '@/types/openWeather';

const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/** Builds a deterministic 5-day / 3-hour style mock payload. */
function buildMockList(): OwmForecastItem[] {
  const now = Date.now();
  const items: OwmForecastItem[] = [];

  for (let day = 0; day < 5; day += 1) {
    for (let slot = 0; slot < 8; slot += 1) {
      const dt = Math.floor(now / 1000) + day * 86400 + slot * 3 * 3600;
      const base = 10 + day;
      items.push({
        dt,
        main: {
          temp: base + slot * 0.5,
          temp_min: base,
          temp_max: base + 6,
        },
        weather: [
          {
            description: day % 2 === 0 ? 'clear sky' : 'light rain',
            icon: day % 2 === 0 ? '01d' : '10d',
          },
        ],
      });
    }
  }

  return items;
}

export const handlers = [
  http.get(OWM_FORECAST_URL, ({ request }) => {
    const url = new URL(request.url);
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));

    return HttpResponse.json({
      list: buildMockList(),
      city: {
        id: 1,
        name: 'Mock City',
        country: 'XX',
        coord: { lat, lon },
      },
    });
  }),
];
