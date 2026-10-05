import { all, fork } from 'redux-saga/effects';
import { citiesSaga } from '@/features/cities/citiesSaga';
import { forecastSaga } from '@/features/forecast/forecastSaga';

/** Composes feature sagas into a single root saga. */
export function* rootSaga() {
  yield all([fork(citiesSaga), fork(forecastSaga)]);
}
