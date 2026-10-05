import { describe, expect, it } from 'vitest';
import type { City } from '@/types/weather';
import { citiesReducer, selectCity, setQuery, setSuggestions } from './citiesSlice';

const prague: City = {
  id: 1,
  name: 'Prague',
  country: 'CZ',
  coord: { lat: 50.08, lon: 14.42 },
};

describe('citiesSlice', () => {
  it('updates the query text', () => {
    const state = citiesReducer(undefined, setQuery('Pra'));
    expect(state.query).toBe('Pra');
  });

  it('stores autocomplete suggestions', () => {
    const state = citiesReducer(undefined, setSuggestions([prague]));
    expect(state.suggestions).toEqual([prague]);
  });

  it('selects a city and clears suggestions', () => {
    const withSuggestions = citiesReducer(undefined, setSuggestions([prague]));
    const state = citiesReducer(withSuggestions, selectCity(prague));

    expect(state.selectedCity).toEqual(prague);
    expect(state.query).toBe('Prague, CZ');
    expect(state.suggestions).toEqual([]);
  });
});
