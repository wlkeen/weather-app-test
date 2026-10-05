import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { CitySearch } from '@/features/cities/CitySearch';
import { CITIES_BOOTSTRAP, GEOLOCATION_REQUESTED } from '@/features/cities/citiesSaga';
import { selectCity, setQuery } from '@/features/cities/citiesSlice';
import { ForecastChart } from '@/features/forecast/ForecastChart';
import { ForecastTable } from '@/features/forecast/ForecastTable';
import { formatCityLabel } from '@/utils/cityLabel';

/**
 * Root SPA with autocomplete, live/mock forecast, chart, and geolocation.
 */
function App() {
  const dispatch = useAppDispatch();
  const {
    query,
    suggestions,
    selectedCity,
    status: citiesStatus,
    error: citiesError,
    source,
    geoStatus,
    geoError,
  } = useAppSelector((state) => state.cities);
  const { days, status, error } = useAppSelector((state) => state.forecast);

  useEffect(() => {
    dispatch({ type: CITIES_BOOTSTRAP });
  }, [dispatch]);

  const suggestionLabels = suggestions.map((city) => formatCityLabel(city));
  const usingMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Weather Forecast</h1>
        <p>Five-day temperature outlook with city autocomplete powered by OpenWeatherMap.</p>
        {usingMockApi && (
          <p className="mock-note" role="note">
            Mock API mode is enabled (MSW). Set VITE_USE_MOCK_API=false to use the live API.
          </p>
        )}
        {source && (
          <p className="mock-note" role="status">
            City list loaded from {source === 'remote' ? 'online JSON' : 'local fallback file'}.
          </p>
        )}
      </header>

      <div className="geo-actions">
        <button
          type="button"
          onClick={() => dispatch({ type: GEOLOCATION_REQUESTED })}
          disabled={geoStatus === 'loading'}
        >
          {geoStatus === 'loading' ? 'Locating…' : 'Use my location'}
        </button>
      </div>
      {geoError && (
        <p className="alert-line" role="alert">
          {geoError}
        </p>
      )}

      <CitySearch
        value={query}
        onChange={(value) => dispatch(setQuery(value))}
        suggestions={suggestionLabels}
        onSelectSuggestion={(label) => {
          const city = suggestions.find((item) => formatCityLabel(item) === label);
          if (city) {
            dispatch(selectCity(city));
          }
        }}
      />

      {citiesStatus === 'loading' && (
        <p className="status-line" role="status">
          Loading cities…
        </p>
      )}
      {citiesStatus === 'failed' && (
        <p className="alert-line" role="alert">
          {citiesError}
        </p>
      )}

      <ForecastTable
        days={days}
        cityLabel={selectedCity ? formatCityLabel(selectedCity) : undefined}
        status={status}
        errorMessage={error}
        chart={days.length > 0 ? <ForecastChart days={days} /> : null}
      />
    </main>
  );
}

export default App;
