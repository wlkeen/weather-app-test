import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { CitySearch } from '@/features/cities/CitySearch';
import { CITIES_BOOTSTRAP, GEOLOCATION_REQUESTED } from '@/features/cities/citiesSaga';
import { selectCity, setQuery } from '@/features/cities/citiesSlice';
import { ForecastChart } from '@/features/forecast/ForecastChart';
import { ForecastTable } from '@/features/forecast/ForecastTable';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { translateMessage } from '@/i18n';
import { formatCityLabel } from '@/utils/cityLabel';

/**
 * Root SPA with autocomplete, live/mock forecast, chart, geolocation, and i18n.
 */
function App() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
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

  // Refetch forecast when language changes so OWM descriptions match the UI.
  useEffect(() => {
    if (selectedCity) {
      dispatch(selectCity(selectedCity));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to language changes
  }, [i18n.language, dispatch]);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage === 'cz' ? 'cs' : 'en';
  }, [i18n.resolvedLanguage]);

  const suggestionLabels = suggestions.map((city) => formatCityLabel(city));
  const usingMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  const cityLabel = selectedCity
    ? selectedCity.id === -1
      ? t('geo.currentLocation')
      : formatCityLabel(selectedCity)
    : undefined;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__top">
          <h1>{t('app.title')}</h1>
          <LanguageSwitcher />
        </div>
        <p>{t('app.subtitle')}</p>
        {usingMockApi && (
          <p className="mock-note" role="note">
            {t('app.mockMode')}
          </p>
        )}
        {source && (
          <p className="mock-note" role="status">
            {source === 'remote' ? t('app.citiesRemote') : t('app.citiesLocal')}
          </p>
        )}
      </header>

      <div className="geo-actions">
        <button
          type="button"
          onClick={() => dispatch({ type: GEOLOCATION_REQUESTED })}
          disabled={geoStatus === 'loading'}
        >
          {geoStatus === 'loading' ? t('geo.locating') : t('geo.useLocation')}
        </button>
      </div>
      {geoError && (
        <p className="alert-line" role="alert">
          {translateMessage(geoError, 'errors.geolocationGeneric')}
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
          {t('city.loading')}
        </p>
      )}
      {citiesStatus === 'failed' && (
        <p className="alert-line" role="alert">
          {translateMessage(citiesError, 'errors.failedCities')}
        </p>
      )}

      <ForecastTable
        days={days}
        cityLabel={cityLabel}
        status={status}
        errorMessage={error}
        chart={days.length > 0 ? <ForecastChart days={days} /> : null}
      />
    </main>
  );
}

export default App;
