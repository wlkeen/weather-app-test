import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { City, LoadingStatus } from '@/types/weather';

export interface CitiesState {
    allCities: City[];
    suggestions: City[];
    query: string;
    selectedCity: City | null;
    status: LoadingStatus;
    error: string | null;
    /** Whether the catalogue came from the remote JSON or the local fallback. */
    source: 'remote' | 'local' | null;
    geoStatus: LoadingStatus;
    geoError: string | null;
}

const initialState: CitiesState = {
    allCities: [],
    suggestions: [],
    query: '',
    selectedCity: null,
    status: 'idle',
    error: null,
    source: null,
    geoStatus: 'idle',
    geoError: null,
};

const citiesSlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        setSuggestions(state, action: PayloadAction<City[]>) {
            state.suggestions = action.payload;
        },
        selectCity(state, action: PayloadAction<City>) {
            state.selectedCity = action.payload;
            state.query = `${action.payload.name}, ${action.payload.country}`;
            state.suggestions = [];
            state.geoStatus = 'idle';
            state.geoError = null;
        },
        citiesLoadRequested(state) {
            state.status = 'loading';
            state.error = null;
        },
        citiesLoadSucceeded(
            state,
            action: PayloadAction<{ cities: City[]; source: 'remote' | 'local' }>,
        ) {
            state.allCities = action.payload.cities;
            state.source = action.payload.source;
            state.status = 'succeeded';
        },
        citiesLoadFailed(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        geolocationRequested(state) {
            state.geoStatus = 'loading';
            state.geoError = null;
        },
        geolocationFailed(state, action: PayloadAction<string>) {
            state.geoStatus = 'failed';
            state.geoError = action.payload;
        },
    },
});

export const {
    setQuery,
    setSuggestions,
    selectCity,
    citiesLoadRequested,
    citiesLoadSucceeded,
    citiesLoadFailed,
    geolocationRequested,
    geolocationFailed,
} = citiesSlice.actions;

export const citiesReducer = citiesSlice.reducer;
