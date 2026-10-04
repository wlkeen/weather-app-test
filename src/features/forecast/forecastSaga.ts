import { call, put, takeLatest } from 'redux-saga/effects';
import { selectCity } from '@/features/cities/citiesSlice';
import { fetchFiveDayForecast } from '@/services/weatherApi';
import type { DailyForecast } from '@/types/weather';
import { forecastFailed, forecastRequested, forecastSucceeded } from './forecastSlice';

function* handleCitySelected(action: ReturnType<typeof selectCity>) {
    try {
        yield put(forecastRequested());
        const days: DailyForecast[] = yield call(fetchFiveDayForecast, action.payload.coord);
        yield put(forecastSucceeded(days));
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load forecast';
        yield put(forecastFailed(message));
    }
}

export function* forecastSaga() {
    yield takeLatest(selectCity.type, handleCitySelected);
}
