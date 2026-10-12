/// <reference types="vite/client" />

/**
 * Typed Vite environment variables used by the weather app.
 * Values come from `.env` / build-time injection (see `.env.example`).
 */
interface ImportMetaEnv {
  /** Legacy: only used by the commented direct-OWM path in weatherApi.ts. */
  readonly VITE_OPENWEATHER_API_KEY?: string;
  /** Optional absolute Weather API base (default: same-origin `/api` via Vite proxy). */
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_CITIES_REMOTE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
