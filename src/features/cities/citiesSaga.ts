import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { RootState } from '@/app/store';
import { filterCities, fetchCitiesLocal } from '@/services/citiesApi';
import type { City } from '@/types/weather';
import {
    citiesLoadFailed,
    citiesLoadRequested,
    citiesLoadSucceeded,
    setQuery,
    setSuggestions,
} from './citiesSlice';

export const CITIES_BOOTSTRAP = 'cities/bootstrap';

function* loadCities() {
    try {
        yield put(citiesLoadRequested());
        const cities: City[] = yield call(fetchCitiesLocal);
        yield put(citiesLoadSucceeded({ cities, source: 'local' }));
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load cities';
        yield put(citiesLoadFailed(message));
    }
}

function* handleQueryChange(action: ReturnType<typeof setQuery>) {
    const allCities: City[] = yield select((state: RootState) => state.cities.allCities);
    const suggestions = filterCities(allCities, action.payload);
    yield put(setSuggestions(suggestions));
}

export function* citiesSaga() {
    yield takeLatest(CITIES_BOOTSTRAP, loadCities);
    yield takeLatest(setQuery.type, handleQueryChange);
}
