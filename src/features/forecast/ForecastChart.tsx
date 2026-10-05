import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { DailyForecast } from '@/types/weather';
import { formatForecastDate } from '@/utils/formatDate';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ForecastChartProps {
  days: DailyForecast[];
}

/**
 * Temperature trend chart for the selected five-day forecast.
 */
export function ForecastChart({ days }: ForecastChartProps) {
  const labels = days.map((day) => formatForecastDate(day.dateUnix));

  return (
    <div className="forecast-chart">
      <h3>Temperature trend</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Max °C',
              data: days.map((day) => day.tempMax),
              borderColor: '#0b6e99',
              backgroundColor: 'rgba(11, 110, 153, 0.15)',
              tension: 0.3,
            },
            {
              label: 'Min °C',
              data: days.map((day) => day.tempMin),
              borderColor: '#4a5a70',
              backgroundColor: 'rgba(74, 90, 112, 0.12)',
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: '°C',
              },
            },
          },
        }}
      />
    </div>
  );
}
