import { describe, expect, it } from 'vitest';
import type { City } from '@/types/weather';
import { filterCities } from './citiesApi';

const cities: City[] = [
  { id: 1, name: 'Prague', country: 'CZ', coord: { lat: 50.08, lon: 14.42 } },
  { id: 2, name: 'Paris', country: 'FR', coord: { lat: 48.85, lon: 2.35 } },
  { id: 3, name: 'Berlin', country: 'DE', coord: { lat: 52.52, lon: 13.4 } },
];

describe('filterCities', () => {
  it('returns an empty list for short queries', () => {
    expect(filterCities(cities, 'p')).toEqual([]);
  });

  it('matches city names case-insensitively', () => {
    expect(filterCities(cities, 'pra')).toEqual([cities[0]]);
  });

  it('respects the result limit', () => {
    const many = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      name: `Port ${index}`,
      country: 'XX',
      coord: { lat: 0, lon: 0 },
    }));

    expect(filterCities(many, 'port', 5)).toHaveLength(5);
  });
});
