import type { City } from '@/types/weather';

const LOCAL_CITIES_URL = '/data/cities.json';

/** Public JSON city list (online source). Local file is used when this fails. */
const DEFAULT_REMOTE_CITIES_URL =
  'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json';

interface RemoteCityRecord {
  name: string;
  country: string;
  lat: string;
  lng: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load cities from ${url} (${response.status})`);
  }

  return (await response.json()) as T;
}

function mapRemoteCities(records: RemoteCityRecord[]): City[] {
  return records.map((record, index) => ({
    id: index + 1,
    name: record.name,
    country: record.country,
    coord: {
      lat: Number(record.lat),
      lon: Number(record.lng),
    },
  }));
}

export async function fetchCitiesLocal(): Promise<City[]> {
  return fetchJson<City[]>(LOCAL_CITIES_URL);
}

/**
 * Loads cities from an online JSON source, falling back to the local file.
 * Override the remote URL with VITE_CITIES_REMOTE_URL when needed.
 */
export async function fetchCities(): Promise<{ cities: City[]; source: 'remote' | 'local' }> {
  const remoteUrl = import.meta.env.VITE_CITIES_REMOTE_URL || DEFAULT_REMOTE_CITIES_URL;

  try {
    const remote = await fetchJson<RemoteCityRecord[]>(remoteUrl);
    return { cities: mapRemoteCities(remote), source: 'remote' };
  } catch {
    const local = await fetchCitiesLocal();
    return { cities: local, source: 'local' };
  }
}

/** Case-insensitive match used by the autocomplete. */
export function filterCities(cities: City[], query: string, limit = 8): City[] {
  const normalized = query.trim().toLowerCase();

  if (normalized.length < 2) {
    return [];
  }

  const results: City[] = [];

  for (const city of cities) {
    const name = city.name.toLowerCase();
    if (name.startsWith(normalized) || name.includes(normalized)) {
      results.push(city);
      if (results.length >= limit) {
        break;
      }
    }
  }

  return results;
}
