import { put, takeLatest } from 'redux-saga/effects';
import { selectCity } from '@/features/cities/citiesSlice';
import { STATIC_FORECAST } from '@/features/forecast/staticForecast';
import { forecastRequested, forecastSucceeded } from './forecastSlice';

/**
 * Placeholder forecast saga: serves static data when a city is selected.
 * Replaced by a real/mocked HTTP fetch in later commits.
 */
function* handleCitySelected() {
    yield put(forecastRequested());
    yield put(forecastSucceeded(STATIC_FORECAST));
}

export function* forecastSaga() {
    yield takeLatest(selectCity.type, handleCitySelected);
}
