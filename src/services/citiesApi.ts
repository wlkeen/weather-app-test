import type { City } from '@/types/weather';

const LOCAL_CITIES_URL = '/data/cities.json';

/**
 * Loads the city catalogue from the local static JSON file.
 */
export async function fetchCitiesLocal(): Promise<City[]> {
    const response = await fetch(LOCAL_CITIES_URL);

    if (!response.ok) {
        throw new Error(`Failed to load cities (${response.status})`);
    }

    return (await response.json()) as City[];
}

/** Case-insensitive prefix/contains match used by the autocomplete. */
export function filterCities(cities: City[], query: string, limit = 8): City[] {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) {
        return [];
    }

    return cities
        .filter((city) => {
            const label = `${city.name}, ${city.country}`.toLowerCase();
            return label.includes(normalized) || city.name.toLowerCase().startsWith(normalized);
        })
        .slice(0, limit);
}
