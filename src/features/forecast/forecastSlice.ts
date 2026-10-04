import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DailyForecast, LoadingStatus } from '@/types/weather';

export interface ForecastState {
    days: DailyForecast[];
    status: LoadingStatus;
    error: string | null;
}

const initialState: ForecastState = {
    days: [],
    status: 'idle',
    error: null,
};

const forecastSlice = createSlice({
    name: 'forecast',
    initialState,
    reducers: {
        forecastRequested(state) {
            state.status = 'loading';
            state.error = null;
        },
        forecastSucceeded(state, action: PayloadAction<DailyForecast[]>) {
            state.days = action.payload;
            state.status = 'succeeded';
        },
        forecastFailed(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
            state.days = [];
        },
        forecastCleared(state) {
            state.days = [];
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const { forecastRequested, forecastSucceeded, forecastFailed, forecastCleared } =
    forecastSlice.actions;

export const forecastReducer = forecastSlice.reducer;
