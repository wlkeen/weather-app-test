/** Subset of the OpenWeatherMap 5-day / 3-hour forecast response. */

export interface OwmForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface OwmForecastResponse {
  list: OwmForecastItem[];
  city: {
    id: number;
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}
