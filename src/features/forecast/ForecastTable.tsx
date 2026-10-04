import type { DailyForecast } from '@/types/weather';
import { formatForecastDate } from '@/utils/formatDate';

interface ForecastTableProps {
  days: DailyForecast[];
  cityLabel?: string;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorMessage?: string | null;
}

/**
 * Renders the five-day forecast as an accessible HTML table.
 */
export function ForecastTable({
  days,
  cityLabel,
  status = 'succeeded',
  errorMessage = null,
}: ForecastTableProps) {
  if (status === 'loading') {
    return <p role="status">Loading forecast…</p>;
  }

  if (status === 'failed') {
    return <p role="alert">{errorMessage ?? 'Failed to load forecast.'}</p>;
  }

  if (days.length === 0) {
    return <p role="status">Select a city to see the five-day forecast.</p>;
  }

  return (
    <section aria-label="Five-day forecast">
      {cityLabel ? <h2>Forecast for {cityLabel}</h2> : <h2>Forecast</h2>}
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Min (°C)</th>
            <th scope="col">Max (°C)</th>
            <th scope="col">Conditions</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.dateUnix}>
              <td>{formatForecastDate(day.dateUnix)}</td>
              <td>{day.tempMin.toFixed(1)}</td>
              <td>{day.tempMax.toFixed(1)}</td>
              <td>{day.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
