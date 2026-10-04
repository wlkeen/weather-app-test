import type { DailyForecast } from '@/types/weather';

/** Placeholder five-day data for the unstyled UI shell (replaced by API later). */
export const STATIC_FORECAST: DailyForecast[] = [
    {
        dateUnix: 1728000000,
        tempMin: 12,
        tempMax: 18,
        description: 'Partly cloudy',
        icon: '02d',
    },
    {
        dateUnix: 1728086400,
        tempMin: 11,
        tempMax: 17,
        description: 'Light rain',
        icon: '10d',
    },
    {
        dateUnix: 1728172800,
        tempMin: 10,
        tempMax: 16,
        description: 'Clear sky',
        icon: '01d',
    },
    {
        dateUnix: 1728259200,
        tempMin: 13,
        tempMax: 19,
        description: 'Scattered clouds',
        icon: '03d',
    },
    {
        dateUnix: 1728345600,
        tempMin: 14,
        tempMax: 20,
        description: 'Overcast clouds',
        icon: '04d',
    },
];
