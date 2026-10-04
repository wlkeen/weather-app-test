import type { City } from '@/types/weather';

export function formatCityLabel(city: City): string {
    return `${city.name}, ${city.country}`;
}