/// <reference types="vite/client" />

/**
 * Typed Vite environment variables used by the weather app.
 * Values come from `.env` / build-time injection (see `.env.example`).
 */
interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_CITIES_REMOTE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
