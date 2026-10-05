import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, translateMessage } from '@/i18n';
import type { DailyForecast, LoadingStatus } from '@/types/weather';
import { formatForecastDate } from '@/utils/formatDate';

interface ForecastTableProps {
  days: DailyForecast[];
  cityLabel?: string;
  status?: LoadingStatus;
  errorMessage?: string | null;
  /** Optional chart slot rendered under the table (bonus). */
  chart?: ReactNode;
}

/**
 * Renders the five-day forecast as an accessible HTML table.
 */
export function ForecastTable({
  days,
  cityLabel,
  status = 'succeeded',
  errorMessage = null,
  chart,
}: ForecastTableProps) {
  const { t, i18n } = useTranslation();

  if (status === 'loading') {
    return (
      <p className="status-line" role="status">
        {t('forecast.loading')}
      </p>
    );
  }

  if (status === 'failed') {
    return (
      <p className="alert-line" role="alert">
        {translateMessage(errorMessage, 'forecast.failed')}
      </p>
    );
  }

  if (days.length === 0) {
    return (
      <p className="status-line" role="status">
        {t('forecast.empty')}
      </p>
    );
  }

  return (
    <section className="forecast" aria-label={t('forecast.aria')}>
      {cityLabel ? (
        <h2>{t('forecast.for', { city: cityLabel })}</h2>
      ) : (
        <h2>{t('forecast.title')}</h2>
      )}
      <div className="forecast-table-wrap">
        <table className="forecast-table">
          <thead>
            <tr>
              <th scope="col">{t('forecast.date')}</th>
              <th scope="col">{t('forecast.min')}</th>
              <th scope="col">{t('forecast.max')}</th>
              <th scope="col">{t('forecast.conditions')}</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.dateUnix}>
                <td>
                  <time dateTime={new Date(day.dateUnix * 1000).toISOString()}>
                    {formatForecastDate(day.dateUnix, getIntlLocale(i18n.language))}
                  </time>
                </td>
                <td>{day.tempMin.toFixed(1)}</td>
                <td>{day.tempMax.toFixed(1)}</td>
                <td>{day.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {chart}
    </section>
  );
}
