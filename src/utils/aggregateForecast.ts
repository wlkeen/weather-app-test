import type { OwmForecastItem } from '@/types/openWeather';
import type { DailyForecast } from '@/types/weather';

/**
 * Aggregates OpenWeatherMap 3-hour slots into up to five daily rows.
 * Uses calendar day in the browser's local timezone.
 */
export function aggregateDailyForecast(items: OwmForecastItem[]): DailyForecast[] {
    const byDay = new Map<string, OwmForecastItem[]>();

    for (const item of items) {
        // clearer than locale tricks
        const d = new Date(item.dt * 1000);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const bucket = byDay.get(key);

        if (bucket) {
            bucket.push(item);
        } else {
            byDay.set(key, [item]);
        }
    }

    return Array.from(byDay.entries())
        .slice(0, 5)
        .map(([, slots]) => {
            const tempsMin = slots.map((slot) => slot.main.temp_min);
            const tempsMax = slots.map((slot) => slot.main.temp_max);
            // Prefer a midday-ish slot for the textual description when available.
            const representative =
                slots.find((slot) => {
                    const hour = new Date(slot.dt * 1000).getHours();
                    return hour >= 11 && hour <= 14;
                }) ?? slots[Math.floor(slots.length / 2)];

            return {
                dateUnix: slots[0].dt,
                tempMin: Math.min(...tempsMin),
                tempMax: Math.max(...tempsMax),
                description: representative.weather[0]?.description ?? 'n/a',
                icon: representative.weather[0]?.icon ?? '01d',
            };
        });
}
