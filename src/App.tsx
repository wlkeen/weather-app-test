import { useState } from 'react';
import { CitySearch } from '@/features/cities/CitySearch';
import { ForecastTable } from '@/features/forecast/ForecastTable';
import { STATIC_FORECAST } from '@/features/forecast/staticForecast';

function App() {
  const [query, setQuery] = useState('Prague');
  const [selectedCity, setSelectedCity] = useState('Prague');

  return (
    <main>
      <header>
        <h1>Weather Forecast</h1>
        <p>Five-day temperature forecast for a selected city.</p>
      </header>

      <CitySearch
        value={query}
        onChange={setQuery}
        suggestions={query.length >= 2 ? [`${query} (demo suggestion)`] : []}
        onSelectSuggestion={(value) => {
          setQuery(value.replace(' (demo suggestion)', ''));
          setSelectedCity(value.replace(' (demo suggestion)', ''));
        }}
      />

      <ForecastTable days={STATIC_FORECAST} cityLabel={selectedCity} status="succeeded" />
    </main>
  );
}

export default App;
