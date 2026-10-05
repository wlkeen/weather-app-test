import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { RootState } from '@/app/store';
import { filterCities, fetchCities } from '@/services/citiesApi';
import type { City, Coordinates } from '@/types/weather';
import {
  citiesLoadFailed,
  citiesLoadRequested,
  citiesLoadSucceeded,
  geolocationFailed,
  geolocationRequested,
  selectCity,
  setQuery,
  setSuggestions,
} from './citiesSlice';

export const CITIES_BOOTSTRAP = 'cities/bootstrap';
export const GEOLOCATION_REQUESTED = 'cities/geolocationRequestedByUser';

function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('errors.geolocationUnsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        reject(new Error('errors.geolocationFailed'));
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  });
}

function* loadCities() {
  try {
    yield put(citiesLoadRequested());
    const result: { cities: City[]; source: 'remote' | 'local' } = yield call(fetchCities);
    yield put(citiesLoadSucceeded(result));
  } catch {
    yield put(citiesLoadFailed('errors.failedCities'));
  }
}

function* handleQueryChange(action: ReturnType<typeof setQuery>) {
  const allCities: City[] = yield select((state: RootState) => state.cities.allCities);
  const suggestions = filterCities(allCities, action.payload);
  yield put(setSuggestions(suggestions));
}

function* handleGeolocation() {
  try {
    yield put(geolocationRequested());
    const coords: Coordinates = yield call(getCurrentPosition);
    const city: City = {
      id: -1,
      name: 'Current location',
      country: 'GPS',
      coord: coords,
    };
    yield put(selectCity(city));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'errors.geolocationGeneric';
    yield put(geolocationFailed(message));
  }
}

export function* citiesSaga() {
  yield takeLatest(CITIES_BOOTSTRAP, loadCities);
  yield takeLatest(setQuery.type, handleQueryChange);
  yield takeLatest(GEOLOCATION_REQUESTED, handleGeolocation);
}
