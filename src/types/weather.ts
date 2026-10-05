/** Domain types shared across features (UI shell uses static data of this shape). */

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface City {
  id: number;
  name: string;
  country: string;
  state?: string;
  coord: Coordinates;
}

export interface DailyForecast {
  /** Unix timestamp (seconds) for the representative day. */
  dateUnix: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
