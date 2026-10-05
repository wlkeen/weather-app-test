import { describe, expect, it } from 'vitest';
import type { OwmForecastItem } from '@/types/openWeather';
import { aggregateDailyForecast } from './aggregateForecast';

function slot(dayOffset: number, hour: number, tempMin: number, tempMax: number): OwmForecastItem {
  const date = new Date('2026-06-01T00:00:00.000Z');
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(hour, 0, 0, 0);

  return {
    dt: Math.floor(date.getTime() / 1000),
    main: { temp: (tempMin + tempMax) / 2, temp_min: tempMin, temp_max: tempMax },
    weather: [{ description: 'clear sky', icon: '01d' }],
  };
}

describe('aggregateDailyForecast', () => {
  it('groups 3-hour slots into daily min/max rows', () => {
    const items = [slot(0, 6, 10, 12), slot(0, 12, 14, 18), slot(1, 6, 9, 11), slot(1, 12, 13, 17)];

    const days = aggregateDailyForecast(items);

    expect(days).toHaveLength(2);
    expect(days[0].tempMin).toBe(10);
    expect(days[0].tempMax).toBe(18);
    expect(days[1].tempMin).toBe(9);
    expect(days[1].tempMax).toBe(17);
  });

  it('limits the result to five days', () => {
    const items = Array.from({ length: 8 }, (_, day) => slot(day, 12, 8, 16));
    expect(aggregateDailyForecast(items)).toHaveLength(5);
  });
});
