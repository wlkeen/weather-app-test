import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { CitySearch } from '@/features/cities/CitySearch';
import { CITIES_BOOTSTRAP } from '@/features/cities/citiesSaga';
import { selectCity, setQuery } from '@/features/cities/citiesSlice';
import { ForecastTable } from '@/features/forecast/ForecastTable';
import { formatCityLabel } from '@/utils/cityLabel';

/**
 * Root SPA connected to Redux and OpenWeatherMap (or MSW when VITE_USE_MOCK_API=true).
 */
function App() {
  const dispatch = useAppDispatch();
  const { query, suggestions, selectedCity, status: citiesStatus, error: citiesError } =
    useAppSelector((state) => state.cities);
  const { days, status, error } = useAppSelector((state) => state.forecast);

  useEffect(() => {
    dispatch({ type: CITIES_BOOTSTRAP });
  }, [dispatch]);

  const suggestionLabels = suggestions.map((city) => formatCityLabel(city));
  const usingMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  return (
    <main>
      <header>
        <h1>Weather Forecast</h1>
        <p>Five-day temperature forecast for a selected city.</p>
        {usingMockApi && (
          <p role="note">Mock API mode is enabled (MSW). Set VITE_USE_MOCK_API=false to use the live API.</p>
        )}
      </header>

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

      {citiesStatus === 'loading' && <p role="status">Loading cities…</p>}
      {citiesStatus === 'failed' && <p role="alert">{citiesError}</p>}

      <ForecastTable
        days={days}
        cityLabel={selectedCity ? formatCityLabel(selectedCity) : undefined}
        status={status}
        errorMessage={error}
      />
    </main>
  );
}

export default App;
