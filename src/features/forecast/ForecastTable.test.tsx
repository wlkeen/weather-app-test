import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DailyForecast } from '@/types/weather';
import { ForecastTable } from './ForecastTable';

const sampleDays: DailyForecast[] = [
  {
    dateUnix: 1717200000,
    tempMin: 12.3,
    tempMax: 18.7,
    description: 'clear sky',
    icon: '01d',
  },
];

describe('ForecastTable', () => {
  it('shows an empty-state message when there is no data', () => {
    render(<ForecastTable days={[]} status="idle" />);
    expect(screen.getByRole('status')).toHaveTextContent(/select a city/i);
  });

  it('renders forecast rows for loaded data', () => {
    render(<ForecastTable days={sampleDays} cityLabel="Prague, CZ" status="succeeded" />);

    expect(screen.getByRole('heading', { name: /forecast for prague, cz/i })).toBeInTheDocument();
    expect(screen.getByText('12.3')).toBeInTheDocument();
    expect(screen.getByText('18.7')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('surfaces API errors', () => {
    render(<ForecastTable days={[]} status="failed" errorMessage="errors.missingApiKey" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/missing openweathermap api key/i);
  });
});
    